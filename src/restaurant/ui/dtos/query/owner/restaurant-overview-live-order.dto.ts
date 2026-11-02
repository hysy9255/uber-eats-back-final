import { OrderStatusType } from 'src/order/domain/order-progress';

export class RestaurantOverviewLiveOrderItemDTO {
  name: string;
  quantity: number;
}

export class RestaurantOverviewLiveOrderDTO {
  orderId: string;

  orderItems: RestaurantOverviewLiveOrderItemDTO[];

  status: OrderStatusType;

  orderedAt: string;
}

export class RestaurantOverviewLiveOrdersDTO {
  count: number;

  orders: RestaurantOverviewLiveOrderDTO[];
}
