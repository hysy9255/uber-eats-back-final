import { ClientId } from 'src/client/domain/vo/client-id';
import { OrderStatusType } from 'src/order/domain/order-progress';
import { OrderId } from 'src/order/domain/vo/order-id';
import { ClientOrderDetailDTO } from 'src/order/ui/dtos/client-order-detail.dto';
import { ClientOrderSummaryDTO } from 'src/order/ui/dtos/client-order-summary.dto';
import { RestaurantOrderDetailDTO } from 'src/order/ui/dtos/restaurant-order-detail.dto';
import { RestaurantOrderSummaryDTO } from 'src/order/ui/dtos/restaurant-order-summary.dto';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class OrderReader {
  abstract findCompletedOrdersForClient(
    clientId: ClientId,
  ): Promise<ClientOrderSummaryDTO[]>;
  abstract findOnGoingOrdersForClient(
    clientId: ClientId,
  ): Promise<ClientOrderSummaryDTO[]>;
  abstract findOrdersForRestaurant(
    restaurantId: RestaurantId,
    status?: OrderStatusType,
  ): Promise<RestaurantOrderSummaryDTO[]>;
  abstract findOrderDetailForClient(
    clientId: ClientId,
    orderId: OrderId,
  ): Promise<ClientOrderDetailDTO | null>;
  abstract findOrderDetailForRestaurant(
    restaurantId: RestaurantId,
    orderId: OrderId,
  ): Promise<RestaurantOrderDetailDTO | null>;
}
