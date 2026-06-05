import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Trip } from '../trips/trip.entity';
export declare class BookingsService {
    private bookingRepository;
    private tripRepository;
    constructor(bookingRepository: Repository<Booking>, tripRepository: Repository<Trip>);
    createBooking(passengerId: string, tripId: string, seats: number, pickupLocation?: string): Promise<Booking>;
    cancelBooking(bookingId: string, passengerId: string, reason?: string): Promise<{
        message: string;
        refundAmount: number;
    }>;
    getMyBookings(passengerId: string): Promise<Booking[]>;
    getBookingById(id: string): Promise<Booking>;
}
