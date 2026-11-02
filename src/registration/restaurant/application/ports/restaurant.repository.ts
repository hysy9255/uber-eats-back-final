import { OperatingHours } from 'src/restaurant/domain/operating-hours/operating-hours';
import { RestaurantAddress } from 'src/restaurant/domain/restaurant-address/restaurant-address';
import { RestaurantGallery } from 'src/restaurant/domain/restaurant-gallery/restaurant-gallery';
import { RestaurantProfile } from 'src/restaurant/domain/restaurant-profile/restaurant-profile';

export abstract class RestaurantRepository {
  abstract saveOperatingHours(hours: OperatingHours): Promise<void>;
  abstract saveProfile(profile: RestaurantProfile): Promise<void>;
  abstract saveAddress(address: RestaurantAddress): Promise<void>;
  abstract saveGallery(gallery: RestaurantGallery): Promise<void>;
}
