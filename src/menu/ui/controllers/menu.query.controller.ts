import { Controller, Get, Param } from '@nestjs/common';
import { Public } from 'src/auth/ui/guards/auth.guard';
import { MenuQueryService } from 'src/menu/application/services/menu.query.service';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { MenuDTO } from '../dtos/query/menu.dto';
import { DishDetailDTO } from '../dtos/query/dish-detail.dto';

@Controller('restaurants/:restaurantId/menus')
@Public()
export class MenuQueryController {
  constructor(private readonly menuQueryService: MenuQueryService) {}

  @Get()
  async getMenu(
    @Param('restaurantId') restaurantId: string,
  ): Promise<MenuDTO[]> {
    return await this.menuQueryService.getMenu(new RestaurantId(restaurantId));
  }

  @Get(':dishId')
  async getDishDetail(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ): Promise<DishDetailDTO> {
    return await this.menuQueryService.getDishDetail(
      new RestaurantId(restaurantId),
      new DishId(dishId),
    );
  }
}
