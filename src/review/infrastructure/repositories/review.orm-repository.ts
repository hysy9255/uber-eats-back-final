import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRepository } from 'src/review/application/ports/review.repository';
import { ReviewEntity } from '../entities/review.orm-entity';
import { Repository } from 'typeorm';
import { RatingEntity } from '../entities/rating.orm-entity';
import { Review } from 'src/review/domain/review';

export class ReviewOrmRepository implements ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(RatingEntity)
    private readonly ratingRepo: Repository<RatingEntity>,
  ) {}

  async save(review: Review): Promise<void> {
    const reviewEntity = new ReviewEntity(
      review.content.value,
      review.clientId.value,
      review.orderId.value,
      review.restaurantId.value,
    );

    const { reviewId } = await this.reviewRepo.save(reviewEntity);

    const ratingEntity = new RatingEntity(
      review.rating.value,
      review.restaurantId.value,
      reviewId,
    );

    await this.ratingRepo.save(ratingEntity);
  }
}
