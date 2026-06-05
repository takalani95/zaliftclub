import { Repository } from 'typeorm';
import { DriverProfile } from './driver-profile.entity';
import { User } from '../users/user.entity';
export declare class DriversService {
    private driverRepository;
    private userRepository;
    constructor(driverRepository: Repository<DriverProfile>, userRepository: Repository<User>);
    applyAsDriver(userId: string, dto: any): Promise<{
        message: string;
        driver: DriverProfile;
    }>;
    getDriverProfile(userId: string): Promise<DriverProfile>;
    getPendingDrivers(): Promise<DriverProfile[]>;
    approveDriver(driverId: string): Promise<DriverProfile>;
    rejectDriver(driverId: string, reason: string): Promise<DriverProfile>;
}
