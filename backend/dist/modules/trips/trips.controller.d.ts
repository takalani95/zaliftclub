import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
export declare class TripsController {
    private tripsService;
    constructor(tripsService: TripsService);
    search(from: string, to: string, date: string): Promise<import("./trip.entity").Trip[]>;
    getMyTrips(user: any): Promise<import("./trip.entity").Trip[]>;
    findOne(id: string): Promise<import("./trip.entity").Trip>;
    create(user: any, dto: CreateTripDto): Promise<import("./trip.entity").Trip>;
    cancel(id: string, user: any): Promise<{
        message: string;
    }>;
}
