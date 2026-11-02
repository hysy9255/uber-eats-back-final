import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from '../application/cart.service';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { ClientContextInterceptor } from 'src/client/ui/interceptors/client-context.interceptor';
import { ClientId } from 'src/client/domain/vo/client-id';
import { CurrentClientId } from 'src/client/ui/decorators/current-client-id.decorator';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { Quantity } from 'src/order/domain/vo/quantity';
import { AddToCartDTO } from './dtos/add-to-cart.dto';
import { CartQueryService } from '../application/cart.query.service';
import { CartDTO } from './dtos/query/cart.dto';
import { CartItem } from '../domain/cart-item';

@Controller('cart')
@Roles(UserRole.Client)
@UseInterceptors(ClientContextInterceptor)
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly cartQueryService: CartQueryService,
  ) {}

  @Get()
  async myCart(@CurrentClientId() clientId: ClientId): Promise<CartDTO> {
    return await this.cartQueryService.viewMyCart(clientId);
  }

  @Post('items')
  async addToCart(
    @CurrentClientId() clientId: ClientId,
    @Body() dto: AddToCartDTO,
  ) {
    await this.cartService.addToCart(
      clientId,
      new DishId(dto.dishId),
      new Quantity(dto.quantity),
    );
  }

  @Put('items')
  async replaceItems(
    @CurrentClientId() clientId: ClientId,
    @Body() dto: AddToCartDTO,
  ) {
    await this.cartService.replaceItems(
      clientId,
      new DishId(dto.dishId),
      new Quantity(dto.quantity),
    );
  }

  @Post('items/bulk')
  async addBulkToCart(
    @CurrentClientId() clientId: ClientId,
    @Body() dto: AddToCartDTO[],
  ) {
    await this.cartService.addBulkToCart(
      clientId,
      dto.map((item) => ({
        dishId: new DishId(item.dishId),
        quantity: new Quantity(item.quantity),
      })),
    );
  }

  @Put('items/bulk')
  async replaceItemsWithBulkItems(
    @CurrentClientId() clientId: ClientId,
    @Body() dto: AddToCartDTO[],
  ) {
    await this.cartService.replaceItemsWithBulkItems(
      clientId,
      dto.map(
        (item) =>
          new CartItem(new DishId(item.dishId), new Quantity(item.quantity)),
      ),
    );
  }

  @Patch('items/:dishId/increase')
  async increaseQuantity(
    @CurrentClientId() clientId: ClientId,
    @Param('dishId') dishId: string,
  ) {
    await this.cartService.increaseQuantity(clientId, new DishId(dishId));
  }

  @Patch('items/:dishId/decrease')
  async decreaseQuantity(
    @CurrentClientId() clientId: ClientId,
    @Param('dishId') dishId: string,
  ) {
    await this.cartService.decreaseQuantity(clientId, new DishId(dishId));
  }
}
