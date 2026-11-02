import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from '../entities/order.orm-entity';
import { Repository } from 'typeorm';
import { OrderId } from 'src/order/domain/vo/order-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { FindRestaurantOrder } from 'src/authorization/order-ownership/ports/find-restaurant-order';

@Injectable()
export class FindOrderAdaptor implements FindRestaurantOrder {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async findOrderByIdAndRestaurantId(
    orderId: OrderId,
    restaurantId: RestaurantId,
  ): Promise<OrderEntity | null> {
    return await this.orderRepo.findOne({
      where: {
        orderId: orderId.value,
        restaurantId: restaurantId.value,
      },
    });
  }
}
