import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class RestaurantAddressRepository {
  abstract findOneByRestaurantId(
    restaurantId: RestaurantId,
  ): Promise<RestaurantAddress>;

  abstract saveUpdate(address: RestaurantAddress): Promise<void>;
}
