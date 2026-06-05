import { Repository } from 'typeorm';
import { Trip } from './trip.entity';
import { Booking } from '../bookings/booking.entity';
import { DriverProfile } from '../drivers/driver-profile.entity';
import { CreateTripDto } from './dto/create-trip.dto';
export declare class TripsService {
    private tripRepository;
    private bookingRepository;
    private driverRepository;
    constructor(tripRepository: Repository<Trip>, bookingRepository: Repository<Booking>, driverRepository: Repository<DriverProfile>);
    createTrip(userId: string, dto: CreateTripDto): Promise<Trip>;
    searchTrips(from: string, to: string, date?: string): Promise<Trip[]>;
    getTripById(id: string): Promise<Trip>;
    getMyTrips(userId: string): Promise<Trip[]>;
    cancelTrip(tripId: string, userId: string): Promise<{
        message: string;
    }>;
}
