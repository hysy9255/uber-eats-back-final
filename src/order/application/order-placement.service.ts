import { OrderRepository } from './ports/order.repository';
import { FindDefaultDeliveryAddress } from './ports/find-delivery-address';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { ClientId } from 'src/client/domain/vo/client-id';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindDish } from './ports/find-dish';
import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import { Transactional } from 'typeorm-transactional';
import { Cart } from 'src/cart/domain/cart';
import { OrderRequest } from '../domain/vo/order-request';
import { OrderFactory } from '../domain/factories/order.factory';
import { CartRepository } from 'src/cart/application/ports/cart.repository';
import { FindRestaurant } from 'src/restaurant/application/ports/find-restaurant';
import { OrderGateway } from '../ui/order.gateway';
import { OrderNotificationReader } from './ports/order-notification.reader';

@Injectable()
export class OrderPlacementService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly findRestaurant: FindRestaurant,
    private readonly findDeliveryAddress: FindDefaultDeliveryAddress,
    private readonly findDish: FindDish,
    private readonly cartRepo: CartRepository,
    private readonly orderGateway: OrderGateway,
    private readonly orderNotificationReader: OrderNotificationReader,
  ) {}

  @Transactional()
  async placeOrder(clientId: ClientId, orderRequest: OrderRequest) {
    const cart = await this.findClientCart(clientId);
    const restaurantId = cart.getRestaurantIdOrThrow();

    const restaurant = await this.findRestaurantById(restaurantId);

    if (!restaurant.canAcceptOrders()) {
      throw new ConflictException('Restaurant is not accepting orders');
    }

    const order = OrderFactory.create(
      clientId,
      restaurant.id,
      orderRequest,
      cart,
    );

    const deliveryAddress = await this.findClientDefaultAddress(clientId);

    order.assignDeliveryAddress(deliveryAddress);

    const dishes = await this.findDish.findByIds(
      order.orderItems.map((item) => item.dishId),
    );
    order.captureOrderItemSnapShots(dishes);

    await this.orderRepo.save(order);

    cart.emptyCart();
    await this.cartRepo.saveUpdate(cart);

    const newOrder =
      await this.orderNotificationReader.findOrderSummaryForRestaurant(
        restaurantId,
        order.orderId,
      );

    this.orderGateway.emitOrderCreated(restaurantId.value, newOrder);
  }

  private async findClientDefaultAddress(clientId: ClientId) {
    const deliveryAddress =
      await this.findDeliveryAddress.findClientDefaultAddress(clientId);
    if (!deliveryAddress) {
      throw new ConflictException('Client default address not found');
    }
    return deliveryAddress;
  }

  private async findRestaurantById(
    restaurantId: RestaurantId,
  ): Promise<Restaurant> {
    const restaurant = await this.findRestaurant.findById(restaurantId);
    if (!restaurant) {
      throw new ConflictException('Restaurant not found');
    }
    return restaurant;
  }

  private async findClientCart(clientId: ClientId): Promise<Cart> {
    const cart = await this.cartRepo.findByClientId(clientId);
    if (!cart) throw new NotFoundException('Cart Not Found');
    return cart;
  }
}
