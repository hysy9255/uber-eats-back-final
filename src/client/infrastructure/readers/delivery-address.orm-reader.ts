import { DeliveryAddressReader } from 'src/client/application/ports/delivery-address.reader';
import { DeliveryAddressEntity } from '../entities/delivery-address.orm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryAddressDTO } from 'src/client/ui/dtos/delivery-address.dto';
import { ClientId } from 'src/client/domain/vo/client-id';
import { AddressAliasType } from 'src/client/domain/vo/alias-info/address-alias';

export class DeliveryAddressOrmReader implements DeliveryAddressReader {
  constructor(
    @InjectRepository(DeliveryAddressEntity)
    private readonly deliveryAddressRepo: Repository<DeliveryAddressEntity>,
  ) {}

  async findByClientId(clientId: ClientId): Promise<DeliveryAddressDTO[]> {
    const entities = await this.deliveryAddressRepo.find({
      where: { clientId: clientId.value },
    });

    return entities.map((entity) => {
      return new DeliveryAddressDTO(
        entity.id,
        entity.streetAddress,
        entity.city,
        entity.state,
        entity.zip,
        entity.apt,
        entity.isDefault,
        (entity.alias === AddressAliasType.other
          ? entity.customAlias
          : entity.alias) as string,
      );
    });
  }
}
