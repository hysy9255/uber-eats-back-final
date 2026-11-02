import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserReader } from 'src/user/application/ports/user.reader';
import { UserEntity } from '../orm-entities/user.entity';
import { Repository } from 'typeorm';
import { UserId } from 'src/user/domain/vo/user-id';
import { UserProfileDTO } from 'src/user/ui/dtos/user-profile.dto';
import { UserRole } from 'src/auth/application/ports/find-user';

@Injectable()
export class UserOrmReader implements UserReader {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findProfileById(userId: UserId): Promise<UserProfileDTO | null> {
    const entity = await this.userRepo.findOne({
      where: { userId: userId.value },
    });

    if (!entity) return null;

    return new UserProfileDTO(
      entity.email,
      entity.role,
      entity.name,
      entity.phoneNumber,
      entity.profileImgUrl,
    );
  }

  async findRoleByUserId(userId: UserId): Promise<{ role: UserRole } | null> {
    const result = await this.userRepo.findOne({
      where: { userId: userId.value },
      select: {
        role: true,
      },
    });

    if (!result) return null;

    return {
      role: result.role,
    };
  }
}
