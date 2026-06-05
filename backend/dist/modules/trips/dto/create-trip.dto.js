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
exports.CreateTripDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTripDto {
    departureCity;
    departureLocation;
    destinationCity;
    destinationLocation;
    departureDate;
    departureTime;
    availableSeats;
    pricePerSeat;
    luggageAllowed;
    smokingAllowed;
    petsAllowed;
    womenOnly;
    notes;
}
exports.CreateTripDto = CreateTripDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cape Town' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTripDto.prototype, "departureCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cape Town Station, Adderley Street' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTripDto.prototype, "departureLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Johannesburg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTripDto.prototype, "destinationCity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Park Station, Johannesburg' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTripDto.prototype, "destinationLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-25' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTripDto.prototype, "departureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTripDto.prototype, "departureTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTripDto.prototype, "availableSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 350 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTripDto.prototype, "pricePerSeat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTripDto.prototype, "luggageAllowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTripDto.prototype, "smokingAllowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTripDto.prototype, "petsAllowed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTripDto.prototype, "womenOnly", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTripDto.prototype, "notes", void 0);
//# sourceMappingURL=create-trip.dto.js.map