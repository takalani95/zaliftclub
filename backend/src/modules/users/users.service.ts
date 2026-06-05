import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, updateDto: Partial<User>) {
    await this.userRepository.update(id, updateDto);
    return this.findById(id);
  }

  async updateProfilePicture(id: string, url: string) {
    await this.userRepository.update(id, { profile_picture: url });
    return this.findById(id);
  }
}
