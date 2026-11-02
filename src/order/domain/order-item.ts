import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { OrderItemId } from './vo/order-item-id';
import { Quantity } from './vo/quantity';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';

export class OrderItem {
  private _dishName: DishName;
  private _unitPrice: Price;
  private _lineTotalPrice: Price;
  private _dishImgUrl: DishImageUrl;

  constructor(
    readonly id: OrderItemId,
    private readonly _dishId: DishId,
    private readonly _quantity: Quantity,
  ) {}

  assginDishSnapProps(
    dishName: DishName,
    unitPrice: Price,
    dishImgUrl: DishImageUrl,
  ) {
    this._dishName = dishName;
    this._unitPrice = unitPrice;
    this._lineTotalPrice = new Price(
      Number((unitPrice.value * this._quantity.value).toFixed(2)),
    );
    this._dishImgUrl = dishImgUrl;
  }

  get dishId() {
    return this._dishId;
  }

  get quantity() {
    return this._quantity;
  }

  get dishName() {
    return this._dishName;
  }

  get unitPrice() {
    return this._unitPrice;
  }

  get lineTotalPrice() {
    return this._lineTotalPrice;
  }

  get dishImgUrl() {
    return this._dishImgUrl;
  }
}
