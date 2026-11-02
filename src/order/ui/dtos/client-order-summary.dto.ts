import { OrderStatusType } from 'src/order/domain/order-progress';

export class OrderItemDTO {
  dishId: string | null;
  dishImg: string | null;
  dishName: string;
  quantity: number;
  unitPrice: number;

  constructor(
    dishId: string | null,
    dishImg: string | null,
    dishName: string,
    quantity: number,
    unitPrice: number,
  ) {
    this.dishId = dishId;
    this.dishImg = dishImg;
    this.dishName = dishName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }
}

export class ClientOrderSummaryDTO {
  orderId: string;
  status: OrderStatusType;
  totalPrice: number;
  orderedAt: Date;
  deliveredAt: Date | null;
  orderItems: OrderItemDTO[];
  restaurant: string;
  restaurantLogo: string | null;
  deliverTo: string;

  constructor(
    orderId: string,
    restaurant: string,
    restaurantLogo: string | null,
    status: OrderStatusType,
    deliverTo: string,
    totalPrice: number,
    orderedAt: Date,
    deliveredAt: Date | null,
    orderItems: OrderItemDTO[],
  ) {
    this.orderId = orderId;
    this.restaurant = restaurant;
    this.restaurantLogo = restaurantLogo;
    this.status = status;
    this.deliverTo = deliverTo;
    this.totalPrice = totalPrice;
    this.orderedAt = orderedAt;
    this.deliveredAt = deliveredAt;
    this.orderItems = orderItems;
  }
}
