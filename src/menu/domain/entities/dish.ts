import { DishName } from '../value-objects/dish-name';
import { Price } from '../value-objects/price';
import { DishId } from '../value-objects/dish-id';
import { DishDescription } from '../value-objects/dish-description';
import { DishImageUrl } from '../value-objects/dish-image-url';
import { DishAvailability } from '../value-objects/dish-availability';

export class Dish {
  constructor(
    public readonly id: DishId,
    private _name: DishName,
    private _price: Price,
    private _description: DishDescription,
    private _dishImgUrl: DishImageUrl,
    private _availability: DishAvailability = new DishAvailability(true),
  ) {}

  get name() {
    return this._name;
  }

  get price() {
    return this._price;
  }

  get description() {
    return this._description;
  }

  get dishImgUrl() {
    return this._dishImgUrl;
  }

  get availability() {
    return this._availability;
  }

  makeAvailable() {
    this._availability = new DishAvailability(true);
  }

  makeUnavailable() {
    this._availability = new DishAvailability(false);
  }

  update(
    newName?: DishName,
    newPrice?: Price,
    newDescription?: DishDescription,
    newDishImgUrl?: DishImageUrl,
  ) {
    if (newName !== undefined) this._name = newName;
    if (newPrice !== undefined) this._price = newPrice;
    if (newDescription !== undefined) this._description = newDescription;
    if (newDishImgUrl !== undefined) {
      this._dishImgUrl = newDishImgUrl;
    }
  }
}
