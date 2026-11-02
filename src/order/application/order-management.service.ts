import { ConflictException, Injectable } from '@nestjs/common';
import { OrderProgress } from '../domain/order-progress';
import { OrderProgressRepository } from './ports/order-progress.repository';
import { OrderId } from '../domain/vo/order-id';
import { OrderGateway } from '../ui/order.gateway';

@Injectable()
export class OrderManagementService {
  constructor(
    private readonly orderProgressRepository: OrderProgressRepository,
    private readonly orderGateway: OrderGateway,
  ) {}

  async acceptOrder(orderId: OrderId) {
    const orderProgress = await this.findOrderProgress(orderId);
    orderProgress.markAsAccepted();
    await this.orderProgressRepository.saveUpdate(orderProgress);
    this.orderGateway.emitOrderStatusChanged(orderId.value, {
      orderId: orderId.value,
      status: orderProgress.orderStatus.value,
    });
  }

  async markOrderReady(orderId: OrderId) {
    const orderProgress = await this.findOrderProgress(orderId);
    orderProgress.markAsReady();
    await this.orderProgressRepository.saveUpdate(orderProgress);
    this.orderGateway.emitOrderStatusChanged(orderId.value, {
      orderId: orderId.value,
      status: orderProgress.orderStatus.value,
    });
  }

  async markOrderDeliverying(orderId: OrderId) {
    const orderProgress = await this.findOrderProgress(orderId);
    orderProgress.markAsDeliverying();
    await this.orderProgressRepository.saveUpdate(orderProgress);
    this.orderGateway.emitOrderStatusChanged(orderId.value, {
      orderId: orderId.value,
      status: orderProgress.orderStatus.value,
    });
  }

  async markOrderDelivered(orderId: OrderId) {
    const orderProgress = await this.findOrderProgress(orderId);
    orderProgress.markAsDelivered();
    await this.orderProgressRepository.saveUpdate(orderProgress);
    this.orderGateway.emitOrderStatusChanged(orderId.value, {
      orderId: orderId.value,
      status: orderProgress.orderStatus.value,
    });
  }

  private async findOrderProgress(orderId: OrderId): Promise<OrderProgress> {
    const orderProgress =
      await this.orderProgressRepository.findByOrderId(orderId);
    if (!orderProgress) {
      throw new ConflictException('Order not found');
    }
    return orderProgress;
  }
}
