import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from '../orm-entities/restaurant.orm-entity';
import { Repository } from 'typeorm';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import { OwnerId } from 'src/owner/domain/owner-id';
import { RestaurantStatus } from 'src/restaurant/domain/restaurant/vo/restaurant-status';
import { FindRestaurant } from 'src/restaurant/application/ports/find-restaurant';

export class FindRestaurantAdaptor implements FindRestaurant {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly repo: Repository<RestaurantEntity>,
  ) {}

  async findById(restaurantId: RestaurantId): Promise<Restaurant | null> {
    const result = await this.repo.findOne({
      where: { restaurantId: restaurantId.value },
    });

    if (!result) return null;

    return new Restaurant(
      new RestaurantId(result.restaurantId),
      new OwnerId(result.ownerId),
      new RestaurantStatus(result.status),
    );
  }
}
