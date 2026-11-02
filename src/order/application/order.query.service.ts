import { Injectable } from '@nestjs/common';
import { OrderReader } from './ports/order.reader';
import { ClientId } from 'src/client/domain/vo/client-id';
import { ClientOrderSummaryDTO } from '../ui/dtos/client-order-summary.dto';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { RestaurantOrderSummaryDTO } from '../ui/dtos/restaurant-order-summary.dto';
import { OrderStatusType } from '../domain/order-progress';
import { ClientOrderViewType } from '../ui/dtos/client-order.query.dto';
import { ClientOrderDetailDTO } from '../ui/dtos/client-order-detail.dto';
import { OrderId } from '../domain/vo/order-id';
import { RestaurantOrderDetailDTO } from '../ui/dtos/restaurant-order-detail.dto';

@Injectable()
export class OrderQueryService {
  constructor(private readonly orderReader: OrderReader) {}

  async clientViewOrderSummariess(
    clientId: ClientId,
    type: ClientOrderViewType,
  ): Promise<ClientOrderSummaryDTO[]> {
    switch (type) {
      case ClientOrderViewType.ONGOING:
        return await this.orderReader.findOnGoingOrdersForClient(clientId);
      case ClientOrderViewType.COMPLETED:
        return await this.orderReader.findCompletedOrdersForClient(clientId);
      default:
        throw new Error('This order type is not supported');
    }
  }

  async clientViewOrderDetail(
    clientId: ClientId,
    orderId: OrderId,
  ): Promise<ClientOrderDetailDTO> {
    const result = await this.orderReader.findOrderDetailForClient(
      clientId,
      orderId,
    );
    if (!result) throw new Error('Order detail not found');
    return result;
  }

  async restaurantViewOrders(
    restaurantId: RestaurantId,
    status?: OrderStatusType,
  ): Promise<RestaurantOrderSummaryDTO[]> {
    return await this.orderReader.findOrdersForRestaurant(restaurantId, status);
  }

  async restaurantViewOrderDetail(
    restaurantId: RestaurantId,
    orderId: OrderId,
  ): Promise<RestaurantOrderDetailDTO> {
    const result = await this.orderReader.findOrderDetailForRestaurant(
      restaurantId,
      orderId,
    );
    if (!result) throw new Error('Order detail not found');
    return result;
  }
}
