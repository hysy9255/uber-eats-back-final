import { Module } from '@nestjs/common';
import { MenuService } from './services/menu.service';
import { MenuInfrastructureModule } from '../infrastructure/menu-infrastructure.module';
import { CartInfastructureModule } from 'src/cart/infrastructure/cart-infrastructure.module';
import { RestaurantLookupInfrastructureModule } from 'src/restaurant/infrastructure/restaurant-lookup-infrastructure.module';

@Module({
  imports: [
    MenuInfrastructureModule,
    CartInfastructureModule,
    RestaurantLookupInfrastructureModule,
  ],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuApplicationModule {}
