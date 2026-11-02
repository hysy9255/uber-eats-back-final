import { ClientAddressBook } from 'src/client/domain/client-address-book';
import { DeliveryAddressEntity } from '../entities/delivery-address.orm.entity';
import { DeliveryAddressFactory } from 'src/client/domain/factories/delivery-address.factory';
import { ClientId } from 'src/client/domain/vo/client-id';

export class DeliveryAddressOrmMapper {
  static toDomain(entities: DeliveryAddressEntity[]) {
    return new ClientAddressBook(
      entities.map((entity) =>
        DeliveryAddressFactory.restore(
          entity.id,
          entity.streetAddress,
          entity.city,
          entity.state,
          entity.zip,
          entity.apt,
          entity.alias,
          entity.customAlias,
          entity.isDefault,
        ),
      ),
    );
  }

  static toEntities(
    clientId: ClientId,
    addressBook: ClientAddressBook,
  ): DeliveryAddressEntity[] {
    return addressBook.addresses.map(
      (address) =>
        new DeliveryAddressEntity(
          address.id.value,
          clientId.value,
          address.address.streetAddress.value,
          address.isDefault.value,
          address.address.city.value,
          address.address.state.value,
          address.address.zip.value,
          address.address.apt ? address.address.apt.value : null,
          address.aliasInfo.alias.value,
          address.aliasInfo.customAlias.value,
        ),
    );
  }
}
