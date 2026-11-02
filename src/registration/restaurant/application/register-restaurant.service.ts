import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { OperatingHours } from 'src/restaurant/domain/operating-hours/operating-hours';
import { Injectable } from '@nestjs/common';
import { RestaurantRegistrationRepository } from './ports/register-restaurant.repository';
import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';
import { RestaurantProfile } from 'src/restaurant/domain/restaurant-profile/restaurant-profile';
import { RestaurantGallery } from 'src/restaurant/domain/restaurant-gallery/restaurant-gallery';

@Injectable()
export class RegisterRestaurantService {
  constructor(
    private readonly registerRestaurantRepo: RestaurantRegistrationRepository,
  ) {}

  async register(
    restaurant: Restaurant,
    profile: RestaurantProfile,
    gallery: RestaurantGallery,
    hours: OperatingHours,
    address: RestaurantAddress,
  ) {
    const restaurantExists =
      await this.registerRestaurantRepo.checkRestaurantExist(
        restaurant.ownerId,
      );

    if (restaurantExists) throw new Error('Owner already owns restaurant');

    await this.registerRestaurantRepo.createInitialRestaurant(
      restaurant,
      profile,
      gallery,
      hours,
      address,
    );
  }
}
