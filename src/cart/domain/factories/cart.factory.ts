import { ClientId } from 'src/client/domain/vo/client-id';
import { Cart } from '../cart';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { CartItem } from '../cart-item';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { Quantity } from 'src/order/domain/vo/quantity';

export class CartFactory {
  static create(
    clientId: string,
    restaurantId: string | null,
    items: { dishId: string; quantity: number }[],
  ) {
    return new Cart(
      new ClientId(clientId),
      restaurantId === null ? null : new RestaurantId(restaurantId),
      items.map(
        (item) =>
          new CartItem(new DishId(item.dishId), new Quantity(item.quantity)),
      ),
    );
  }
}
