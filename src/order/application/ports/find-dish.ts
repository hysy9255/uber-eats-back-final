import { Dish } from 'src/menu/domain/entities/dish';
import { DishId } from 'src/menu/domain/value-objects/dish-id';

export abstract class FindDish {
  abstract findByIds(dishIds: DishId[]): Promise<Dish[]>;
}
