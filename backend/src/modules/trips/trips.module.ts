import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { Trip } from './trip.entity';
import { Booking } from '../bookings/booking.entity';
import { DriverProfile } from '../drivers/driver-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, Booking, DriverProfile])],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
