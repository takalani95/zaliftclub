import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Booking } from '../bookings/booking.entity';
import { DriverProfile } from '../drivers/driver-profile.entity';
import { CreateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(DriverProfile) private driverRepository: Repository<DriverProfile>,
  ) {}

  async createTrip(userId: string, dto: CreateTripDto) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId, approval_status: 'approved' },
    });
    if (!driver) throw new BadRequestException('Driver profile not approved');

    const trip = this.tripRepository.create({
      driver_id: driver.id,
      departure_city: dto.departureCity, departure_location: dto.departureLocation,
      destination_city: dto.destinationCity, destination_location: dto.destinationLocation,
      departure_date: new Date(dto.departureDate), departure_time: dto.departureTime,
      available_seats: dto.availableSeats, total_seats: dto.availableSeats,
      price_per_seat: dto.pricePerSeat,
      luggage_allowed: dto.luggageAllowed ?? true,
      smoking_allowed: dto.smokingAllowed ?? false,
      pets_allowed: dto.petsAllowed ?? false,
      women_only: dto.womenOnly ?? false,
      additional_notes: dto.notes,
    });
    return this.tripRepository.save(trip);
  }

  async searchTrips(from: string, to: string, date?: string) {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('driver.user', 'user')
      .where('LOWER(trip.departure_city) = LOWER(:from)', { from })
      .andWhere('LOWER(trip.destination_city) = LOWER(:to)', { to })
      .andWhere('trip.status = :status', { status: 'active' })
      .andWhere('trip.available_seats > 0')
      .orderBy('trip.departure_time', 'ASC');

    if (date) query.andWhere('trip.departure_date = :date', { date });
    return query.getMany();
  }

  async getTripById(id: string) {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: { driver: { user: true } },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  async getMyTrips(userId: string) {
    const driver = await this.driverRepository.findOne({ where: { user_id: userId } });
    if (!driver) return [];
    return this.tripRepository.find({
      where: { driver_id: driver.id },
      order: { departure_date: 'DESC' },
    });
  }

  async cancelTrip(tripId: string, userId: string) {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: { driver: true },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    if (trip.driver.user_id !== userId) throw new BadRequestException('Not authorized');
    if (trip.status !== 'active') throw new BadRequestException('Trip cannot be cancelled');

    trip.status = 'cancelled';
    await this.tripRepository.save(trip);
    await this.bookingRepository.update(
      { trip_id: tripId, status: 'confirmed' },
      { status: 'cancelled', cancelled_at: new Date(), cancellation_reason: 'Trip cancelled by driver' },
    );
    return { message: 'Trip cancelled successfully' };
  }
}
