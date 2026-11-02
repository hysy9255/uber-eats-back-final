import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderReader } from 'src/order/application/ports/order.reader';
import { OrderEntity } from '../entities/order.orm-entity';
import { In, Repository } from 'typeorm';
import { ClientId } from 'src/client/domain/vo/client-id';
import {
  ClientOrderSummaryDTO,
  OrderItemDTO,
} from 'src/order/ui/dtos/client-order-summary.dto';
import { OrderStatusType } from 'src/order/domain/order-progress';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import {
  OrderItemSummary,
  RestaurantOrderSummaryDTO,
} from 'src/order/ui/dtos/restaurant-order-summary.dto';
import { OrderId } from 'src/order/domain/vo/order-id';
import { ClientOrderDetailDTO } from 'src/order/ui/dtos/client-order-detail.dto';
import { RestaurantOrderDetailDTO } from 'src/order/ui/dtos/restaurant-order-detail.dto';

@Injectable()
export class OrderOrmReader implements OrderReader {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  async findOrderDetailForRestaurant(
    restaurantId: RestaurantId,
    orderId: OrderId,
  ): Promise<RestaurantOrderDetailDTO | null> {
    const entity = await this.orderRepo.findOne({
      where: {
        restaurantId: restaurantId.value,
        orderId: orderId.value,
      },
      relations: {
        client: {
          user: true,
        },
        request: true,
        deliveryAddressSnap: true,
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
            userId: true,
            name: true,
          },
        },
        request: {
          orderRequestId: true,
          requestToRestaurant: true,
        },
        deliveryAddressSnap: {
          deliveryAddressSnapId: true,
          addressSnap: true,
        },
        orderItems: {
          orderItemId: true,
          dishName: true,
          quantity: true,
          unitPrice: true,
        },
      },
    });

    if (!entity) return null;

    return new RestaurantOrderDetailDTO(
      entity.orderId,
      entity.status,
      entity.client.user.name,
      entity.orderedAt,
      entity.orderItems.map((item) => ({
        dishName: item.dishName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      entity.deliveryAddressSnap.addressSnap,
      entity.request === null ? null : entity.request.requestToRestaurant,
      entity.totalPrice,
    );
  }

  async findOrderDetailForClient(
    clientId: ClientId,
    orderId: OrderId,
  ): Promise<ClientOrderDetailDTO | null> {
    const entity = await this.orderRepo.findOne({
      where: {
        clientId: clientId.value,
        orderId: orderId.value,
      },
      relations: {
        restaurant: {
          profile: true,
          gallery: true,
        },
        deliveryAddressSnap: true,
        orderItems: true,
        request: true,
      },
      select: {
        orderId: true,
        totalPrice: true,
        status: true,
        deliveryAddressSnap: {
          addressSnap: true,
        },
        request: {
          requestToDriver: true,
          requestToRestaurant: true,
        },
        orderItems: {
          orderItemId: true,
          dishId: true,
          dishImgUrl: true,
          dishName: true,
          quantity: true,
          unitPrice: true,
        },
        restaurant: {
          restaurantId: true,
          profile: {
            restaurantId: true,
            name: true,
            cuisineType: true,
          },
          gallery: {
            restaurantId: true,
            logo: true,
          },
        },
      },
    });
    if (!entity) return null;
    return new ClientOrderDetailDTO(
      entity.orderId,
      entity.restaurant.profile.name,
      entity.restaurant.gallery.logo,
      entity.restaurant.profile.cuisineType,
      entity.status,
      entity.deliveryAddressSnap.addressSnap,
      entity.totalPrice,
      entity.request === null ? null : entity.request.requestToRestaurant,
      entity.request === null ? null : entity.request.requestToDriver,
      entity.orderItems.length,
      entity.orderItems.map(
        (item) =>
          new OrderItemDTO(
            item.dishId,
            item.dishImgUrl,
            item.dishName,
            item.quantity,
            item.unitPrice,
          ),
      ),
    );
  }

  async findOrdersForRestaurant(
    restaurantId: RestaurantId,
    status?: OrderStatusType,
  ): Promise<RestaurantOrderSummaryDTO[]> {
    const where = {
      restaurantId: restaurantId.value,
      ...(status !== undefined && { status }),
    };

    const entities = await this.orderRepo.find({
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

    return entities.map(
      (entity) =>
        new RestaurantOrderSummaryDTO(
          entity.orderId,
          entity.status,
          entity.client.user.name,
          entity.orderedAt,
          entity.totalPrice,
          entity.orderItems.map(
            (item) => new OrderItemSummary(item.dishName, item.quantity),
          ),
        ),
    );
  }

  async findOnGoingOrdersForClient(
    clientId: ClientId,
  ): Promise<ClientOrderSummaryDTO[]> {
    return await this.findOrdersForClient(clientId, [
      OrderStatusType.Pending,
      OrderStatusType.Cooking,
      OrderStatusType.Ready,
      OrderStatusType.Delivering,
    ]);
  }

  async findCompletedOrdersForClient(
    clientId: ClientId,
  ): Promise<ClientOrderSummaryDTO[]> {
    return await this.findOrdersForClient(clientId, [
      OrderStatusType.Delivered,
    ]);
  }

  private async findOrdersForClient(
    clientId: ClientId,
    statuses: OrderStatusType[],
  ): Promise<ClientOrderSummaryDTO[]> {
    const entities = await this.orderRepo.find({
      where: {
        clientId: clientId.value,
        status: In(statuses),
      },
      relations: {
        deliveryAddressSnap: true,
        restaurant: {
          profile: true,
          gallery: true,
        },
        orderItems: true,
      },
      select: {
        orderId: true,
        status: true,
        orderedAt: true,
        deliveredAt: true,
        totalPrice: true,
        deliveryAddressSnap: {
          addressSnap: true,
        },
        orderItems: {
          orderId: true,
          orderItemId: true,
          dishId: true,
          dishImgUrl: true,
          dishName: true,
          quantity: true,
          unitPrice: true,
        },

        restaurant: {
          restaurantId: true,
          profile: {
            restaurantId: true,
            name: true,
          },
          gallery: {
            restaurantId: true,
            logo: true,
          },
        },
      },
    });

    return entities.map((entity) => this.toClientOrderSummaryDTO(entity));
  }

  private toClientOrderSummaryDTO(entity: OrderEntity): ClientOrderSummaryDTO {
    return new ClientOrderSummaryDTO(
      entity.orderId,
      entity.restaurant.profile.name,
      entity.restaurant.gallery.logo,
      entity.status,
      entity.deliveryAddressSnap.addressSnap,
      entity.totalPrice,
      entity.orderedAt,
      entity.deliveredAt,
      entity.orderItems.map((orderItem) => {
        return new OrderItemDTO(
          orderItem.dishId,
          orderItem.dishImgUrl,
          orderItem.dishName,
          orderItem.quantity,
          orderItem.unitPrice,
        );
      }),
    );
  }
}
