import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from 'src/order/application/ports/order.repository';
import { OrderEntity } from '../entities/order.orm-entity';
import { Repository } from 'typeorm';
import { DeliveryAddressSnapEntity } from '../entities/delivery-address-snap.orm-entity';
import { OrderItemsEntity } from '../entities/order-items.orm-entity';
import { Order } from 'src/order/domain/order';
import { OrderRequestEntity } from '../entities/order-request.orm-entity';

export class OrderOrmRepository extends OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(DeliveryAddressSnapEntity)
    private readonly deliveryAddressSnapRepo: Repository<DeliveryAddressSnapEntity>,
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemsRepo: Repository<OrderItemsEntity>,
    @InjectRepository(OrderRequestEntity)
    private readonly orderRequestRepo: Repository<OrderRequestEntity>,
  ) {
    super();
  }

  async save(order: Order): Promise<void> {
    const orderEntity = new OrderEntity(
      order.orderId.value,
      order.clientId.value,
      order.restaurantId.value,
      order.totalPrice.value,
    );
    await this.orderRepo.save(orderEntity);
    if (order.request.toDriver || order.request.toRestaurant) {
      const orderRequestEntity = new OrderRequestEntity(
        order.orderId.value,
        order.request.toRestaurant,
        order.request.toDriver,
      );
      await this.orderRequestRepo.save(orderRequestEntity);
    }

    const deliveryAddressSnapValue = order.deliveryAddress.apt?.value
      ? `${order.deliveryAddress.streetAddress.value} ${order.deliveryAddress.city.value} ${order.deliveryAddress.state.value} ${order.deliveryAddress.apt?.value} ${order.deliveryAddress.zip.value}`
      : `${order.deliveryAddress.streetAddress.value} ${order.deliveryAddress.city.value} ${order.deliveryAddress.state.value} ${order.deliveryAddress.zip.value}`;

    const deliveryAddressSnapEntity = new DeliveryAddressSnapEntity(
      order.orderId.value,
      deliveryAddressSnapValue,
    );
    await this.deliveryAddressSnapRepo.save(deliveryAddressSnapEntity);

    const orderItemEntities = order.orderItems.map(
      (orderItem) =>
        new OrderItemsEntity(
          order.orderId.value,
          orderItem.dishId.value,
          orderItem.dishName.value,
          orderItem.quantity.value,
          orderItem.unitPrice.value,
          orderItem.lineTotalPrice.value,
          orderItem.dishImgUrl?.value || null,
        ),
    );

    await this.orderItemsRepo.save(orderItemEntities);
  }
}
