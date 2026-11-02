import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './orm-entities/restaurant.orm-entity';
import { FindRestaurantAdaptor } from './adaptors/find-restaurant.adaptor';
import { FindOwnerRestaurantAdapter } from './adaptors/find-owner-restaurant.adaptor';
import { FindOwnerRestaurant } from 'src/authorization/restaurant-ownership/application/ports/find-owner-restaurant';
import { FindRestaurant } from '../application/ports/find-restaurant';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [
    { provide: FindRestaurant, useClass: FindRestaurantAdaptor },
    {
      provide: FindOwnerRestaurant,
      useClass: FindOwnerRestaurantAdapter,
    },
  ],
  exports: [FindRestaurant, FindOwnerRestaurant],
})
export class RestaurantLookupInfrastructureModule {}
