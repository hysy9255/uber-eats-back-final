import { Module } from '@nestjs/common';
import { RestaurantCoreInfrastructureModule } from './restaurant-core-infrastructure.module';
import { RestaurantDetailInfrastructureModule } from './restaurant-detail-infrastructure.module';
import { RestaurantRegistrationInfrastructureModule } from './restaurant-registration-infrastructure.module';
import { RestaurantLookupInfrastructureModule } from './restaurant-lookup-infrastructure.module';

@Module({
  imports: [
    RestaurantCoreInfrastructureModule,
    RestaurantDetailInfrastructureModule,
    RestaurantRegistrationInfrastructureModule,
    RestaurantLookupInfrastructureModule,
  ],
  exports: [
    RestaurantCoreInfrastructureModule,
    RestaurantDetailInfrastructureModule,
    RestaurantRegistrationInfrastructureModule,
    RestaurantLookupInfrastructureModule,
  ],
})
export class RestaurantInfrastructureModule {}
