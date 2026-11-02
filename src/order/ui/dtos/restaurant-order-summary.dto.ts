import { OrderStatusType } from 'src/order/domain/order-progress';

export class OrderItemSummary {
  name: string;
  quantity: number;

  constructor(name: string, quantity: number) {
    this.name = name;
    this.quantity = quantity;
  }
}

export class RestaurantOrderSummaryDTO {
  orderId: string;
  status: OrderStatusType;
  orderedAt: Date;
  totalPrice: number;
  client: string;
  orderItems: OrderItemSummary[];

  constructor(
    orderId: string,
    status: OrderStatusType,
    client: string,
    orderedAt: Date,
    totalPrice: number,
    orderItems: OrderItemSummary[],
  ) {
    this.orderId = orderId;
    this.status = status;
    this.client = client;
    this.orderedAt = orderedAt;
    this.totalPrice = totalPrice;
    this.orderItems = orderItems;
  }
}
