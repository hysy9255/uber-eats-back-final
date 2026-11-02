import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrderPlacementService } from '../application/order-placement.service';
import { ClientId } from 'src/client/domain/vo/client-id';
import { OrderId } from '../domain/vo/order-id';
import { PlaceOrderDTO } from './dtos/place-order.dto';
import { OrderManagementService } from '../application/order-management.service';
import { ClientContextInterceptor } from 'src/client/ui/interceptors/client-context.interceptor';
import { CurrentClientId } from 'src/client/ui/decorators/current-client-id.decorator';
import { Roles } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';
import { OrderOwnershipGuard } from 'src/authorization/order-ownership/order-ownership.guard';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderPlacementService: OrderPlacementService,
    private readonly orderManagementService: OrderManagementService,
  ) {}

  @Post()
  @Roles(UserRole.Client)
  @UseInterceptors(ClientContextInterceptor)
  async placeOrder(
    @CurrentClientId() clientId: ClientId,
    @Body() dto: PlaceOrderDTO,
  ) {
    await this.orderPlacementService.placeOrder(clientId, dto.request);
  }

  @Patch(':orderId/accept')
  @Roles(UserRole.Owner)
  @UseGuards(OrderOwnershipGuard)
  async acceptOrder(@Param('orderId') orderId: string) {
    await this.orderManagementService.acceptOrder(new OrderId(orderId));
  }

  @Patch(':orderId/ready')
  @Roles(UserRole.Owner)
  @UseGuards(OrderOwnershipGuard)
  async markReady(@Param('orderId') orderId: string) {
    await this.orderManagementService.markOrderReady(new OrderId(orderId));
  }

  @Patch(':orderId/deliverying')
  @Roles(UserRole.Owner)
  @UseGuards(OrderOwnershipGuard)
  async markDeliverying(@Param('orderId') orderId: string) {
    await this.orderManagementService.markOrderDeliverying(
      new OrderId(orderId),
    );
  }

  @Patch(':orderId/delivered')
  @Roles(UserRole.Owner)
  @UseGuards(OrderOwnershipGuard)
  async markDelivered(@Param('orderId') orderId: string) {
    await this.orderManagementService.markOrderDelivered(new OrderId(orderId));
  }
}
