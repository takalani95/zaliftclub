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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = void 0;
const typeorm_1 = require("typeorm");
const driver_profile_entity_1 = require("../drivers/driver-profile.entity");
let Trip = class Trip {
    id;
    driver_id;
    driver;
    departure_city;
    departure_location;
    departure_latitude;
    departure_longitude;
    destination_city;
    destination_location;
    destination_latitude;
    destination_longitude;
    departure_date;
    departure_time;
    available_seats;
    total_seats;
    price_per_seat;
    luggage_allowed;
    smoking_allowed;
    pets_allowed;
    women_only;
    additional_notes;
    status;
    distance_km;
    estimated_duration_minutes;
    created_at;
    updated_at;
};
exports.Trip = Trip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Trip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "driver_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_profile_entity_1.DriverProfile),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", driver_profile_entity_1.DriverProfile)
], Trip.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "departure_city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "departure_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Trip.prototype, "departure_latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Trip.prototype, "departure_longitude", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "destination_city", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "destination_location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Trip.prototype, "destination_latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 11, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Trip.prototype, "destination_longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Trip.prototype, "departure_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Trip.prototype, "departure_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Trip.prototype, "available_seats", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Trip.prototype, "total_seats", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Trip.prototype, "price_per_seat", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Trip.prototype, "luggage_allowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Trip.prototype, "smoking_allowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Trip.prototype, "pets_allowed", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Trip.prototype, "women_only", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "additional_notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'active' }),
    __metadata("design:type", String)
], Trip.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Trip.prototype, "distance_km", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Trip.prototype, "estimated_duration_minutes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "updated_at", void 0);
exports.Trip = Trip = __decorate([
    (0, typeorm_1.Entity)('trips')
], Trip);
//# sourceMappingURL=trip.entity.js.map