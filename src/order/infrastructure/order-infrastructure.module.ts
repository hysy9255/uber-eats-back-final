import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.orm-entity';
import { OrderItemsEntity } from './entities/order-items.orm-entity';
import { DeliveryAddressSnapEntity } from './entities/delivery-address-snap.orm-entity';
import { OrderProgressRepository } from '../application/ports/order-progress.repository';
import { OrderProgressOrmRepository } from './repositories/order-progress.orm-repository';
import { OrderRepository } from '../application/ports/order.repository';
import { OrderOrmRepository } from './repositories/order.orm-repository';
import { FindOrderAdaptor } from './adaptors/find-order.adaptor';
import { FindRestaurantOrder } from 'src/authorization/order-ownership/ports/find-restaurant-order';
import { OrderReader } from '../application/ports/order.reader';
import { OrderOrmReader } from './readers/order.orm-reader';
import { FindOrderForReview } from 'src/review/application/ports/find-order-for-review';
import { FindOrderForReviewAdaptor } from './adaptors/find-order-for-review.adaptor';
import { OrderRequestEntity } from './entities/order-request.orm-entity';
import { OrderNotificationReader } from '../application/ports/order-notification.reader';
import { OrderNotificationOrmReader } from './readers/order-notification.orm-reader';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderItemsEntity,
      DeliveryAddressSnapEntity,
      OrderRequestEntity,
    ]),
  ],
  providers: [
    { provide: FindRestaurantOrder, useClass: FindOrderAdaptor },
    {
      provide: OrderProgressRepository,
      useClass: OrderProgressOrmRepository,
    },
    {
      provide: OrderRepository,
      useClass: OrderOrmRepository,
    },
    {
      provide: OrderReader,
      useClass: OrderOrmReader,
    },
    {
      provide: FindOrderForReview,
      useClass: FindOrderForReviewAdaptor,
    },
    {
      provide: OrderNotificationReader,
      useClass: OrderNotificationOrmReader,
    },
  ],
  exports: [
    OrderProgressRepository,
    OrderRepository,
    FindRestaurantOrder,
    OrderReader,
    FindOrderForReview,
    OrderNotificationReader,
  ],
})
export class OrderInfastructureModule {}
