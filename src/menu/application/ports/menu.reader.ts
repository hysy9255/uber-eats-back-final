import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { CategoryDTO } from 'src/menu/ui/dtos/query/category.dto';
import { DishDetailDTO } from 'src/menu/ui/dtos/query/dish-detail.dto';
import { MenuDTO } from 'src/menu/ui/dtos/query/menu.dto';
import { OwnerMenuDTO } from 'src/menu/ui/dtos/query/owner-menu.dto';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class MenuReader {
  abstract findByRestaurantId(restaurantId: RestaurantId): Promise<MenuDTO[]>;

  abstract findDishDetail(
    restaurantId: RestaurantId,
    dishId: DishId,
  ): Promise<DishDetailDTO>;

  abstract findOwnerMenu(restaurantId: RestaurantId): Promise<OwnerMenuDTO[]>;

  abstract findCategories(restaurantId: RestaurantId): Promise<CategoryDTO[]>;
}
