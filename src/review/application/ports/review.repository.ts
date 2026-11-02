import { Review } from 'src/review/domain/review';

export abstract class ReviewRepository {
  abstract save(review: Review): Promise<void>;
}
