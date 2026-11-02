import { OrderProgress, OrderStatus, OrderStatusType } from './order-progress';
import { OrderId } from './vo/order-id';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';

describe('OrderProgress', () => {
  const orderId = new OrderId('order-1');
  const restaurantId = new RestaurantId('restaurant-1');

  const createOrderProgress = (
    status: OrderStatusType,
    deliveredAt: Date | null = null,
  ) =>
    new OrderProgress(
      orderId,
      restaurantId,
      new OrderStatus(status),
      deliveredAt,
    );

  describe('markAsAccepted', () => {
    it('Pending 주문을 Cooking 상태로 변경한다', () => {
      const orderProgress = createOrderProgress(OrderStatusType.Pending);

      orderProgress.markAsAccepted();

      expect(orderProgress.orderStatus.value).toBe(OrderStatusType.Cooking);
      expect(orderProgress.deliveredAt).toBeNull();
    });

    it('Pending 상태가 아니면 예외를 던진다', () => {
      const orderProgress = createOrderProgress(OrderStatusType.Ready);

      expect(() => orderProgress.markAsAccepted()).toThrow(
        'Order is not in pending status',
      );
    });
  });

  describe('markAsReady', () => {
    it('Cooking 주문을 Ready 상태로 변경한다', () => {
      const orderProgress = createOrderProgress(OrderStatusType.Cooking);

      orderProgress.markAsReady();

      expect(orderProgress.orderStatus.value).toBe(OrderStatusType.Ready);
      expect(orderProgress.deliveredAt).toBeNull();
    });

    it('Cooking 상태가 아니면 예외를 던진다', () => {
      const orderProgress = createOrderProgress(OrderStatusType.Pending);

      expect(() => orderProgress.markAsReady()).toThrow(
        'Order is not in cooking status',
      );
    });
  });

  describe('markAsDeliverying', () => {
    it('Ready 주문을 Delivering 상태로 변경한다', () => {
      const orderProgress = createOrderProgress(OrderStatusType.Ready);

      orderProgress.markAsDeliverying();

      expect(orderProgress.orderStatus.value).toBe(OrderStatusType.Delivering);
      expect(orderProgress.deliveredAt).toBeNull();
    });

    it('Ready 상태가 아니면 예외를 던진다', () => {
      const orderProgress = createOrderProgress(OrderStatusType.Cooking);

      expect(() => orderProgress.markAsDeliverying()).toThrow(
        'Order is not in ready status',
      );
    });
  });

  describe('markAsDelivered', () => {
    it('Delivering 주문을 Delivered 상태로 변경하고 deliveredAt을 기록한다', () => {
      jest.useFakeTimers();

      const now = new Date('2026-07-24T05:01:23.729Z');
      jest.setSystemTime(now);

      const orderProgress = createOrderProgress(OrderStatusType.Delivering);

      orderProgress.markAsDelivered();

      expect(orderProgress.orderStatus.value).toBe(OrderStatusType.Delivered);
      expect(orderProgress.deliveredAt).toEqual(now);

      jest.useRealTimers();
    });

    it('Delivering 상태가 아니면 예외를 던지고 deliveredAt을 변경하지 않는다', () => {
      const orderProgress = createOrderProgress(OrderStatusType.Ready);

      expect(() => orderProgress.markAsDelivered()).toThrow(
        'Order is not in delivering status',
      );

      expect(orderProgress.orderStatus.value).toBe(OrderStatusType.Ready);
      expect(orderProgress.deliveredAt).toBeNull();
    });
  });

  describe('전체 주문 상태 흐름', () => {
    it('Pending → Cooking → Ready → Delivering → Delivered 순서로 진행되고 완료 시간을 기록한다', () => {
      jest.useFakeTimers();

      const now = new Date('2026-07-24T05:01:23.729Z');
      jest.setSystemTime(now);

      const orderProgress = createOrderProgress(OrderStatusType.Pending);

      orderProgress.markAsAccepted();
      orderProgress.markAsReady();
      orderProgress.markAsDeliverying();
      orderProgress.markAsDelivered();

      expect(orderProgress.orderStatus.value).toBe(OrderStatusType.Delivered);
      expect(orderProgress.deliveredAt).toEqual(now);

      jest.useRealTimers();
    });
  });
});
