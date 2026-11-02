import { Category } from './entities/category';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Dish } from './entities/dish';
import { CategoryId } from './value-objects/category-id';
import { CategoryName } from './value-objects/category-name';
import { DishId } from './value-objects/dish-id';
import { DishName } from './value-objects/dish-name';
import { Price } from './value-objects/price';
import { DishDescription } from './value-objects/dish-description';
import { DishImageUrl } from './value-objects/dish-image-url';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export class Menu {
  constructor(
    public readonly restaurantId: RestaurantId,
    private _categories: Category[],
  ) {}

  get categories() {
    return this._categories;
  }

  get allDishes() {
    return this._categories.flatMap((category) => category.dishes);
  }

  addDishes(categoryId: CategoryId, dishes: Dish[]) {
    const category = this.findCategory(categoryId);

    const incomingNames = new Set<string>();

    for (const dish of dishes) {
      const dishName = dish.name;

      if (incomingNames.has(dishName.value)) {
        throw new ConflictException('Dish name already exists in request');
      }

      this.ensureNoDuplicateDishNames(dishName);

      incomingNames.add(dishName.value);
    }

    category.addDishes(dishes);
  }

  addDish(categoryId: CategoryId, dish: Dish) {
    this.ensureNoDuplicateDishNames(dish.name);
    const category = this.findCategory(categoryId);
    category.addDish(dish);
  }

  updateDish(
    dishId: DishId,
    newName?: DishName,
    newPrice?: Price,
    newDescription?: DishDescription,
    newDishImgUrl?: DishImageUrl,
  ) {
    for (const category of this._categories) {
      const targetDish = category.dishes.find((dish) => dish.id.equals(dishId));
      if (targetDish) {
        targetDish.update(newName, newPrice, newDescription, newDishImgUrl);
        return;
      }
    }
    throw new NotFoundException('Dish Not Found');
  }

  makeDishAvailable(dishId: DishId) {
    for (const category of this._categories) {
      const targetDish = category.dishes.find((dish) => dish.id.equals(dishId));
      if (targetDish) {
        targetDish.makeAvailable();
        return;
      }
    }
    throw new NotFoundException('Dish Not Found');
  }

  makeDishUnavailable(dishId: DishId) {
    for (const category of this._categories) {
      const targetDish = category.dishes.find((dish) => dish.id.equals(dishId));
      if (targetDish) {
        targetDish.makeUnavailable();
        return;
      }
    }
    throw new NotFoundException('Dish Not Found');
  }

  deleteDish(dishId: DishId) {
    for (const category of this._categories) {
      if (category.hasDish(dishId)) {
        category.deleteDish(dishId);
        return;
      }
    }
    throw new NotFoundException('Dish not found');
  }

  addCategory(category: Category): void {
    this.ensureNoDuplicateCategoryNames(category.name);
    this._categories.push(category);
  }

  renameCategory(categoryId: CategoryId, newName: CategoryName) {
    const category = this.findCategory(categoryId);

    if (category.name.equals(newName))
      throw new BadRequestException('Given name is same as before');

    this.ensureNoDuplicateCategoryNames(newName);
    category.rename(newName);
  }

  deleteCategory(categoryId: CategoryId) {
    const category = this._categories.find((category) =>
      category.id.equals(categoryId),
    );
    if (!category)
      throw new NotFoundException('Category Not Found: Failed to delete');
  }

  getDishIdsByCategory(categoryId: CategoryId): DishId[] {
    const category = this.findCategory(categoryId);

    return category.dishes.map((dish) => dish.id);
  }

  private ensureNoDuplicateDishNames(dishName: DishName) {
    for (const category of this._categories) {
      const exists = category.dishes.some((dish) => dish.name.equals(dishName));
      if (exists) throw new ConflictException('Dish name already exists');
    }
  }

  private ensureNoDuplicateCategoryNames(name: CategoryName) {
    const exists = this._categories.some((existing) =>
      existing.name.equals(name),
    );
    if (exists)
      throw new ConflictException('This category name already exists');
  }

  private findCategory(categoryId: CategoryId) {
    const category = this._categories.find((category) =>
      category.id.equals(categoryId),
    );
    if (!category) throw new NotFoundException('Category Not Found');
    return category;
  }
}
