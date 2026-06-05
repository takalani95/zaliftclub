import {
  Injectable, UnauthorizedException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { OtpCode } from './otp.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OtpCode) private otpRepository: Repository<OtpCode>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { phone: dto.phone }],
    });
    if (existing) throw new ConflictException('Email or phone already in use');

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

  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.email = :email', { email: dto.email })
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (user.is_banned) throw new UnauthorizedException('Account is banned');
    if (!user.is_active) throw new UnauthorizedException('Account is inactive');

    const valid = await bcrypt.compare(dto.password, user.password_hash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    user.last_login = new Date();
    await this.userRepository.save(user);
    return { user: this.sanitize(user), ...this.generateTokens(user) };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otp = await this.otpRepository.findOne({
      where: { identifier: dto.identifier, code: dto.code, purpose: dto.purpose, used: false },
    });
    if (!otp) throw new BadRequestException('Invalid OTP');
    if (otp.expires_at < new Date()) throw new BadRequestException('OTP expired');

    otp.used = true;
    await this.otpRepository.save(otp);
    if (dto.purpose === 'email_verification') {
      await this.userRepository.update({ email: dto.identifier }, { is_verified: true });
    }
    return { message: 'OTP verified successfully' };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMe(userId: string) {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  private async createOtp(identifier: string, purpose: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 10 * 60 * 1000);
    await this.otpRepository.save(this.otpRepository.create({ identifier, code, purpose, expires_at }));
    return code;
  }

  private generateTokens(user: User) {
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

  private sanitize(user: User) {
    const { password_hash, ...rest } = user as any;
    return rest;
  }
}
