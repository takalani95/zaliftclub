import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('driver_profiles')
export class DriverProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  user_id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  license_number: string;

  @Column({ nullable: true })
  id_number: string;

  @Column({ default: false })
  is_license_verified: boolean;

  @Column({ default: 'pending' })
  approval_status: string;

  @Column({ nullable: true })
  approved_at: Date;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total_earnings: number;

  @Column({ default: 0 })
  completed_trips: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
