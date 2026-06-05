export declare class CreateTripDto {
    departureCity: string;
    departureLocation: string;
    destinationCity: string;
    destinationLocation: string;
    departureDate: string;
    departureTime: string;
    availableSeats: number;
    pricePerSeat: number;
    luggageAllowed?: boolean;
    smokingAllowed?: boolean;
    petsAllowed?: boolean;
    womenOnly?: boolean;
    notes?: string;
}
