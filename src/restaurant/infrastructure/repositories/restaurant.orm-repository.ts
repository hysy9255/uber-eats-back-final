import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantRepository } from 'src/restaurant/application/ports/restaurant.repository';
import { RestaurantEntity } from '../orm-entities/restaurant.orm-entity';
import { Repository } from 'typeorm';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import { OwnerId } from 'src/owner/domain/owner-id';
import { RestaurantStatus } from 'src/restaurant/domain/restaurant/vo/restaurant-status';
import { InternalServerErrorException } from '@nestjs/common';

export class RestaurantOrmRepository implements RestaurantRepository {
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

  async save(restaurant: Restaurant) {
    const persisted = await this.repo.findOne({
      where: { restaurantId: restaurant.id.value },
    });
    if (!persisted)
      throw new InternalServerErrorException('Restaurant Not found');

    persisted.status = restaurant.status.value;

    await this.repo.save(persisted);
  }
}
