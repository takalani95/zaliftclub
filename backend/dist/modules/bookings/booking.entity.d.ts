import { Trip } from '../trips/trip.entity';
import { User } from '../users/user.entity';
export declare class Booking {
    id: string;
    trip_id: string;
    trip: Trip;
    passenger_id: string;
    passenger: User;
    seats_booked: number;
    total_amount: number;
    commission_amount: number;
    driver_payout: number;
    status: string;
    pickup_location: string;
    special_requests: string;
    cancellation_reason: string;
    cancelled_at: Date;
    confirmed_at: Date;
    completed_at: Date;
    created_at: Date;
    updated_at: Date;
}
