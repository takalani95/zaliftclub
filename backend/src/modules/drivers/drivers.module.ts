import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { DriverProfile } from './driver-profile.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverProfile, User])],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
