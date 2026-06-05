import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DriverProfile } from '../drivers/driver-profile.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  driver_id: string;

  @ManyToOne(() => DriverProfile)
  @JoinColumn({ name: 'driver_id' })
  driver: DriverProfile;

  @Column()
  departure_city: string;

  @Column()
  departure_location: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  departure_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  departure_longitude: number;

  @Column()
  destination_city: string;

  @Column()
  destination_location: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  destination_latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  destination_longitude: number;

  @Column({ type: 'date' })
  departure_date: Date;

  @Column({ type: 'time' })
  departure_time: string;

  @Column()
  available_seats: number;

  @Column()
  total_seats: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_seat: number;

  @Column({ default: true })
  luggage_allowed: boolean;

  @Column({ default: false })
  smoking_allowed: boolean;

  @Column({ default: false })
  pets_allowed: boolean;

  @Column({ default: false })
  women_only: boolean;

  @Column({ nullable: true })
  additional_notes: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance_km: number;

  @Column({ nullable: true })
  estimated_duration_minutes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
