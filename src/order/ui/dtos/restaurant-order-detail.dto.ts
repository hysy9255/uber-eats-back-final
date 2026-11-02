import { OrderStatusType } from 'src/order/domain/order-progress';

class OrderItemDTO {
  dishName: string;
  quantity: number;
  unitPrice: number;
}

export class RestaurantOrderDetailDTO {
  orderId: string;
  status: OrderStatusType;
  client: string;
  orderedAt: Date;
  orderItems: OrderItemDTO[];
  deliveryTo: string;
  requestToRestaurant: string | null;
  totalPrice: number;

  constructor(
    orderId: string,
    status: OrderStatusType,
    client: string,
    orderedAt: Date,
    orderItems: OrderItemDTO[],
    deliveryTo: string,
    requestToRestaurant: string | null,
    totalPrice: number,
  ) {
    this.orderId = orderId;
    this.status = status;
    this.client = client;
    this.orderedAt = orderedAt;
    this.orderItems = orderItems;
    this.deliveryTo = deliveryTo;
    this.requestToRestaurant = requestToRestaurant;
    this.totalPrice = totalPrice;
  }
}
