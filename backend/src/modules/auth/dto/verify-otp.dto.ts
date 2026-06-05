import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsString()
  identifier: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'email_verification' })
  @IsString()
  purpose: string;
}
