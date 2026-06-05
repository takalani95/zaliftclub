import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(private tripsService: TripsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for available trips' })
  @ApiQuery({ name: 'from', example: 'Cape Town' })
  @ApiQuery({ name: 'to', example: 'Johannesburg' })
  @ApiQuery({ name: 'date', example: '2024-12-25', required: false })
  search(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('date') date: string,
  ) {
    return this.tripsService.searchTrips(from, to, date);
  }

  @Get('my-trips')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my trips (driver)' })
  getMyTrips(@CurrentUser() user: any) {
    return this.tripsService.getMyTrips(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip details' })
  findOne(@Param('id') id: string) {
    return this.tripsService.getTripById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new trip (drivers only)' })
  create(@CurrentUser() user: any, @Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a trip' })
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tripsService.cancelTrip(id, user.id);
  }
}
