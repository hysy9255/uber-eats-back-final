import { DeliveryAddress } from '../delivery-address';
import { AddressAliasType } from '../vo/alias-info/address-alias';
import { DeliveryAddressId } from '../vo/delivery-address-id';
import { IsDefaultAddress } from '../vo/is-default-address';
import { AddressFactory } from '../../../shared/infrastructure/factories/address.factory';
import { AliasInfoFactory } from './alias-info.factory';

export class DeliveryAddressFactory {
  static create(
    id: DeliveryAddressId,
    streetAddress: string,
    city: string,
    state: string,
    zip: string,
    apt: string | null,
    alias: AddressAliasType,
    customAlias: string | null,
  ) {
    const address = AddressFactory.create(streetAddress, city, state, zip, apt);
    const aliasInfo = AliasInfoFactory.create(alias, customAlias);

    return DeliveryAddress.create(id, address, aliasInfo);
  }

  static restore(
    deliveryAddressId: string,
    streetAddress: string,
    city: string,
    state: string,
    zip: string,
    apt: string | null,
    alias: AddressAliasType,
    customAlias: string | null,
    isDefault: boolean,
  ) {
    const id = new DeliveryAddressId(deliveryAddressId);

    const address = AddressFactory.create(streetAddress, city, state, zip, apt);
    const aliasInfo = AliasInfoFactory.create(alias, customAlias);
    const isDefaultAddress = new IsDefaultAddress(isDefault);

    return DeliveryAddress.restore(id, address, aliasInfo, isDefaultAddress);
  }
}
