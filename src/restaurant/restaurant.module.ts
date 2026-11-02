import { Module } from '@nestjs/common';
import { RestaurantOperationController } from './ui/controllers/restaurant-operation.controller';
import { RestaurantController } from './ui/controllers/restaurant.controller';
import { RestaurantOperation } from './application/services/restaurant-operation';
import { RestaurantService } from './application/services/restaurant.service';
import { RestaurantInfrastructureModule } from './infrastructure/restaurant-infrastructure.module';
import { RestaurantOwnershipModule } from 'src/authorization/restaurant-ownership/restaurant-ownership.module';
import { RestaurantGateway } from './ui/gateways/restaurant.gateway';

@Module({
  imports: [RestaurantInfrastructureModule, RestaurantOwnershipModule],
  providers: [RestaurantOperation, RestaurantService, RestaurantGateway],
  controllers: [RestaurantOperationController, RestaurantController],
})
export class RestaurantModule {}
