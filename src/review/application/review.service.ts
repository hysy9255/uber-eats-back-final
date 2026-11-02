import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientId } from 'src/client/domain/vo/client-id';
import { Review } from '../domain/review';
import { OrderId } from 'src/order/domain/vo/order-id';
import { ReviewContent } from '../domain/vo/review-content';
import { Rating } from '../domain/vo/rating';
import { FindOrderForReview } from './ports/find-order-for-review';
import { ReviewRepository } from './ports/review.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly findOrderForReview: FindOrderForReview,
  ) {}

  async writeReview(
    orderId: OrderId,
    clientId: ClientId,
    content: ReviewContent,
    rating: Rating,
  ) {
    const order = await this.findOrderForReview.findByIdAndClientId(
      orderId,
      clientId,
    );

    if (!order) throw new NotFoundException('Order Not Found');

    order.ensureCanWriteReview();

    const review = new Review(
      order.orderId,
      order.restaurantId,
      order.clientId,
      content,
      rating,
    );

    await this.reviewRepo.save(review);
  }

  // async viewReviews(restaurantId: RestaurantId) {}

  // async viewMyReviews(clientId: ClientId) {}
}
