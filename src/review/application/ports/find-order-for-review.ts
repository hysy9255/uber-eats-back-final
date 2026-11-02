import { ClientId } from 'src/client/domain/vo/client-id';
import { OrderId } from 'src/order/domain/vo/order-id';
import { OrderForReview } from 'src/review/domain/order-for-review';

export abstract class FindOrderForReview {
  abstract findByIdAndClientId(
    orderId: OrderId,
    clientId: ClientId,
  ): Promise<OrderForReview | null>;
}
