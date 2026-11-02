import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderId } from 'src/order/domain/vo/order-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { UserId } from 'src/user/domain/vo/user-id';
import { FindOwnerUser } from './ports/find-owner-user';
import { FindRestaurantOrder } from './ports/find-restaurant-order';

@Injectable()
export class OrderOwnershipService {
  constructor(
    private readonly findUser: FindOwnerUser,
    private readonly findOrder: FindRestaurantOrder,
  ) {}

  async assertUserCanManageOrder(userId: UserId, orderId: OrderId) {
    const user = await this.findUser.findOwnerUserWithRestaurant(userId);

    const restaurantId = user?.owner?.restaurant?.restaurantId;

    if (!restaurantId) {
      throw new NotFoundException('Order not found');
    }

    const order = await this.findOrder.findOrderByIdAndRestaurantId(
      orderId,
      new RestaurantId(restaurantId),
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }
  }
}
