import { InjectRepository } from '@nestjs/typeorm';
import { FindDefaultDeliveryAddress } from 'src/order/application/ports/find-delivery-address';
import { DeliveryAddressEntity } from '../entities/delivery-address.orm.entity';
import { Repository } from 'typeorm';
import { ClientId } from 'src/client/domain/vo/client-id';
import { Address } from 'src/shared/infrastructure/entities/address/address';
import { StreetAddress } from 'src/shared/infrastructure/entities/address/vo/street-address';
import { City } from 'src/shared/infrastructure/entities/address/vo/city';
import { State } from 'src/shared/infrastructure/entities/address/vo/state';
import { Zip } from 'src/shared/infrastructure/entities/address/vo/zip';
import { Apt } from 'src/shared/infrastructure/entities/address/vo/apt';

export class FindDefaultDeliveryAddressAdaptor implements FindDefaultDeliveryAddress {
  constructor(
    @InjectRepository(DeliveryAddressEntity)
    private readonly deliveryAddressRepo: Repository<DeliveryAddressEntity>,
  ) {}

  async findClientDefaultAddress(clientId: ClientId): Promise<Address | null> {
    const entity = await this.deliveryAddressRepo.findOne({
      where: { clientId: clientId.value, isDefault: true },
    });

    if (!entity) {
      return null;
    }

    return new Address(
      new StreetAddress(entity.streetAddress),
      new City(entity.city),
      new State(entity.state),
      new Zip(entity.zip),
      entity.apt ? new Apt(entity.apt) : null,
    );
  }
}
