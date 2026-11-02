import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './orm-entities/restaurant.orm-entity';
import { RestaurantRepository } from '../application/ports/restaurant.repository';
import { RestaurantOrmRepository } from './repositories/restaurant.orm-repository';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
  providers: [
    {
      provide: RestaurantRepository,
      useClass: RestaurantOrmRepository,
    },
  ],
  exports: [RestaurantRepository],
})
export class RestaurantCoreInfrastructureModule {}
