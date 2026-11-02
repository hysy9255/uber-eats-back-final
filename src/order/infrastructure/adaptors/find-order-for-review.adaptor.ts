import { InjectRepository } from '@nestjs/typeorm';
import { FindOrderForReview } from 'src/review/application/ports/find-order-for-review';
import { OrderEntity } from '../entities/order.orm-entity';
import { Repository } from 'typeorm';
import { OrderId } from 'src/order/domain/vo/order-id';
import { ClientId } from 'src/client/domain/vo/client-id';
import { OrderForReview } from 'src/review/domain/order-for-review';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { OrderStatus } from 'src/order/domain/order-progress';

export class FindOrderForReviewAdaptor implements FindOrderForReview {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async findByIdAndClientId(
    orderId: OrderId,
    clientId: ClientId,
  ): Promise<OrderForReview | null> {
    const entity = await this.orderRepo.findOne({
      where: {
        orderId: orderId.value,
        clientId: clientId.value,
      },
      select: {
        orderId: true,
        clientId: true,
        restaurantId: true,
        status: true,
        review: {
          reviewId: true,
        },
      },
      relations: {
        review: true,
      },
    });

    if (!entity) return null;

    return new OrderForReview(
      new OrderId(entity.orderId),
      new ClientId(entity.clientId),
      new RestaurantId(entity.restaurantId),
      new OrderStatus(entity.status),
      entity?.review ? true : false,
    );
  }
}
