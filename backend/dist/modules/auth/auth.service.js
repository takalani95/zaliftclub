"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/user.entity");
const otp_entity_1 = require("./otp.entity");
let AuthService = class AuthService {
    userRepository;
    otpRepository;
    jwtService;
    configService;
    constructor(userRepository, otpRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const existing = await this.userRepository.findOne({
            where: [{ email: dto.email }, { phone: dto.phone }],
        });
        if (existing)
            throw new common_1.ConflictException('Email or phone already in use');
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = this.userRepository.create({
            email: dto.email, phone: dto.phone, password_hash: passwordHash,
            first_name: dto.firstName, last_name: dto.lastName,
            user_type: dto.userType || 'passenger',
        });
        const saved = await this.userRepository.save(user);
        const otp = await this.createOtp(dto.email, 'email_verification');
        console.log(`OTP for ${dto.email}: ${otp}`);
        return { user: this.sanitize(saved), ...this.generateTokens(saved) };
    }
    async login(dto) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password_hash')
            .where('user.email = :email', { email: dto.email })
            .getOne();
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (user.is_banned)
            throw new common_1.UnauthorizedException('Account is banned');
        if (!user.is_active)
            throw new common_1.UnauthorizedException('Account is inactive');
        const valid = await bcrypt.compare(dto.password, user.password_hash);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        user.last_login = new Date();
        await this.userRepository.save(user);
        return { user: this.sanitize(user), ...this.generateTokens(user) };
    }
    async verifyOtp(dto) {
        const otp = await this.otpRepository.findOne({
            where: { identifier: dto.identifier, code: dto.code, purpose: dto.purpose, used: false },
        });
        if (!otp)
            throw new common_1.BadRequestException('Invalid OTP');
        if (otp.expires_at < new Date())
            throw new common_1.BadRequestException('OTP expired');
        otp.used = true;
        await this.otpRepository.save(otp);
        if (dto.purpose === 'email_verification') {
            await this.userRepository.update({ email: dto.identifier }, { is_verified: true });
        }
        return { message: 'OTP verified successfully' };
    }
    async refreshToken(token) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.userRepository.findOne({ where: { id: payload.sub } });
            if (!user)
                throw new common_1.UnauthorizedException();
            return this.generateTokens(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async getMe(userId) {
        return this.userRepository.findOne({ where: { id: userId } });
    }
    async createOtp(identifier, purpose) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        await this.otpRepository.save(this.otpRepository.create({ identifier, code, purpose, expires_at }));
        return code;
    }
    generateTokens(user) {
        const payload = { sub: user.id, email: user.email, type: user.user_type };
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_SECRET'), expiresIn: '15m',
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '7d',
            }),
        };
    }
    sanitize(user) {
        const { password_hash, ...rest } = user;
        return rest;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(otp_entity_1.OtpCode)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map