import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Trip } from '../trips/trip.entity';
import { User } from '../users/user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  trip_id: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  passenger_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'passenger_id' })
  passenger: User;

  @Column()
  seats_booked: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commission_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  driver_payout: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ nullable: true })
  pickup_location: string;

  @Column({ nullable: true })
  special_requests: string;

  @Column({ nullable: true })
  cancellation_reason: string;

  @Column({ nullable: true })
  cancelled_at: Date;

  @Column({ nullable: true })
  confirmed_at: Date;

  @Column({ nullable: true })
  completed_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
