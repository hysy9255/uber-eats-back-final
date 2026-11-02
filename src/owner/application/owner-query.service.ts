import { UserId } from 'src/user/domain/vo/user-id';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerEntity } from '../infrastructure/entities/owner.entity';
import { OwnerRestaurantIdDTO } from '../ui/dtos/owner-restaurant-id.dto';

export class OwnerQueryService {
  constructor(
    @InjectRepository(OwnerEntity)
    private readonly ownerRepo: Repository<OwnerEntity>,
  ) {}

  async getMyRestaurant(userId: UserId): Promise<OwnerRestaurantIdDTO> {
    const entity = await this.ownerRepo.findOne({
      where: {
        userId: userId.value,
      },
      relations: {
        restaurant: true,
      },
      select: {
        restaurant: {
          restaurantId: true,
        },
      },
    });

    if (!entity) throw new Error('Cannot find my restaurant');

    return new OwnerRestaurantIdDTO(entity.restaurant.restaurantId);
  }
}
