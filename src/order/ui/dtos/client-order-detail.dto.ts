import { OrderStatusType } from 'src/order/domain/order-progress';
import { OrderItemDTO } from './client-order-summary.dto';

export class ClientOrderDetailDTO {
  orderId: string;
  restaurant: string;
  restaurantLogo: string | null;
  cuisineType: string;
  status: OrderStatusType;
  deliveryTo: string;
  totalPrice: number;
  requestToRestaurant: string | null;
  requestToDriver: string | null;
  numOfItems: number;
  orderItems: OrderItemDTO[];

  constructor(
    orderId: string,
    restaurant: string,
    restaurantLogo: string | null,
    cuisineType: string,
    status: OrderStatusType,
    deliveryTo: string,
    totalPrice: number,
    requestToRestaurant: string | null,
    requestToDriver: string | null,
    numOfItems: number,
    orderItems: OrderItemDTO[],
  ) {
    this.orderId = orderId;
    this.restaurant = restaurant;
    this.restaurantLogo = restaurantLogo;
    this.cuisineType = cuisineType;
    this.status = status;
    this.deliveryTo = deliveryTo;
    this.totalPrice = totalPrice;
    this.requestToRestaurant = requestToRestaurant;
    this.requestToDriver = requestToDriver;
    this.numOfItems = numOfItems;
    this.orderItems = orderItems;
  }
}
