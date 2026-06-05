import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/user.entity';
import { OtpCode } from './otp.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private userRepository;
    private otpRepository;
    private jwtService;
    private configService;
    constructor(userRepository: Repository<User>, otpRepository: Repository<OtpCode>, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    refreshToken(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getMe(userId: string): Promise<User | null>;
    private createOtp;
    private generateTokens;
    private sanitize;
}
