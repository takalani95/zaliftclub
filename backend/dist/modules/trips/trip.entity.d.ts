import { DriverProfile } from '../drivers/driver-profile.entity';
export declare class Trip {
    id: string;
    driver_id: string;
    driver: DriverProfile;
    departure_city: string;
    departure_location: string;
    departure_latitude: number;
    departure_longitude: number;
    destination_city: string;
    destination_location: string;
    destination_latitude: number;
    destination_longitude: number;
    departure_date: Date;
    departure_time: string;
    available_seats: number;
    total_seats: number;
    price_per_seat: number;
    luggage_allowed: boolean;
    smoking_allowed: boolean;
    pets_allowed: boolean;
    women_only: boolean;
    additional_notes: string;
    status: string;
    distance_km: number;
    estimated_duration_minutes: number;
    created_at: Date;
    updated_at: Date;
}
