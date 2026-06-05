import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('otp_codes')
export class OtpCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string;

  @Column()
  code: string;

  @Column()
  purpose: string;

  @Column()
  expires_at: Date;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  created_at: Date;
}
