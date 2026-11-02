import { ClientId } from 'src/client/domain/vo/client-id';
import { OrderId } from 'src/order/domain/vo/order-id';
import { ReviewContent } from './vo/review-content';
import { Rating } from './vo/rating';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

export class Review {
  constructor(
    private readonly _orderId: OrderId,
    private readonly _restaurantId: RestaurantId,
    private readonly _clientId: ClientId,
    private readonly _content: ReviewContent,
    private readonly _rating: Rating,
  ) {}

  get orderId() {
    return this._orderId;
  }

  get restaurantId() {
    return this._restaurantId;
  }

  get clientId() {
    return this._clientId;
  }

  get content() {
    return this._content;
  }

  get rating() {
    return this._rating;
  }
}
