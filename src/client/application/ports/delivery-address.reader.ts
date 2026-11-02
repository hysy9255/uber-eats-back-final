import { ClientId } from 'src/client/domain/vo/client-id';
import { DeliveryAddressDTO } from 'src/client/ui/dtos/delivery-address.dto';

export abstract class DeliveryAddressReader {
  abstract findByClientId(clientId: ClientId): Promise<DeliveryAddressDTO[]>;
}
