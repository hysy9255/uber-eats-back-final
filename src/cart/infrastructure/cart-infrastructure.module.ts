import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './orm-entities/cart.orm-entity';
import { CartItemEntity } from './orm-entities/cart-item.orm-entity';
import { CartRepository } from '../application/ports/cart.repository';
import { CartOrmRepository } from './repositories/cart.orm-repository';
import { FindCart } from 'src/order/application/ports/find-cart';
import { CartReader } from '../application/ports/cart.reader';
import { CartOrmReader } from './readers/cart.orm-reader';
import { CartCleanUp } from 'src/menu/application/ports/cart-clean-up';
import { CartCleanUpAdaptor } from './adaptors/cart-clean-up.adaptor';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity])],
  providers: [
    CartOrmRepository,
    {
      provide: CartRepository,
      useExisting: CartOrmRepository,
    },
    {
      provide: FindCart,
      useExisting: CartOrmRepository,
    },
    {
      provide: CartReader,
      useClass: CartOrmReader,
    },
    {
      provide: CartCleanUp,
      useClass: CartCleanUpAdaptor,
    },
  ],
  exports: [CartRepository, FindCart, CartReader, CartCleanUp],
})
export class CartInfastructureModule {}
