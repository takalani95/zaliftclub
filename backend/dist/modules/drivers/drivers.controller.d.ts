import { DriversService } from './drivers.service';
export declare class DriversController {
    private driversService;
    constructor(driversService: DriversService);
    apply(user: any, body: any): Promise<{
        message: string;
        driver: import("./driver-profile.entity").DriverProfile;
    }>;
    getProfile(user: any): Promise<import("./driver-profile.entity").DriverProfile>;
    getPending(): Promise<import("./driver-profile.entity").DriverProfile[]>;
    approve(id: string): Promise<import("./driver-profile.entity").DriverProfile>;
    reject(id: string, reason: string): Promise<import("./driver-profile.entity").DriverProfile>;
}
