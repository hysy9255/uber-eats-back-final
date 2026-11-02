import { InjectRepository } from '@nestjs/typeorm';
import { CartRepository } from 'src/cart/application/ports/cart.repository';
import { CartEntity } from '../orm-entities/cart.orm-entity';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../orm-entities/cart-item.orm-entity';
import { ClientId } from 'src/client/domain/vo/client-id';
import { Cart } from 'src/cart/domain/cart';
import { CartFactory } from 'src/cart/domain/factories/cart.factory';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { Injectable } from '@nestjs/common';
import { FindCart } from 'src/order/application/ports/find-cart';

@Injectable()
export class CartOrmRepository implements CartRepository, FindCart {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepo: Repository<CartItemEntity>,
  ) {}

  async findByClientId(clientId: ClientId): Promise<Cart | null> {
    const cartEntity = await this.cartRepo.findOne({
      where: { clientId: clientId.value },
      relations: {
        items: true,
      },
    });
    if (!cartEntity) return null;

    return CartFactory.create(
      cartEntity.clientId,
      cartEntity.restaurantId,
      cartEntity.items.map((item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
      })),
    );
  }

  async saveUpdate(cart: Cart): Promise<void> {
    const { cartId } = await this.saveCartEntity(cart);

    await this.cartItemRepo.delete({ cartId });

    const cartItemEntities = cart.cartItems.map(
      (item) =>
        new CartItemEntity(item.dishId.value, item.quantity.value, cartId),
    );

    if (cartItemEntities.length > 0) {
      await this.cartItemRepo.save(cartItemEntities);
    }
  }

  private async saveCartEntity(cart: Cart): Promise<{ cartId: string }> {
    const cartEntity = await this.findClientCartEntity(cart.clientId);

    if (!cartEntity) {
      return this.createCartEntity(cart);
    }

    await this.syncRestaurantId(cartEntity, cart.restaurantId);
    return { cartId: cartEntity.id };
  }

  private async findClientCartEntity(
    clientId: ClientId,
  ): Promise<CartEntity | null> {
    return await this.cartRepo.findOne({
      where: { clientId: clientId.value },
    });
  }

  private async createCartEntity(cart: Cart): Promise<{ cartId: string }> {
    if (!cart.restaurantId) {
      throw new Error('Cannot create a cart without a restaurant');
    }

    const newCartEntity = new CartEntity(
      cart.clientId.value,
      cart.restaurantId.value,
    );
    const { id } = await this.cartRepo.save(newCartEntity);
    return { cartId: id };
  }

  private async syncRestaurantId(
    cartEntity: CartEntity,
    restaurantId: RestaurantId | null,
  ): Promise<void> {
    const newRestaurantId = restaurantId?.value ?? null;

    if (cartEntity.restaurantId === newRestaurantId) {
      return;
    }

    cartEntity.restaurantId = newRestaurantId;
    await this.cartRepo.save(cartEntity);
  }
}
