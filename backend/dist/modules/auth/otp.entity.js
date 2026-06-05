"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpCode = void 0;
const typeorm_1 = require("typeorm");
let OtpCode = class OtpCode {
    id;
    identifier;
    code;
    purpose;
    expires_at;
    used;
    created_at;
};
exports.OtpCode = OtpCode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OtpCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OtpCode.prototype, "identifier", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OtpCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OtpCode.prototype, "purpose", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OtpCode.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], OtpCode.prototype, "used", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OtpCode.prototype, "created_at", void 0);
exports.OtpCode = OtpCode = __decorate([
    (0, typeorm_1.Entity)('otp_codes')
], OtpCode);
//# sourceMappingURL=otp.entity.js.map