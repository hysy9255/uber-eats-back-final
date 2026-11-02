import { OwnerId } from 'src/owner/domain/owner-id';
import { OperatingHours } from 'src/restaurant/domain/operating-hours/operating-hours';
import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { RestaurantGallery } from 'src/restaurant/domain/restaurant-gallery/restaurant-gallery';
import { RestaurantProfile } from 'src/restaurant/domain/restaurant-profile/restaurant-profile';
import { Restaurant } from 'src/restaurant/domain/restaurant/restaurant';

export abstract class RestaurantRegistrationRepository {
  abstract createInitialRestaurant(
    restaurant: Restaurant,
    profile: RestaurantProfile,
    gallery: RestaurantGallery,
    hours: OperatingHours,
    address: RestaurantAddress,
  ): Promise<void>;

  abstract checkRestaurantExist(ownerId: OwnerId): Promise<boolean>;
}
