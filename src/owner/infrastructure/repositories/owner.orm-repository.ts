import { InjectRepository } from '@nestjs/typeorm';
import {
  FoundOwner,
  OwnerRepository,
} from 'src/owner/application/ports/owner.repository';
import { OwnerEntity } from '../entities/owner.entity';
import { Repository } from 'typeorm';
import { UserId } from 'src/user/domain/vo/user-id';
import { OwnerId } from 'src/owner/domain/owner-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export class OwnerOrmRepository implements OwnerRepository {
  constructor(
    @InjectRepository(OwnerEntity)
    private readonly ownerRepo: Repository<OwnerEntity>,
  ) {}

  async findByUserId(userId: UserId): Promise<FoundOwner | null> {
    const result = await this.ownerRepo.findOne({
      relations: {
        restaurant: true,
      },
      where: { userId: userId.value },
      select: { ownerId: true, restaurant: { restaurantId: true } },
    });
    if (!result) {
      return null;
    } else {
      return {
        ownerId: new OwnerId(result.ownerId),
        restaurantId:
          result.restaurant === null
            ? null
            : new RestaurantId(result.restaurant.restaurantId),
      };
    }
  }
}
