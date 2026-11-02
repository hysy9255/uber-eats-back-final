import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ClientId } from 'src/client/domain/vo/client-id';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { ClientContextInterceptor } from 'src/client/ui/interceptors/client-context.interceptor';
import { CurrentClientId } from 'src/client/ui/decorators/current-client-id.decorator';
import { ClientOrderSummaryDTO } from './dtos/client-order-summary.dto';
import { OrderQueryService } from '../application/order.query.service';
import { OwnerContextInterceptor } from 'src/owner/ui/interceptors/owner-context.interceptor';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import {
  ClientOrderDetailQueryDTO,
  ClientOrderQueryDTO,
} from './dtos/client-order.query.dto';
import {
  RestaurantOrderDetailQueryDTO,
  RestaurantOrderQueryDTO,
} from './dtos/restaurant-order.query.dto';
import { CurrentRestaurantId } from 'src/restaurant/ui/decorators/current-restaurant-id.decorator';
import { RestaurantOrderSummaryDTO } from './dtos/restaurant-order-summary.dto';
import { ClientOrderDetailDTO } from './dtos/client-order-detail.dto';
import { OrderId } from '../domain/vo/order-id';
import { RestaurantOrderDetailDTO } from './dtos/restaurant-order-detail.dto';

@Controller()
export class OrderQueryController {
  constructor(private readonly orderQueryService: OrderQueryService) {}

  @Get('client/orders')
  @Roles(UserRole.Client)
  @UseInterceptors(ClientContextInterceptor)
  async clientViewOrderSummaries(
    @Query() query: ClientOrderQueryDTO,
    @CurrentClientId() clientId: ClientId,
  ): Promise<ClientOrderSummaryDTO[]> {
    return await this.orderQueryService.clientViewOrderSummariess(
      clientId,
      query.type,
    );
  }

  @Get('client/orders/detail')
  @Roles(UserRole.Client)
  @UseInterceptors(ClientContextInterceptor)
  async clientViewOrderDetail(
    @Query() query: ClientOrderDetailQueryDTO,
    @CurrentClientId() clientId: ClientId,
  ): Promise<ClientOrderDetailDTO> {
    return await this.orderQueryService.clientViewOrderDetail(
      clientId,
      new OrderId(query.orderId),
    );
  }

  @Get('restaurant/orders')
  @Roles(UserRole.Owner)
  @UseInterceptors(OwnerContextInterceptor)
  async restaurantViewOrders(
    @CurrentRestaurantId() restaurantId: RestaurantId,
    @Query() query: RestaurantOrderQueryDTO,
  ): Promise<RestaurantOrderSummaryDTO[]> {
    return await this.orderQueryService.restaurantViewOrders(
      restaurantId,
      query.status,
    );
  }

  @Get('restaurant/orders/detail')
  @Roles(UserRole.Owner)
  @UseInterceptors(OwnerContextInterceptor)
  async restaurantViewOrderDetail(
    @CurrentRestaurantId() restaurantId: RestaurantId,
    @Query() query: RestaurantOrderDetailQueryDTO,
  ): Promise<RestaurantOrderDetailDTO> {
    return await this.orderQueryService.restaurantViewOrderDetail(
      restaurantId,
      new OrderId(query.orderId),
    );
  }
}
