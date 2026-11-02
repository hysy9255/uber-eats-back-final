import { DishId } from 'src/menu/domain/value-objects/dish-id';

export abstract class CartCleanUp {
  abstract removeDishFromAllCarts(dishId: DishId): Promise<void>;
  abstract removeDishesFromAllCarts(dishIds: DishId[]): Promise<void>;
}
