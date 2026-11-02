import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from '../../application/services/menu.service';
import { AddCategoryDTO, UpdateCategoryDTO } from '../dtos/category.dto';
import { AddDishDTO, UpdateDishDTO } from '../dtos/dish.dto';
import { RestaurantOwnershipGuard } from 'src/authorization/restaurant-ownership/ui/restaurant-ownership.guard';
import { CategoryName } from 'src/menu/domain/value-objects/category-name';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { CategoryId } from 'src/menu/domain/value-objects/category-id';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishDescription } from 'src/menu/domain/value-objects/dish-description';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';
import { Category } from 'src/menu/domain/entities/category';
import { DishFactory } from 'src/menu/domain/factories/dish.factory';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';

@Controller('restaurants/:restaurantId/menu')
@Roles(UserRole.Owner)
@UseGuards(RestaurantOwnershipGuard)
export class OwnerMenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('categories')
  async addCategory(
    @Param('restaurantId') restaurantId: string,
    @Body() body: AddCategoryDTO,
  ) {
    await this.menuService.addCategory(
      new RestaurantId(restaurantId),
      new Category(CategoryId.generate(), new CategoryName(body.categoryName)),
    );
  }

  @Put('categories/:categoryId')
  async updateCategory(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
    @Body() body: UpdateCategoryDTO,
  ) {
    await this.menuService.updateCategory(
      new RestaurantId(restaurantId),
      new CategoryId(categoryId),
      new CategoryName(body.newCategoryName),
    );
  }

  @Delete('categories/:categoryId')
  async deleteCategory(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
  ) {
    await this.menuService.deleteCategory(
      new RestaurantId(restaurantId),
      new CategoryId(categoryId),
    );
  }

  @Post('categories/:categoryId/dishes')
  async addDish(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
    @Body() body: AddDishDTO,
  ) {
    await this.menuService.addDish(
      new RestaurantId(restaurantId),
      new CategoryId(categoryId),
      DishFactory.create(
        body.dishName,
        body.price,
        body.description,
        body.dishImgUrl,
      ),
    );
  }

  @Post('categories/:categoryId/dishes/batch')
  async addDishes(
    @Param('restaurantId') restaurantId: string,
    @Param('categoryId') categoryId: string,
    @Body() body: AddDishDTO[],
  ) {
    await this.menuService.addDishes(
      new RestaurantId(restaurantId),
      new CategoryId(categoryId),
      body.map((elem) =>
        DishFactory.create(
          elem.dishName,
          elem.price,
          elem.description,
          elem.dishImgUrl,
        ),
      ),
    );
  }

  @Patch('dishes/:dishId')
  async updateDish(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
    @Body() body: UpdateDishDTO,
  ) {
    await this.menuService.updateDish(
      new RestaurantId(restaurantId),
      new DishId(dishId),
      body?.dishName !== undefined ? new DishName(body.dishName) : undefined,
      body?.price !== undefined ? new Price(body.price) : undefined,
      body?.description !== undefined
        ? new DishDescription(body.description)
        : undefined,
      body?.dishImgUrl !== undefined
        ? new DishImageUrl(body.dishImgUrl)
        : undefined,
    );
  }

  @Patch('dishes/:dishId/available')
  async makeAvailable(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    await this.menuService.makeDishAvailable(
      new RestaurantId(restaurantId),
      new DishId(dishId),
    );
  }

  @Patch('dishes/:dishId/unavailable')
  async makeUnavailable(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    await this.menuService.makeDishUnavailable(
      new RestaurantId(restaurantId),
      new DishId(dishId),
    );
  }

  @Delete('dishes/:dishId')
  async deleteDish(
    @Param('restaurantId') restaurantId: string,
    @Param('dishId') dishId: string,
  ) {
    await this.menuService.deleteDish(
      new RestaurantId(restaurantId),
      new DishId(dishId),
    );
  }
}
