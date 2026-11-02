import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { UserRole } from 'src/auth/application/ports/find-user';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { ClientId } from 'src/client/domain/vo/client-id';
import { CurrentClientId } from 'src/client/ui/decorators/current-client-id.decorator';
import { ClientContextInterceptor } from 'src/client/ui/interceptors/client-context.interceptor';
import { ReviewService } from '../application/review.service';
import { OrderId } from 'src/order/domain/vo/order-id';
import { ReviewContent } from '../domain/vo/review-content';
import { Rating } from '../domain/vo/rating';
import { WriteReviewDTO } from './dto/write-review.dto';

@Controller('orders/:orderId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @Roles(UserRole.Client)
  @UseInterceptors(ClientContextInterceptor)
  async writeReview(
    @Param('orderId') orderId: string,
    @CurrentClientId() clientId: ClientId,
    @Body() dto: WriteReviewDTO,
  ) {
    await this.reviewService.writeReview(
      new OrderId(orderId),
      clientId,
      new ReviewContent(dto.content),
      new Rating(dto.rating),
    );
  }
}
