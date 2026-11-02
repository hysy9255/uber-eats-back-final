import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUser, UserRole } from 'src/auth/application/ports/find-user';
import { UserEntity } from '../orm-entities/user.entity';
import { Repository } from 'typeorm';
import { UserId } from 'src/user/domain/vo/user-id';
import { FindOwnerUser } from 'src/authorization/order-ownership/ports/find-owner-user';

@Injectable()
export class FindUserAdapter implements FindUser, FindOwnerUser {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async findOne(email: string) {
    const result = await this.userRepo.findOne({ where: { email } });
    if (!result) throw new NotFoundException('User Not Found');
    return {
      userId: result.userId,
      password: result.password,
      userRole: result.role,
    };
  }

  async findOwnerUserWithRestaurant(
    userId: UserId,
  ): Promise<UserEntity | null> {
    return await this.userRepo.findOne({
      where: {
        userId: userId.value,
        role: UserRole.Owner,
      },
      relations: {
        owner: {
          restaurant: true,
        },
      },
    });
  }
}
