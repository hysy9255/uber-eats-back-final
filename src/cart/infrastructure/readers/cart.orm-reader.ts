import { Injectable } from '@nestjs/common';
import { CartReader } from 'src/cart/application/ports/cart.reader';
import { CartEntity } from '../orm-entities/cart.orm-entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientId } from 'src/client/domain/vo/client-id';
import {
  CartDTO,
  CartItemDTO,
  RestaurantInfoDTO,
} from 'src/cart/ui/dtos/query/cart.dto';

@Injectable()
export class CartOrmReader implements CartReader {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
  ) {}

  async findByClientId(clientId: ClientId): Promise<CartDTO> {
    const entity = await this.cartRepo.findOne({
      relations: {
        items: {
          dish: true,
        },
        restaurant: {
          profile: true,
          gallery: true,
        },
      },
      select: {
        items: {
          id: true,
          dish: {
            dishId: true,
            name: true,
            price: true,
            description: true,
            dishImgUrl: true,
          },
          quantity: true,
        },
        restaurant: {
          restaurantId: true,
          profile: {
            restaurantId: true,
            name: true,
          },
          gallery: {
            restaurantId: true,
            logo: true,
          },
        },
      },
      where: {
        clientId: clientId.value,
      },
    });

    if (!entity) {
      return new CartDTO(null, []);
    }

    return new CartDTO(
      entity.restaurant === null
        ? null
        : new RestaurantInfoDTO(
            entity.restaurant.restaurantId,
            entity.restaurant.profile.name,
            entity.restaurant.gallery.logo,
          ),
      entity.items.map(
        (item) =>
          new CartItemDTO(
            item.dish.dishId,
            item.dish.dishImgUrl,
            item.dish.name,
            item.dish.description,
            item.dish.price,
            item.quantity,
          ),
      ),
    );
  }
}
