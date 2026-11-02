import { Cart } from 'src/cart/domain/cart';
import { ClientId } from 'src/client/domain/vo/client-id';

export abstract class CartRepository {
  abstract findByClientId(clientId: ClientId): Promise<Cart | null>;
  abstract saveUpdate(cart: Cart): Promise<void>;
}
