import { OperatingHours } from 'src/restaurant/domain/operating-hours/operating-hours';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class RestaurantOperatingHoursRepository {
  abstract findByRestaurantId(
    restaurantId: RestaurantId,
  ): Promise<OperatingHours | null>;

  abstract saveUpdate(
    restaurantId: RestaurantId,
    operatingHours: OperatingHours,
  ): Promise<void>;
}
