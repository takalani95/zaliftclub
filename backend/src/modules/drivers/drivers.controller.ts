import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('drivers')
export class DriversController {
  constructor(private driversService: DriversService) {}

  @Post('apply')
  @ApiOperation({ summary: 'Apply to become a driver' })
  apply(@CurrentUser() user: any, @Body() body: any) {
    return this.driversService.applyAsDriver(user.id, body);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get my driver profile' })
  getProfile(@CurrentUser() user: any) {
    return this.driversService.getDriverProfile(user.id);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending driver applications (admin)' })
  getPending() {
    return this.driversService.getPendingDrivers();
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a driver (admin)' })
  approve(@Param('id') id: string) {
    return this.driversService.approveDriver(id);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject a driver (admin)' })
  reject(@Param('id') id: string, @Body('reason') reason: string) {
    return this.driversService.rejectDriver(id, reason);
  }
}
