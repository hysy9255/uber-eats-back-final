import { Module } from '@nestjs/common';
import { RegisterRestaurantService } from './application/register-restaurant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { RestaurantInfrastructureModule } from 'src/restaurant/infrastructure/restaurant-infrastructure.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    RestaurantInfrastructureModule,
  ],
  providers: [RegisterRestaurantService],
  exports: [RegisterRestaurantService],
})
export class RegistrationRestaurantModule {}
