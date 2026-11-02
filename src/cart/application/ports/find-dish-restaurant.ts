import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class FindDishRestaurant {
  abstract findByDishId(
    dishId: DishId,
  ): Promise<{ restaurantId: RestaurantId } | null>;

  abstract findRestaurantIdsByDishIds(
    dishIds: DishId[],
  ): Promise<RestaurantId[]>;
}
