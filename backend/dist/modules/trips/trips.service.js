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
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trip_entity_1 = require("./trip.entity");
const booking_entity_1 = require("../bookings/booking.entity");
const driver_profile_entity_1 = require("../drivers/driver-profile.entity");
let TripsService = class TripsService {
    tripRepository;
    bookingRepository;
    driverRepository;
    constructor(tripRepository, bookingRepository, driverRepository) {
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
        this.driverRepository = driverRepository;
    }
    async createTrip(userId, dto) {
        const driver = await this.driverRepository.findOne({
            where: { user_id: userId, approval_status: 'approved' },
        });
        if (!driver)
            throw new common_1.BadRequestException('Driver profile not approved');
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
    async searchTrips(from, to, date) {
        const query = this.tripRepository.createQueryBuilder('trip')
            .leftJoinAndSelect('trip.driver', 'driver')
            .leftJoinAndSelect('driver.user', 'user')
            .where('LOWER(trip.departure_city) = LOWER(:from)', { from })
            .andWhere('LOWER(trip.destination_city) = LOWER(:to)', { to })
            .andWhere('trip.status = :status', { status: 'active' })
            .andWhere('trip.available_seats > 0')
            .orderBy('trip.departure_time', 'ASC');
        if (date)
            query.andWhere('trip.departure_date = :date', { date });
        return query.getMany();
    }
    async getTripById(id) {
        const trip = await this.tripRepository.findOne({
            where: { id },
            relations: { driver: { user: true } },
        });
        if (!trip)
            throw new common_1.NotFoundException('Trip not found');
        return trip;
    }
    async getMyTrips(userId) {
        const driver = await this.driverRepository.findOne({ where: { user_id: userId } });
        if (!driver)
            return [];
        return this.tripRepository.find({
            where: { driver_id: driver.id },
            order: { departure_date: 'DESC' },
        });
    }
    async cancelTrip(tripId, userId) {
        const trip = await this.tripRepository.findOne({
            where: { id: tripId },
            relations: { driver: true },
        });
        if (!trip)
            throw new common_1.NotFoundException('Trip not found');
        if (trip.driver.user_id !== userId)
            throw new common_1.BadRequestException('Not authorized');
        if (trip.status !== 'active')
            throw new common_1.BadRequestException('Trip cannot be cancelled');
        trip.status = 'cancelled';
        await this.tripRepository.save(trip);
        await this.bookingRepository.update({ trip_id: tripId, status: 'confirmed' }, { status: 'cancelled', cancelled_at: new Date(), cancellation_reason: 'Trip cancelled by driver' });
        return { message: 'Trip cancelled successfully' };
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(driver_profile_entity_1.DriverProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TripsService);
//# sourceMappingURL=trips.service.js.map