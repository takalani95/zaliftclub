import { User } from '../users/user.entity';
export declare class DriverProfile {
    id: string;
    user_id: string;
    user: User;
    license_number: string;
    id_number: string;
    is_license_verified: boolean;
    approval_status: string;
    approved_at: Date;
    rejection_reason: string;
    total_earnings: number;
    completed_trips: number;
    created_at: Date;
    updated_at: Date;
}
