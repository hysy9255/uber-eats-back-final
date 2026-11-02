import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './infrastructure/orm-entities/restaurant.orm-entity';
import { RestaurantQueryService } from './application/services/restaurant.query.service';
import { RestaurantReader } from './application/ports/restaurant.reader';
import { RestaurantOrmReader } from './infrastructure/readers/restaurant.orm-reader';
import { RestaurantQueryController } from './ui/controllers/restaurant.query.controller';
import { OwnerRestaurantQueryController } from './ui/controllers/owner-restaurant.query.controller';
import { RestaurantOwnershipModule } from 'src/authorization/restaurant-ownership/restaurant-ownership.module';
import { OrderEntity } from 'src/order/infrastructure/entities/order.orm-entity';
import { OrderItemsEntity } from 'src/order/infrastructure/entities/order-items.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity, OrderEntity, OrderItemsEntity]),
    RestaurantOwnershipModule,
  ],
  providers: [
    RestaurantQueryService,
    { provide: RestaurantReader, useClass: RestaurantOrmReader },
  ],
  controllers: [RestaurantQueryController, OwnerRestaurantQueryController],
})
export class RestaurantQueryModule {}
