import { Injectable, NotFoundException } from '@nestjs/common';
import { UserId } from '../domain/vo/user-id';
import { UserReader } from './ports/user.reader';
import { UserProfileDTO } from '../ui/dtos/user-profile.dto';
import { UserRole } from 'src/auth/application/ports/find-user';

@Injectable()
export class UserQueryService {
  constructor(private readonly userReader: UserReader) {}

  async getUserProfile(userId: UserId): Promise<UserProfileDTO> {
    const result = await this.userReader.findProfileById(userId);
    if (!result) throw new NotFoundException('User Profile Not Found');
    return result;
  }

  async getMe(userId: UserId): Promise<{ role: UserRole }> {
    const userRole = await this.userReader.findRoleByUserId(userId);
    if (!userRole) throw new NotFoundException('User role is not found');
    return userRole;
  }
}
