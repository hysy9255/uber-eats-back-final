import { ClientId } from 'src/client/domain/vo/client-id';
import { OrderStatus, OrderStatusType } from 'src/order/domain/order-progress';
import { OrderId } from 'src/order/domain/vo/order-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export class OrderForReview {
  constructor(
    private readonly _orderId: OrderId,
    private readonly _clientId: ClientId,
    private readonly _restaurantId: RestaurantId,
    private readonly _status: OrderStatus,
    private readonly _reviewExists: boolean,
  ) {}

  get orderId() {
    return this._orderId;
  }

  get clientId() {
    return this._clientId;
  }

  get restaurantId() {
    return this._restaurantId;
  }

  ensureCanWriteReview() {
    if (this._status.value !== OrderStatusType.Delivered)
      throw new Error('This order is not comleted. Cannot write review');

    if (this._reviewExists)
      throw new Error('Review already exists for this order');
  }
}
