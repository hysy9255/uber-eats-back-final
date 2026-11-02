import { Module } from '@nestjs/common';
import { OrderInfastructureModule } from 'src/order/infrastructure/order-infrastructure.module';
import { ReviewService } from './application/review.service';
import { ReviewController } from './ui/review.controller';
import { ClientContextModule } from 'src/client/ui/client-context.module';
import { ReviewRepository } from './application/ports/review.repository';
import { ReviewOrmRepository } from './infrastructure/repositories/review.orm-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEntity } from './infrastructure/entities/review.orm-entity';
import { RatingEntity } from './infrastructure/entities/rating.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, RatingEntity]),
    OrderInfastructureModule,
    ClientContextModule,
  ],
  providers: [
    ReviewService,
    { provide: ReviewRepository, useClass: ReviewOrmRepository },
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}
