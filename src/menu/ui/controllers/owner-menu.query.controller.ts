import { Controller, Get, Param } from '@nestjs/common';
// import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
// import { MenuDTO } from '../dtos/query/menu.dto';
// import { DishDetailDTO } from '../dtos/query/dish-detail.dto';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { OwnerMenuQueryService } from 'src/menu/application/services/owner-menu.query.service';
import { OwnerMenuDTO } from '../dtos/query/owner-menu.dto';
import { CategoryDTO } from '../dtos/query/category.dto';

@Controller('owner/restaurants/:restaurantId/menus')
@Roles(UserRole.Owner)
export class OwnerMenuQueryController {
  constructor(private readonly ownerMenuQueryService: OwnerMenuQueryService) {}

  @Get()
  async getMenu(
    @Param('restaurantId') restaurantId: string,
  ): Promise<OwnerMenuDTO[]> {
    return await this.ownerMenuQueryService.getMenu(
      new RestaurantId(restaurantId),
    );
  }

  @Get('/categories')
  async getCategories(
    @Param('restaurantId') restaurantId: string,
  ): Promise<CategoryDTO[]> {
    return await this.ownerMenuQueryService.getCategories(
      new RestaurantId(restaurantId),
    );
  }

  //   @Get(':dishId')
  //   async getDishDetail(
  //     @Param('restaurantId') restaurantId: string,
  //     @Param('dishId') dishId: string,
  //   ): Promise<DishDetailDTO> {
  //     return await this.menuQueryService.getDishDetail(
  //       new RestaurantId(restaurantId),
  //       new DishId(dishId),
  //     );
  //   }
}
