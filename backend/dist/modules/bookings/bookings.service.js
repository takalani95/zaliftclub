"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
const trip_entity_1 = require("../trips/trip.entity");
let BookingsService = class BookingsService {
    bookingRepository;
    tripRepository;
    constructor(bookingRepository, tripRepository) {
        this.bookingRepository = bookingRepository;
        this.tripRepository = tripRepository;
    }
    async createBooking(passengerId, tripId, seats, pickupLocation) {
        const trip = await this.tripRepository.findOne({ where: { id: tripId, status: 'active' } });
        if (!trip)
            throw new common_1.NotFoundException('Trip not found or unavailable');
        if (trip.available_seats < seats)
            throw new common_1.BadRequestException('Not enough seats available');
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
        if (trip.available_seats === 0)
            trip.status = 'fully_booked';
        await this.tripRepository.save(trip);
        return saved;
    }
    async cancelBooking(bookingId, passengerId, reason) {
        const booking = await this.bookingRepository.findOne({
            where: { id: bookingId, passenger_id: passengerId },
            relations: { trip: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        if (booking.status !== 'confirmed')
            throw new common_1.BadRequestException('Cannot cancel this booking');
        const hoursLeft = (new Date(booking.trip.departure_date).getTime() - Date.now()) / 3600000;
        let refundAmount = Number(booking.total_amount);
        if (hoursLeft < 1)
            refundAmount *= 0.5;
        else if (hoursLeft < 6)
            refundAmount *= 0.75;
        booking.status = 'cancelled';
        booking.cancelled_at = new Date();
        booking.cancellation_reason = reason || 'Cancelled by passenger';
        await this.bookingRepository.save(booking);
        booking.trip.available_seats += booking.seats_booked;
        if (booking.trip.status === 'fully_booked')
            booking.trip.status = 'active';
        await this.tripRepository.save(booking.trip);
        return { message: 'Booking cancelled', refundAmount };
    }
    async getMyBookings(passengerId) {
        return this.bookingRepository.find({
            where: { passenger_id: passengerId },
            relations: { trip: { driver: { user: true } } },
            order: { created_at: 'DESC' },
        });
    }
    async getBookingById(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: { trip: { driver: { user: true } }, passenger: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        return booking;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map