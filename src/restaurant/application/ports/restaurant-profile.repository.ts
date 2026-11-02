import { RestaurantProfile } from 'src/restaurant/domain/restaurant-profile/restaurant-profile';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class RestaurantProfileRepository {
  abstract findOneByRestaurantId(
    restaurantId: RestaurantId,
  ): Promise<RestaurantProfile | null>;

  abstract saveUpdate(profile: RestaurantProfile): Promise<void>;
}
