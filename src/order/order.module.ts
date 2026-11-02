import { Module } from '@nestjs/common';
import { OrderController } from './ui/order.controller';
import { OrderPlacementService } from './application/order-placement.service';
import { OrderManagementService } from './application/order-management.service';
import { ClientContextModule } from 'src/client/ui/client-context.module';
import { OrderInfastructureModule } from './infrastructure/order-infrastructure.module';
import { RestaurantInfrastructureModule } from 'src/restaurant/infrastructure/restaurant-infrastructure.module';
import { DeliveryAddressInfrastructureModule } from 'src/client/infrastructure/delivery-address-infrastructure.module';
import { MenuInfrastructureModule } from 'src/menu/infrastructure/menu-infrastructure.module';
import { OrderOwnershipModule } from 'src/authorization/order-ownership/order-ownership.module';
import { CartInfastructureModule } from 'src/cart/infrastructure/cart-infrastructure.module';
import { OrderQueryController } from './ui/order.query.controller';
import { OrderQueryService } from './application/order.query.service';
import { OwnerContextModule } from 'src/owner/ui/owner-context.module';
import { OrderGateway } from './ui/order.gateway';

@Module({
  imports: [
    MenuInfrastructureModule,
    RestaurantInfrastructureModule,
    DeliveryAddressInfrastructureModule,
    OrderInfastructureModule,
    ClientContextModule,
    OwnerContextModule,
    OrderOwnershipModule,
    CartInfastructureModule,
  ],
  providers: [
    OrderPlacementService,
    OrderManagementService,
    OrderQueryService,
    OrderGateway,
  ],
  controllers: [OrderController, OrderQueryController],
})
export class OrderModule {}
