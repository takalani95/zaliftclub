import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(user: any, body: {
        tripId: string;
        seats: number;
        pickupLocation?: string;
    }): Promise<import("./booking.entity").Booking>;
    getMyBookings(user: any): Promise<import("./booking.entity").Booking[]>;
    findOne(id: string): Promise<import("./booking.entity").Booking>;
    cancel(id: string, user: any, body: {
        reason?: string;
    }): Promise<{
        message: string;
        refundAmount: number;
    }>;
}
