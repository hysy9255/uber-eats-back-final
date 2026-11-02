import { InjectRepository } from '@nestjs/typeorm';
import { CartCleanUp } from 'src/menu/application/ports/cart-clean-up';
import { CartEntity } from '../orm-entities/cart.orm-entity';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../orm-entities/cart-item.orm-entity';
import { DishId } from 'src/menu/domain/value-objects/dish-id';

export class CartCleanUpAdaptor implements CartCleanUp {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,

    @InjectRepository(CartItemEntity)
    private readonly cartItemRepo: Repository<CartItemEntity>,
  ) {}

  async removeDishFromAllCarts(dishId: DishId) {
    await this.cartItemRepo.delete({
      dishId: dishId.value,
    });

    await this.cartRepo
      .createQueryBuilder()
      .update(CartEntity)
      .set({
        restaurantId: null,
      })
      .where(
        `
        NOT EXISTS (
          SELECT 1
          FROM cart_items item
          WHERE item."cartId" = "carts"."id"
        )
      `,
      )
      .execute();
  }

  async removeDishesFromAllCarts(dishIds: DishId[]) {
    if (dishIds.length === 0) {
      return;
    }

    const values = dishIds.map((id) => id.value);

    const affectedItems = await this.cartItemRepo
      .createQueryBuilder('item')
      .select('item.cartId', 'cartId')
      .where('item.dishId IN (:...dishIds)', {
        dishIds: values,
      })
      .getRawMany<{ cartId: string }>();

    const affectedCartIds = [
      ...new Set(affectedItems.map((item) => item.cartId)),
    ];

    if (affectedCartIds.length === 0) {
      return;
    }

    await this.cartItemRepo
      .createQueryBuilder()
      .delete()
      .from(CartItemEntity)
      .where('"dishId" IN (:...dishIds)', {
        dishIds: values,
      })
      .execute();

    await this.cartRepo
      .createQueryBuilder()
      .update(CartEntity)
      .set({
        restaurantId: null,
      })
      .where('"id" IN (:...cartIds)', {
        cartIds: affectedCartIds,
      })
      .andWhere(
        `
        NOT EXISTS (
          SELECT 1
          FROM cart_items item
          WHERE item."cartId" = "carts"."id"
        )
      `,
      )
      .execute();
  }
}
