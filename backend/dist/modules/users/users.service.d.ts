import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User>;
    updateProfile(id: string, updateDto: Partial<User>): Promise<User>;
    updateProfilePicture(id: string, url: string): Promise<User>;
}
