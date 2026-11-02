import { OwnerId } from 'src/owner/domain/owner-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { UserId } from 'src/user/domain/vo/user-id';

export interface FoundOwner {
  ownerId: OwnerId;
  restaurantId: RestaurantId | null;
}

export abstract class OwnerRepository {
  abstract findByUserId(userId: UserId): Promise<FoundOwner | null>;
}
