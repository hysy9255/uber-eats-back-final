import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class RestaurantRepository {
  abstract findById(restaurantId: RestaurantId): Promise<Restaurant | null>;
  abstract save(restaurant: Restaurant): Promise<void>;
}
