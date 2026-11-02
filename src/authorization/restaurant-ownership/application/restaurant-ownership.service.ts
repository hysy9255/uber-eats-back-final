import { ForbiddenException, Injectable } from '@nestjs/common';
import { FindOwnerRestaurant } from './ports/find-owner-restaurant';

@Injectable()
export class RestaurantOwnershipService {
  constructor(private readonly findRestaurant: FindOwnerRestaurant) {}

  async assertUserOwnsRestaurant(userId: string, restaurantId: string) {
    const restaurant = await this.findRestaurant.findByOwnerUserId(userId);

    if (!restaurant || restaurant.restaurantId !== restaurantId) {
      throw new ForbiddenException('You do not own this restaurant');
    }
  }
}
