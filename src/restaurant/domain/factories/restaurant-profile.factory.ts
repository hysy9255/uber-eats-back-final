import { Email } from 'src/user/domain/vo/email';
import { RestaurantProfile } from '../restaurant-profile/restaurant-profile';
import { CuisineType } from '../restaurant-profile/vo/cuisine-type';
import { RestaurantName } from '../restaurant-profile/vo/restaurant-name';
import { RestaurantId } from '../restaurant/vo/restaurant-id';
import { InstagramUrl } from '../restaurant-profile/vo/instagram-url';
import { WebsiteUrl } from '../restaurant-profile/vo/website-url';
import { StorePhone } from '../restaurant-profile/vo/store-phone';

export class RestaurantProfileFactory {
  static create(
    restuarantId: string,
    name: string,
    cuisineType: string,
    email: string | null,
    instagram: string | null,
    website: string | null,
    storePhone: string | null,
  ) {
    return new RestaurantProfile(
      new RestaurantId(restuarantId),
      new RestaurantName(name),
      new CuisineType(cuisineType),
      email === null ? null : new Email(email),
      instagram === null ? null : new InstagramUrl(instagram),
      website === null ? null : new WebsiteUrl(website),
      storePhone === null ? null : new StorePhone(storePhone),
    );
  }
}
