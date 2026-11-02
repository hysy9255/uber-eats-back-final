import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientId } from 'src/client/domain/vo/client-id';
import { Cart } from '../domain/cart';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { Quantity } from 'src/order/domain/vo/quantity';
import { CartRepository } from './ports/cart.repository';
import { FindDishRestaurant } from './ports/find-dish-restaurant';
import { CartItem } from '../domain/cart-item';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly findDishRestaurant: FindDishRestaurant,
  ) {}

  async addToCart(clientId: ClientId, dishId: DishId, quantity: Quantity) {
    const { restaurantId } = await this.findRestaurantByDishId(dishId);
    const cart = await this.findCart(clientId);
    cart.addItem(restaurantId, dishId, quantity);
    await this.cartRepository.saveUpdate(cart);
  }

  async addBulkToCart(
    clientId: ClientId,
    items: { dishId: DishId; quantity: Quantity }[],
  ) {
    const restaurantId = await this.ensureAllDishesFromSameRestaurant(
      items.map((item) => item.dishId),
    );
    const cart = await this.findCart(clientId);

    items.forEach((item) =>
      cart.addItem(restaurantId, item.dishId, item.quantity),
    );

    await this.cartRepository.saveUpdate(cart);
  }

  async replaceItems(clientId: ClientId, dishId: DishId, quantity: Quantity) {
    const { restaurantId } = await this.findRestaurantByDishId(dishId);
    const cart = await this.findCart(clientId);
    cart.replaceItems(restaurantId, dishId, quantity);
    await this.cartRepository.saveUpdate(cart);
  }

  async replaceItemsWithBulkItems(clientId: ClientId, items: CartItem[]) {
    const restaurantId = await this.ensureAllDishesFromSameRestaurant(
      items.map((item) => item.dishId),
    );
    const cart = await this.findCart(clientId);
    cart.replaceItemsWithBulkItems(restaurantId, items);
    await this.cartRepository.saveUpdate(cart);
  }

  async increaseQuantity(clientId: ClientId, dishId: DishId) {
    const cart = await this.findCart(clientId);
    cart.increaseQuantity(dishId);
    await this.cartRepository.saveUpdate(cart);
  }

  async decreaseQuantity(clientId: ClientId, dishId: DishId) {
    const cart = await this.findCart(clientId);
    cart.decreaseQuantity(dishId);
    await this.cartRepository.saveUpdate(cart);
  }

  async calculateCouponDiscount() {}

  private async findCart(clientId: ClientId): Promise<Cart> {
    const result = await this.cartRepository.findByClientId(clientId);
    if (!result) return new Cart(clientId, null, []);
    return result;
  }

  private async findRestaurantByDishId(
    dishId: DishId,
  ): Promise<{ restaurantId: RestaurantId }> {
    const result = await this.findDishRestaurant.findByDishId(dishId);
    if (!result) throw new NotFoundException('Restaurant Not Found');
    return result;
  }

  private async ensureAllDishesFromSameRestaurant(
    dishIds: DishId[],
  ): Promise<RestaurantId> {
    const restaurantIds =
      await this.findDishRestaurant.findRestaurantIdsByDishIds(dishIds);

    if (restaurantIds.length !== dishIds.length) {
      throw new NotFoundException('Some dishes were not found');
    }

    const firstRestaurantId = restaurantIds[0];

    const allSame = restaurantIds.every((restaurantId) =>
      restaurantId.equals(firstRestaurantId),
    );

    if (!allSame) {
      throw new ConflictException(
        'All dishes must be from the same restaurant',
      );
    }

    return firstRestaurantId;
  }
}
