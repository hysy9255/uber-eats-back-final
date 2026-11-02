import { Dish } from '../entities/dish';
import { DishDescription } from '../value-objects/dish-description';
import { DishId } from '../value-objects/dish-id';
import { DishImageUrl } from '../value-objects/dish-image-url';
import { DishName } from '../value-objects/dish-name';
import { Price } from '../value-objects/price';

export class DishFactory {
  static create(
    dishName: string,
    price: number,
    description: string,
    dishImgUrl: string | null,
    dishId?: string,
  ) {
    return new Dish(
      dishId ? new DishId(dishId) : DishId.generate(),
      new DishName(dishName),
      new Price(price),
      new DishDescription(description),
      new DishImageUrl(dishImgUrl),
    );
  }
}
