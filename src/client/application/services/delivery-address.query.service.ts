import { Injectable } from '@nestjs/common';
import { ClientId } from 'src/client/domain/vo/client-id';
import { DeliveryAddressDTO } from 'src/client/ui/dtos/delivery-address.dto';
import { DeliveryAddressReader } from '../ports/delivery-address.reader';

@Injectable()
export class DeliveryAddressQueryService {
  constructor(private readonly deliveryAddressReader: DeliveryAddressReader) {}

  async viewMyAddresses(clientId: ClientId): Promise<DeliveryAddressDTO[]> {
    return await this.deliveryAddressReader.findByClientId(clientId);
  }
}
