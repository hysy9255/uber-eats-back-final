import { ClientId } from 'src/client/domain/vo/client-id';
import { Address } from 'src/shared/infrastructure/entities/address/address';

export abstract class FindDefaultDeliveryAddress {
  abstract findClientDefaultAddress(
    clientId: ClientId,
  ): Promise<Address | null>;
}
