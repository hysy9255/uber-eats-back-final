import { RestaurantGallery } from 'src/restaurant/domain/restaurant-gallery/restaurant-gallery';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export abstract class RestaurantGalleryRepository {
  abstract findOneByRestaurantId(
    restaurantId: RestaurantId,
  ): Promise<RestaurantGallery | null>;

  abstract saveUpdate(gallery: RestaurantGallery): Promise<void>;
}
