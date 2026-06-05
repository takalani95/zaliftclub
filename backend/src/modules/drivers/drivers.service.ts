import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DriverProfile } from './driver-profile.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DriversService {
  constructor(
    @InjectRepository(DriverProfile) private driverRepository: Repository<DriverProfile>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async applyAsDriver(userId: string, dto: any) {
    const existing = await this.driverRepository.findOne({ where: { user_id: userId } });
    if (existing) throw new ConflictException('Driver profile already exists');

    const driver = this.driverRepository.create({
      user_id: userId, license_number: dto.licenseNumber, id_number: dto.idNumber,
    });
    await this.driverRepository.save(driver);
    await this.userRepository.update(userId, { user_type: 'driver' });
    return { message: 'Application submitted. Pending approval.', driver };
  }

  async getDriverProfile(userId: string) {
    const driver = await this.driverRepository.findOne({
      where: { user_id: userId },
      relations: { user: true },
    });
    if (!driver) throw new NotFoundException('Driver profile not found');
    return driver;
  }

  async getPendingDrivers() {
    return this.driverRepository.find({
      where: { approval_status: 'pending' },
      relations: { user: true },
    });
  }

  async approveDriver(driverId: string) {
    const driver = await this.driverRepository.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');
    driver.approval_status = 'approved';
    driver.approved_at = new Date();
    return this.driverRepository.save(driver);
  }

  async rejectDriver(driverId: string, reason: string) {
    const driver = await this.driverRepository.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Driver not found');
    driver.approval_status = 'rejected';
    driver.rejection_reason = reason;
    return this.driverRepository.save(driver);
  }
}
