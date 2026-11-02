import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantRegistrationRepository } from 'src/registration/restaurant/application/ports/register-restaurant.repository';
import { RestaurantEntity } from '../orm-entities/restaurant.orm-entity';
import { Repository } from 'typeorm';
import { RestaurantProfileEntity } from '../orm-entities/restaurant-profile.orm-entity';
import { RestaurantGalleryEntity } from '../orm-entities/restaurant-image.orm.entity';
import { RestaurantHoursEntity } from '../orm-entities/restaurant-hours.orm.entity';
import { RestaurantAddressEntity } from '../orm-entities/restaurant-address.orm.entity';
import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import { RestaurantProfile } from 'src/restaurant/domain/restaurant-profile/restaurant-profile';
import { RestaurantGallery } from 'src/restaurant/domain/restaurant-gallery/restaurant-gallery';
import { OperatingHours } from 'src/restaurant/domain/operating-hours/operating-hours';
import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { OwnerId } from 'src/owner/domain/owner-id';

export class RestaurantRegistrationOrmRepository implements RestaurantRegistrationRepository {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly repo: Repository<RestaurantEntity>,
    @InjectRepository(RestaurantProfileEntity)
    private readonly profileRepo: Repository<RestaurantProfileEntity>,
    @InjectRepository(RestaurantGalleryEntity)
    private readonly galleryRepo: Repository<RestaurantGalleryEntity>,
    @InjectRepository(RestaurantHoursEntity)
    private readonly hoursRepo: Repository<RestaurantHoursEntity>,
    @InjectRepository(RestaurantAddressEntity)
    private readonly addressRepo: Repository<RestaurantAddressEntity>,
  ) {}

  async checkRestaurantExist(ownerId: OwnerId): Promise<boolean> {
    const result = await this.repo.findOne({
      where: { ownerId: ownerId.value },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async createInitialRestaurant(
    restaurant: Restaurant,
    profile: RestaurantProfile,
    gallery: RestaurantGallery,
    hours: OperatingHours,
    address: RestaurantAddress,
  ) {
    await this.repo.save(
      new RestaurantEntity(
        restaurant.id.value,
        restaurant.ownerId.value,
        restaurant.status.value,
      ),
    );

    await this.profileRepo.save(
      new RestaurantProfileEntity(
        profile.restaurantId.value,
        profile.name.value,
        profile.cuisineType.value,
        profile.email === null ? null : profile.email.value,
        profile.instagram === null ? null : profile.instagram.value,
        profile.website === null ? null : profile.website.value,
        profile.storePhone === null ? null : profile.storePhone.value,
      ),
    );

    await this.galleryRepo.save(
      new RestaurantGalleryEntity(
        gallery.restaurantId.value,
        gallery.logo === null ? null : gallery.logo.value,
        gallery.mainImage.value,
        gallery.sub1Image.value,
        gallery.sub2Image.value,
        gallery.bannerImage.value,
      ),
    );

    await this.hoursRepo.save(
      hours.days.map(
        (day) =>
          new RestaurantHoursEntity(
            hours.restaurantId.value,
            day.dayOfWeek.value,
            day.isClosed.value,
            day.openTime === null ? null : day.openTime.value,
            day.closeTime === null ? null : day.closeTime.value,
          ),
      ),
    );

    await this.addressRepo.save(
      new RestaurantAddressEntity(
        address.restaurantId.value,
        address.address.streetAddress.value,
        address.address.city.value,
        address.address.state.value,
        address.address.zip.value,
        address.address.apt === null ? null : address.address.apt.value,
      ),
    );
  }
}
