import { RestaurantGallery } from '../restaurant-gallery/restaurant-gallery';
import { GeneralImageUrl } from '../restaurant-gallery/vo/general-image-url';
import { RestaurantId } from '../restaurant/vo/restaurant-id';

export class RestaurantGalleryFactory {
  static create(
    restaurantId: string,
    logo: string | null,
    mainImg: string,
    sub1Img: string,
    sub2Img: string,
    bannerImg: string,
  ) {
    return new RestaurantGallery(
      new RestaurantId(restaurantId),
      logo ? new GeneralImageUrl(logo) : null,
      new GeneralImageUrl(mainImg),
      new GeneralImageUrl(sub1Img),
      new GeneralImageUrl(sub2Img),
      new GeneralImageUrl(bannerImg),
    );
  }
}
