import { InjectRepository } from '@nestjs/typeorm';
import { OrderProgressRepository } from 'src/order/application/ports/order-progress.repository';
import { OrderEntity } from '../entities/order.orm-entity';
import { Repository } from 'typeorm';
import { OrderId } from 'src/order/domain/vo/order-id';
import { OrderProgress, OrderStatus } from 'src/order/domain/order-progress';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { NotFoundException } from '@nestjs/common';

export class OrderProgressOrmRepository extends OrderProgressRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {
    super();
  }

  async findByOrderId(orderId: OrderId): Promise<OrderProgress | null> {
    const entity = await this.orderRepo.findOne({
      where: { orderId: orderId.value },
    });
    if (!entity) {
      return null;
    }

    return new OrderProgress(
      new OrderId(entity.orderId),
      new RestaurantId(entity.restaurantId),
      new OrderStatus(entity.status),
      entity.deliveredAt,
    );
  }

  async saveUpdate(orderProgress: OrderProgress): Promise<void> {
    const entity = await this.orderRepo.findOne({
      where: { orderId: orderProgress.orderId.value },
    });
    if (!entity) throw new NotFoundException('Order not found');
    entity.status = orderProgress.orderStatus.value;
    entity.deliveredAt = orderProgress.deliveredAt;
    await this.orderRepo.save(entity);
  }
}
