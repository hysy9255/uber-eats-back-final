import { NotFoundException } from '@nestjs/common';
import { Order } from './order';
import { OrderId } from './vo/order-id';
import { OrderRequest } from './vo/order-request';
import { OrderItem } from './order-item';
import { OrderItemId } from './vo/order-item-id';
import { Quantity } from './vo/quantity';

import { ClientId } from 'src/client/domain/vo/client-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

import { Dish } from 'src/menu/domain/entities/dish';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishDescription } from 'src/menu/domain/value-objects/dish-description';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';
import { AddressFactory } from 'src/shared/infrastructure/factories/address.factory';

describe('Order', () => {
  const clientId = new ClientId('client-1');
  const restaurantId = new RestaurantId('restaurant-1');

  const createDish = (
    id: string,
    name: string,
    price: number,
    imageUrl = 'https://example.com/dish.png',
  ) =>
    new Dish(
      new DishId(id),
      new DishName(name),
      new Price(price),
      new DishDescription('description'),
      new DishImageUrl(imageUrl),
    );

  const createOrderItem = (dishId: string, quantity: number) =>
    new OrderItem(
      new OrderItemId(`order-item-${dishId}`),
      new DishId(dishId),
      new Quantity(quantity),
    );

  const createOrder = (items: OrderItem[]) =>
    new Order(
      new OrderId('order-1'),
      clientId,
      restaurantId,
      new OrderRequest(null, 'leave at the door'),
      items,
    );

  describe('captureOrderItemSnapShots', () => {
    it('각 주문 아이템에 메뉴 이름, 가격, 이미지를 snapshot으로 저장한다', () => {
      const pizza = createDish(
        'dish-1',
        'Pizza',
        12.5,
        'https://example.com/pizza.png',
      );

      const orderItem = createOrderItem('dish-1', 2);
      const order = createOrder([orderItem]);

      order.captureOrderItemSnapShots([pizza]);

      expect(order.orderItems[0].dishName.value).toBe('pizza');
      expect(order.orderItems[0].unitPrice.value).toBe(12.5);
      expect(order.orderItems[0].dishImgUrl.value).toBe(
        'https://example.com/pizza.png',
      );
      expect(order.orderItems[0].lineTotalPrice.value).toBe(25);
    });

    it('모든 item snapshot을 기반으로 주문 총액을 계산한다', () => {
      const pizza = createDish('dish-1', 'Pizza', 12.5);
      const pasta = createDish('dish-2', 'Pasta', 15);

      const order = createOrder([
        createOrderItem('dish-1', 2),
        createOrderItem('dish-2', 3),
      ]);

      order.captureOrderItemSnapShots([pizza, pasta]);

      // 12.5 * 2 + 15 * 3 = 70
      expect(order.totalPrice).toBe('70.00');
    });

    it('주문 item에 해당하는 Dish가 없으면 NotFoundException을 던진다', () => {
      const order = createOrder([createOrderItem('not-found-dish', 1)]);

      expect(() =>
        order.captureOrderItemSnapShots([createDish('dish-1', 'Pizza', 12.5)]),
      ).toThrow(NotFoundException);

      expect(() =>
        order.captureOrderItemSnapShots([createDish('dish-1', 'Pizza', 12.5)]),
      ).toThrow('Dish with id not-found-dish not found');
    });

    it('여러 item 중 하나라도 Dish가 없으면 예외를 던진다', () => {
      const order = createOrder([
        createOrderItem('dish-1', 1),
        createOrderItem('dish-2', 1),
      ]);

      expect(() =>
        order.captureOrderItemSnapShots([createDish('dish-1', 'Pizza', 12.5)]),
      ).toThrow('Dish with id dish-2 not found');
    });
  });

  describe('assignDeliveryAddress', () => {
    it('배송지 snapshot을 주문에 할당한다', () => {
      const order = createOrder([createOrderItem('dish-1', 1)]);

      const address = AddressFactory.create(
        'Main Street 10',
        'Seoul',
        'Seoul',
        '12345',
        '101',
      );

      order.assignDeliveryAddress(address);

      expect(order.deliveryAddress.streetAddress.value).toBe('main street 10');
      expect(order.deliveryAddress.city.value).toBe('seoul');
      expect(order.deliveryAddress.apt?.value).toBe('101');
    });
  });

  describe('createdAt', () => {
    it('주문 생성 시 생성 시간을 기록한다', () => {
      const before = new Date();

      const order = createOrder([createOrderItem('dish-1', 1)]);

      const after = new Date();

      expect(order.createdAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(order.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
