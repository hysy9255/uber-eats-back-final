import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.orm-entity';
import { Repository } from 'typeorm';
import { RestaurantId } from '../../../restaurant/domain/restaurant/vo/restaurant-id';
import {
  OrderItemSummary,
  RestaurantOrderSummaryDTO,
} from '../../ui/dtos/restaurant-order-summary.dto';
import { OrderId } from '../../domain/vo/order-id';
import { OrderNotificationReader } from '../../application/ports/order-notification.reader';

@Injectable()
export class OrderNotificationOrmReader implements OrderNotificationReader {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async findOrderSummaryForRestaurant(
    restaurantId: RestaurantId,
    orderId: OrderId,
  ): Promise<RestaurantOrderSummaryDTO | null> {
    const where = {
      restaurantId: restaurantId.value,
      orderId: orderId.value,
    };

    const entity = await this.orderRepo.findOne({
      where,
      relations: {
        client: {
          user: true,
        },
        orderItems: true,
      },
      select: {
        orderId: true,
        status: true,
        orderedAt: true,
        totalPrice: true,
        client: {
          clientId: true,
          user: {
            name: true,
            phoneNumber: true,
          },
        },
        orderItems: {
          orderItemId: true,
          dishName: true,
          quantity: true,
        },
      },
    });

    if (!entity) return null;

    return new RestaurantOrderSummaryDTO(
      entity.orderId,
      entity.status,
      entity.client.user.name,
      entity.orderedAt,
      entity.totalPrice,
      entity.orderItems.map(
        (item) => new OrderItemSummary(item.dishName, item.quantity),
      ),
    );
  }
}
