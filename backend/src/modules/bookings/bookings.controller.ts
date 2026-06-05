import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Book a trip' })
  create(
    @CurrentUser() user: any,
    @Body() body: { tripId: string; seats: number; pickupLocation?: string },
  ) {
    return this.bookingsService.createBooking(user.id, body.tripId, body.seats, body.pickupLocation);
  }

  @Get()
  @ApiOperation({ summary: 'Get my bookings' })
  getMyBookings(@CurrentUser() user: any) {
    return this.bookingsService.getMyBookings(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() body: { reason?: string },
  ) {
    return this.bookingsService.cancelBooking(id, user.id, body?.reason);
  }
}
