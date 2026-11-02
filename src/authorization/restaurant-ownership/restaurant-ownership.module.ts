import { Module } from '@nestjs/common';
import { RestaurantOwnershipGuard } from './ui/restaurant-ownership.guard';
import { RestaurantOwnershipService } from './application/restaurant-ownership.service';
import { RestaurantInfrastructureModule } from 'src/restaurant/infrastructure/restaurant-infrastructure.module';

@Module({
  imports: [RestaurantInfrastructureModule],
  providers: [RestaurantOwnershipGuard, RestaurantOwnershipService],
  exports: [RestaurantOwnershipService],
})
export class RestaurantOwnershipModule {}
