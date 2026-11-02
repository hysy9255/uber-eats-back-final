import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOwnerRestaurant } from 'src/authorization/restaurant-ownership/application/ports/find-owner-restaurant';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOwnerRestaurantAdapter extends FindOwnerRestaurant {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly repository: Repository<RestaurantEntity>,
  ) {
    super();
  }

  async findByOwnerUserId(
    userId: string,
  ): Promise<{ restaurantId: string } | null> {
    return await this.repository.findOne({
      select: {
        restaurantId: true,
      },
      where: {
        owner: {
          userId,
        },
      },
    });
  }
}
