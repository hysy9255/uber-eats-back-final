import { CategoryId } from '../value-objects/category-id';
import { CategoryName } from '../value-objects/category-name';
import { DishId } from '../value-objects/dish-id';
import { Dish } from './dish';

export class Category {
  private _dishes: Dish[];

  constructor(
    public readonly id: CategoryId,
    private _name: CategoryName,
  ) {
    this._dishes = [];
  }

  get name() {
    return this._name;
  }

  get dishes() {
    return this._dishes;
  }

  addDishes(newDishes: Dish[]) {
    this._dishes.push(...newDishes);
  }

  addDish(newDish: Dish) {
    this._dishes.push(newDish);
  }

  deleteDish(dishId: DishId) {
    this._dishes = this._dishes.filter((dish) => !dish.id.equals(dishId));
  }

  hasDish(dishId: DishId) {
    return this._dishes.some((dish) => dish.id.equals(dishId));
  }

  replaceDishes(dishes: Dish[]) {
    this._dishes = dishes;
  }

  rename(newName: CategoryName) {
    this._name = newName;
  }
}
