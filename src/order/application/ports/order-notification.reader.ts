import { RestaurantId } from '../../../restaurant/domain/restaurant/vo/restaurant-id';
import { OrderId } from '../../domain/vo/order-id';
import { RestaurantOrderSummaryDTO } from '../../ui/dtos/restaurant-order-summary.dto';

export abstract class OrderNotificationReader {
  abstract findOrderSummaryForRestaurant(
    restaurantId: RestaurantId,
    orderId: OrderId,
  ): Promise<RestaurantOrderSummaryDTO | null>;
}
