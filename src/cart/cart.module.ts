import { Module } from '@nestjs/common';
import { CartService } from './application/cart.service';
import { CartController } from './ui/cart.controller';
import { MenuInfrastructureModule } from 'src/menu/infrastructure/menu-infrastructure.module';
import { ClientContextModule } from 'src/client/ui/client-context.module';
import { CartInfastructureModule } from './infrastructure/cart-infrastructure.module';
import { CartQueryService } from './application/cart.query.service';

@Module({
  imports: [
    CartInfastructureModule,
    MenuInfrastructureModule,
    ClientContextModule,
  ],
  providers: [CartService, CartQueryService],
  controllers: [CartController],
})
export class CartModule {}
