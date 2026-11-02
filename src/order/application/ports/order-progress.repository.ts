import { OrderProgress } from 'src/order/domain/order-progress';
import { OrderId } from 'src/order/domain/vo/order-id';

export abstract class OrderProgressRepository {
  abstract findByOrderId(orderId: OrderId): Promise<OrderProgress | null>;
  abstract saveUpdate(orderProgress: OrderProgress): Promise<void>;
}
