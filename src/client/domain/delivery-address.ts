import { Address } from 'src/shared/infrastructure/entities/address/address';
import { AliasInfo } from './vo/alias-info/alias-info';
import { DeliveryAddressId } from './vo/delivery-address-id';
import { IsDefaultAddress } from './vo/is-default-address';

export class DeliveryAddress {
  private constructor(
    readonly id: DeliveryAddressId,
    private _address: Address,
    private _aliasInfo: AliasInfo,
    private _isDefault: IsDefaultAddress,
  ) {}

  static restore(
    id: DeliveryAddressId,
    address: Address,
    aliasInfo: AliasInfo,
    isDefault: IsDefaultAddress,
  ) {
    return new DeliveryAddress(id, address, aliasInfo, isDefault);
  }

  static create(id: DeliveryAddressId, address: Address, aliasInfo: AliasInfo) {
    return new DeliveryAddress(
      id,
      address,
      aliasInfo,
      new IsDefaultAddress(false),
    );
  }

  get isDefault() {
    return this._isDefault;
  }

  get address() {
    return this._address;
  }

  get aliasInfo() {
    return this._aliasInfo;
  }

  updateAddress(address: Address) {
    this._address = address;
  }

  updateAliasInfo(aliasInfo: AliasInfo) {
    this._aliasInfo = aliasInfo;
  }

  markAsDefault() {
    this._isDefault = new IsDefaultAddress(true);
  }

  markAsNotDefault() {
    this._isDefault = new IsDefaultAddress(false);
  }
}
