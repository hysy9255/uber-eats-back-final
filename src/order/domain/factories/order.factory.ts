import { ClientId } from 'src/client/domain/vo/client-id';
import { Order } from '../order';
import { OrderId } from '../vo/order-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { OrderRequest } from '../vo/order-request';
import { Cart } from 'src/cart/domain/cart';
import { OrderItem } from '../order-item';
import { OrderItemId } from '../vo/order-item-id';

export class OrderFactory {
  static create(
    clientId: ClientId,
    restaurantId: RestaurantId,
    orderRequest: OrderRequest,
    cart: Cart,
  ) {
    return new Order(
      OrderId.generate(),
      clientId,
      restaurantId,
      orderRequest,
      cart.cartItems.map(
        (item) =>
          new OrderItem(OrderItemId.generate(), item.dishId, item.quantity),
      ),
    );
  }
}
