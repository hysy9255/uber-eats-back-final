import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantHoursEntity } from './orm-entities/restaurant-hours.orm.entity';
import { RestaurantProfileEntity } from './orm-entities/restaurant-profile.orm-entity';
import { RestaurantAddressEntity } from './orm-entities/restaurant-address.orm.entity';
import { RestaurantGalleryEntity } from './orm-entities/restaurant-image.orm.entity';
import { RestaurantProfileRepository } from '../application/ports/restaurant-profile.repository';
import { RestaurantProfileOrmRepository } from './repositories/restaurant-profile.orm-repository';
import { RestaurantOperatingHoursRepository } from '../application/ports/restaurant-operating-hours.repository';
import { RestaurantOperatingHoursOrmRepository } from './repositories/restaurant-operating-hours.orm-repository';
import { RestaurantAddressRepository } from '../application/ports/restaurant-address.repository';
import { RestaurantAddressOrmRepository } from './repositories/restaurant-address.orm-repository';
import { RestaurantGalleryRepository } from '../application/ports/restaurant-gallery.repository';
import { RestaurantGalleryOrmRepository } from './repositories/restaurant-gallery.orm-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantHoursEntity,
      RestaurantProfileEntity,
      RestaurantAddressEntity,
      RestaurantGalleryEntity,
    ]),
  ],
  providers: [
    {
      provide: RestaurantProfileRepository,
      useClass: RestaurantProfileOrmRepository,
    },
    {
      provide: RestaurantOperatingHoursRepository,
      useClass: RestaurantOperatingHoursOrmRepository,
    },
    {
      provide: RestaurantAddressRepository,
      useClass: RestaurantAddressOrmRepository,
    },
    {
      provide: RestaurantGalleryRepository,
      useClass: RestaurantGalleryOrmRepository,
    },
  ],
  exports: [
    RestaurantProfileRepository,
    RestaurantOperatingHoursRepository,
    RestaurantAddressRepository,
    RestaurantGalleryRepository,
  ],
})
export class RestaurantDetailInfrastructureModule {}
