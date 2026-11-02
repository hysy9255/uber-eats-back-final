import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { Quantity } from 'src/order/domain/vo/quantity';

export class CartItem {
  constructor(
    readonly dishId: DishId,
    private _quantity: Quantity,
  ) {}

  get quantity() {
    return this._quantity;
  }

  addQuantity(quantity: Quantity) {
    this._quantity = new Quantity(this._quantity.value + quantity.value);
  }

  increaseQauntity() {
    this._quantity = new Quantity(this._quantity.value + 1);
  }

  decreaseQauntity() {
    if (this._quantity.value <= 1) {
      throw new Error('Cannot decrease quanity when it is less or equal to 1');
    }
    this._quantity = new Quantity(this._quantity.value - 1);
  }
}
