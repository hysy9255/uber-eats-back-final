import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class FindRestaurant {
  abstract findById(restaurantId: RestaurantId): Promise<Restaurant | null>;
}
