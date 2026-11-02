import { OrderId } from 'src/order/domain/vo/order-id';
import { OrderEntity } from 'src/order/infrastructure/entities/order.orm-entity';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class FindRestaurantOrder {
  abstract findOrderByIdAndRestaurantId(
    orderId: OrderId,
    restaurantId: RestaurantId,
  ): Promise<OrderEntity | null>;
}
