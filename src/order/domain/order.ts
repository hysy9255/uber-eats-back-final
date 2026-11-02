import { ClientId } from 'src/client/domain/vo/client-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { Address } from 'src/shared/infrastructure/entities/address/address';
import { OrderId } from './vo/order-id';
import { OrderRequest } from './vo/order-request';
import { OrderItem } from './order-item';
import { Dish } from 'src/menu/domain/entities/dish';
import { NotFoundException } from '@nestjs/common';
import { Price } from 'src/menu/domain/value-objects/price';

export class Order {
  private _deliveryAddress: Address;
  private _totalPrice: Price;
  private _createdAt: Date;
  constructor(
    private readonly _orderId: OrderId,
    private readonly _clientId: ClientId,
    private readonly _restaurantId: RestaurantId,
    private _request: OrderRequest,
    private _orderItems: OrderItem[],
  ) {
    this._createdAt = new Date();
  }

  private calculateTotalPrice() {
    this._totalPrice = new Price(
      Number(
        this._orderItems
          .reduce((total, item) => total + item.lineTotalPrice.value, 0)
          .toFixed(2),
      ),
    );
  }

  captureOrderItemSnapShots(dishes: Dish[]) {
    this._orderItems.forEach((item) => {
      const dish = dishes.find((dish) => dish.id.equals(item.dishId));
      if (dish) {
        item.assginDishSnapProps(dish.name, dish.price, dish.dishImgUrl);
      } else {
        throw new NotFoundException(
          `Dish with id ${item.dishId.value} not found`,
        );
      }
    });
    this.calculateTotalPrice();
  }

  assignDeliveryAddress(address: Address) {
    this._deliveryAddress = address;
  }

  get totalPrice() {
    return this._totalPrice;
  }

  get createdAt() {
    return this._createdAt;
  }

  get request() {
    return this._request;
  }

  get orderItems() {
    return this._orderItems;
  }

  get deliveryAddress() {
    return this._deliveryAddress;
  }

  get orderId() {
    return this._orderId;
  }

  get clientId() {
    return this._clientId;
  }

  get restaurantId() {
    return this._restaurantId;
  }
}
