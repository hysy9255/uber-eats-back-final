import { CategoryId } from 'src/menu/domain/value-objects/category-id';
import { Menu } from '../../domain/menu';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class MenuRepository {
  abstract findByRestaurantId(restaurantId: RestaurantId): Promise<Menu>;
  abstract save(menu: Menu): Promise<void>;
  abstract deleteDish(dishId: DishId): Promise<void>;
  abstract deleteCategory(categoryId: CategoryId): Promise<void>;
}
