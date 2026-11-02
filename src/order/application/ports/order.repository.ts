import { Order } from 'src/order/domain/order';

export abstract class OrderRepository {
  abstract save(order: Order): Promise<void>;
}
