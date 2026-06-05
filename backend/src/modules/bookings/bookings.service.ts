import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Trip } from '../trips/trip.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
  ) {}

  async createBooking(passengerId: string, tripId: string, seats: number, pickupLocation?: string) {
    const trip = await this.tripRepository.findOne({ where: { id: tripId, status: 'active' } });
    if (!trip) throw new NotFoundException('Trip not found or unavailable');
    if (trip.available_seats < seats) throw new BadRequestException('Not enough seats available');

    const totalAmount = seats * Number(trip.price_per_seat);
    const commission = totalAmount * 0.15;

    const booking = this.bookingRepository.create({
      trip_id: tripId, passenger_id: passengerId, seats_booked: seats,
      total_amount: totalAmount, commission_amount: commission,
      driver_payout: totalAmount - commission,
      status: 'confirmed', pickup_location: pickupLocation, confirmed_at: new Date(),
    });
    const saved = await this.bookingRepository.save(booking);

    trip.available_seats -= seats;
    if (trip.available_seats === 0) trip.status = 'fully_booked';
    await this.tripRepository.save(trip);
    return saved;
  }

  async cancelBooking(bookingId: string, passengerId: string, reason?: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, passenger_id: passengerId },
      relations: { trip: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'confirmed') throw new BadRequestException('Cannot cancel this booking');

    const hoursLeft = (new Date(booking.trip.departure_date).getTime() - Date.now()) / 3600000;
    let refundAmount = Number(booking.total_amount);
    if (hoursLeft < 1) refundAmount *= 0.5;
    else if (hoursLeft < 6) refundAmount *= 0.75;

    booking.status = 'cancelled';
    booking.cancelled_at = new Date();
    booking.cancellation_reason = reason || 'Cancelled by passenger';
    await this.bookingRepository.save(booking);

    booking.trip.available_seats += booking.seats_booked;
    if (booking.trip.status === 'fully_booked') booking.trip.status = 'active';
    await this.tripRepository.save(booking.trip);

    return { message: 'Booking cancelled', refundAmount };
  }

  async getMyBookings(passengerId: string) {
    return this.bookingRepository.find({
      where: { passenger_id: passengerId },
      relations: { trip: { driver: { user: true } } },
      order: { created_at: 'DESC' },
    });
  }

  async getBookingById(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { trip: { driver: { user: true } }, passenger: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
