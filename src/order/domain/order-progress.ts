import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { OrderId } from './vo/order-id';
import { ConflictException } from '@nestjs/common';

export enum OrderStatusType {
  Pending = 'pending',
  Cooking = 'cooking',
  Ready = 'ready',
  Delivering = 'delivering',
  Delivered = 'delivered',
}

export class OrderStatus {
  constructor(readonly value: OrderStatusType) {}
}

export class OrderProgress {
  constructor(
    readonly orderId: OrderId,
    readonly restaurantId: RestaurantId,
    private _orderStatus: OrderStatus,
    private _deliveredAt: Date | null,
  ) {}

  get orderStatus() {
    return this._orderStatus;
  }

  get deliveredAt() {
    return this._deliveredAt;
  }

  markAsAccepted() {
    if (this._orderStatus.value !== OrderStatusType.Pending) {
      throw new ConflictException('Order is not in pending status');
    }
    this._orderStatus = new OrderStatus(OrderStatusType.Cooking);
  }

  markAsReady() {
    if (this._orderStatus.value !== OrderStatusType.Cooking) {
      throw new ConflictException('Order is not in cooking status');
    }
    this._orderStatus = new OrderStatus(OrderStatusType.Ready);
  }

  markAsDeliverying() {
    if (this._orderStatus.value !== OrderStatusType.Ready) {
      throw new ConflictException('Order is not in ready status');
    }
    this._orderStatus = new OrderStatus(OrderStatusType.Delivering);
  }

  markAsDelivered() {
    if (this._orderStatus.value !== OrderStatusType.Delivering) {
      throw new ConflictException('Order is not in delivering status');
    }
    this._orderStatus = new OrderStatus(OrderStatusType.Delivered);
    this._deliveredAt = new Date();
  }
}
