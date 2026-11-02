import { CartDTO } from 'src/cart/ui/dtos/query/cart.dto';
import { ClientId } from 'src/client/domain/vo/client-id';

export abstract class CartReader {
  abstract findByClientId(clientId: ClientId): Promise<CartDTO>;
}
