import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Menu } from '../../domain/menu';
import { MenuRepository } from '../ports/menu.repository';
import { Dish } from '../../domain/entities/dish';
import { Category } from '../../domain/entities/category';
import { CategoryName } from 'src/menu/domain/value-objects/category-name';
import { CategoryId } from 'src/menu/domain/value-objects/category-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishDescription } from 'src/menu/domain/value-objects/dish-description';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';
import { CartCleanUp } from '../ports/cart-clean-up';
import { FindRestaurant } from 'src/restaurant/application/ports/find-restaurant';
import { RestaurantStatusType } from 'src/restaurant/domain/restaurant/vo/restaurant-status';

@Injectable()
export class MenuService {
  constructor(
    private readonly menuRepo: MenuRepository,
    private readonly cartCleanUp: CartCleanUp,
    private readonly findRestaurant: FindRestaurant,
  ) {}

  async addCategory(restaurantId: RestaurantId, category: Category) {
    await this.ensureRestaurantClosed(restaurantId);
    const menu = await this.findMenu(restaurantId);
    menu.addCategory(category);
    await this.menuRepo.save(menu);
  }

  async updateCategory(
    restaurantId: RestaurantId,
    categoryId: CategoryId,
    newCategoryName: CategoryName,
  ) {
    await this.ensureRestaurantClosed(restaurantId);
    const menu = await this.findMenu(restaurantId);
    menu.renameCategory(categoryId, newCategoryName);
    await this.menuRepo.save(menu);
  }

  async deleteCategory(restaurantId: RestaurantId, categoryId: CategoryId) {
    await this.ensureRestaurantClosed(restaurantId);
    const menu = await this.findMenu(restaurantId);

    const dishIds = menu.getDishIdsByCategory(categoryId);
    await this.cartCleanUp.removeDishesFromAllCarts(dishIds);

    menu.deleteCategory(categoryId);
    await this.menuRepo.deleteCategory(categoryId);
  }

  async addDish(
    restaurantId: RestaurantId,
    categoryId: CategoryId,
    dish: Dish,
  ) {
    await this.ensureRestaurantClosed(restaurantId);
    const menu = await this.findMenu(restaurantId);
    menu.addDish(categoryId, dish);
    await this.menuRepo.save(menu);
  }

  async addDishes(
    restaurantId: RestaurantId,
    categoryId: CategoryId,
    dishes: Dish[],
  ) {
    await this.ensureRestaurantClosed(restaurantId);
    const menu = await this.findMenu(restaurantId);
    menu.addDishes(categoryId, dishes);
    await this.menuRepo.save(menu);
  }

  async updateDish(
    restaurantId: RestaurantId,
    dishId: DishId,
    dishName?: DishName,
    price?: Price,
    description?: DishDescription,
    dishImgUrl?: DishImageUrl,
  ) {
    await this.ensureRestaurantClosed(restaurantId);
    const menu = await this.findMenu(restaurantId);
    menu.updateDish(dishId, dishName, price, description, dishImgUrl);
    await this.menuRepo.save(menu);
  }

  async makeDishAvailable(restaurantId: RestaurantId, dishId: DishId) {
    const menu = await this.findMenu(restaurantId);
    menu.makeDishAvailable(dishId);
    await this.menuRepo.save(menu);
  }

  async makeDishUnavailable(restaurantId: RestaurantId, dishId: DishId) {
    const menu = await this.findMenu(restaurantId);
    menu.makeDishUnavailable(dishId);
    await this.menuRepo.save(menu);
  }

  async deleteDish(restaurantId: RestaurantId, dishId: DishId) {
    await this.ensureRestaurantClosed(restaurantId);
    const menu = await this.findMenu(restaurantId);
    await this.cartCleanUp.removeDishFromAllCarts(dishId);

    menu.deleteDish(dishId);
    await this.menuRepo.deleteDish(dishId);
  }

  private async findMenu(restaurantId: RestaurantId): Promise<Menu> {
    const result = await this.menuRepo.findByRestaurantId(restaurantId);
    if (!result) throw new NotFoundException('Menu not found');
    return result;
  }

  private async ensureRestaurantClosed(
    restaurantId: RestaurantId,
  ): Promise<void> {
    const restaurant = await this.findRestaurant.findById(restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant Not Found');
    if (restaurant.status.value !== RestaurantStatusType.Closed) {
      throw new ConflictException(
        'Menu modification can only be executed when restaurant is closed',
      );
    }
  }
}
