import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<import("./user.entity").User>;
    updateProfile(user: any, body: any): Promise<import("./user.entity").User>;
    findOne(id: string): Promise<import("./user.entity").User>;
}
