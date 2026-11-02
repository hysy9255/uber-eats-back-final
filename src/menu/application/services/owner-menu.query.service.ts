import { Injectable } from '@nestjs/common';
import { MenuReader } from '../ports/menu.reader';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { OwnerMenuDTO } from 'src/menu/ui/dtos/query/owner-menu.dto';
import { CategoryDTO } from 'src/menu/ui/dtos/query/category.dto';
// import { DishId } from 'src/menu/domain/value-objects/dish-id';
// import { DishDetailDTO } from 'src/menu/ui/dtos/query/dish-detail.dto';

@Injectable()
export class OwnerMenuQueryService {
  constructor(private readonly menuReader: MenuReader) {}

  async getMenu(restaurantId: RestaurantId): Promise<OwnerMenuDTO[]> {
    return await this.menuReader.findOwnerMenu(restaurantId);
  }

  async getCategories(restaurantId: RestaurantId): Promise<CategoryDTO[]> {
    return await this.menuReader.findCategories(restaurantId);
  }

  //   async getDishDetail(
  //     restaurantId: RestaurantId,
  //     dishId: DishId,
  //   ): Promise<DishDetailDTO> {
  //     return await this.menuReader.findDishDetail(restaurantId, dishId);
  //   }
}
