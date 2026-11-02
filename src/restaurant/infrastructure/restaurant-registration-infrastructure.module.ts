import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './orm-entities/restaurant.orm-entity';
import { RestaurantHoursEntity } from './orm-entities/restaurant-hours.orm.entity';
import { RestaurantProfileEntity } from './orm-entities/restaurant-profile.orm-entity';
import { RestaurantAddressEntity } from './orm-entities/restaurant-address.orm.entity';
import { RestaurantGalleryEntity } from './orm-entities/restaurant-image.orm.entity';
import { RestaurantRegistrationRepository } from 'src/registration/restaurant/application/ports/register-restaurant.repository';
import { RestaurantRegistrationOrmRepository } from './repositories/restaurant-registration.orm-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantEntity,
      RestaurantHoursEntity,
      RestaurantProfileEntity,
      RestaurantAddressEntity,
      RestaurantGalleryEntity,
    ]),
  ],
  providers: [
    {
      provide: RestaurantRegistrationRepository,
      useClass: RestaurantRegistrationOrmRepository,
    },
  ],
  exports: [RestaurantRegistrationRepository],
})
export class RestaurantRegistrationInfrastructureModule {}
