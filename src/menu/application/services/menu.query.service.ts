import { Injectable } from '@nestjs/common';
import { MenuReader } from '../ports/menu.reader';
import { MenuDTO } from 'src/menu/ui/dtos/query/menu.dto';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishDetailDTO } from 'src/menu/ui/dtos/query/dish-detail.dto';

@Injectable()
export class MenuQueryService {
  constructor(private readonly menuReader: MenuReader) {}

  async getMenu(restaurantId: RestaurantId): Promise<MenuDTO[]> {
    return await this.menuReader.findByRestaurantId(restaurantId);
  }

  async getDishDetail(
    restaurantId: RestaurantId,
    dishId: DishId,
  ): Promise<DishDetailDTO> {
    return await this.menuReader.findDishDetail(restaurantId, dishId);
  }
}
