import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryAddress } from './delivery-address';
import { DeliveryAddressId } from './vo/delivery-address-id';
import { AliasInfo } from './vo/alias-info/alias-info';
import { Address } from 'src/shared/infrastructure/entities/address/address';
import { AddressAliasType } from './vo/alias-info/address-alias';

export class ClientAddressBook {
  private static readonly MAX_DELIVERY_ADDRESS_COUNT = 10;
  constructor(private _addresses: DeliveryAddress[]) {}

  get addresses() {
    return this._addresses;
  }

  addAddress(newAddress: DeliveryAddress) {
    this.validateNoDuplicates(newAddress.id);
    this.validateNoDuplicateAlias(newAddress.aliasInfo);
    this.validateAddAddressParameterRule(newAddress);
    // this.validateDefaultRule();
    this.validateMaxCountRule();

    if (this._addresses.length === 0) {
      newAddress.markAsDefault();
      this._addresses.push(newAddress);
      return;
    }

    this._addresses.push(newAddress);
  }

  updateAddress(
    addressId: DeliveryAddressId,
    address: Address,
    aliasInfo: AliasInfo,
  ) {
    this.validateNoDuplicateAlias(aliasInfo);
    const targetAddress = this.findById(addressId);
    targetAddress.updateAddress(address);
    targetAddress.updateAliasInfo(aliasInfo);
  }

  deleteAddress(addressId: DeliveryAddressId) {
    if (this._addresses.length <= 1)
      throw new ConflictException('At least one delivery address is required');

    const targetAddress = this.findById(addressId);
    this._addresses = this._addresses.filter(
      (address) => address !== targetAddress,
    );

    if (!targetAddress.isDefault.value) {
      return;
    }

    const nextDefaultAddress = this._addresses[0];
    nextDefaultAddress.markAsDefault();
  }

  setDefault(deliveryAddressId: DeliveryAddressId) {
    const newDefaultAddress = this.findById(deliveryAddressId);

    if (newDefaultAddress.isDefault.value) {
      return;
    }

    const defaultAddress = this.findDefault();
    defaultAddress.markAsNotDefault();
    newDefaultAddress.markAsDefault();
  }

  private findById(deliveryAddressId: DeliveryAddressId): DeliveryAddress {
    const address = this._addresses.find((address) =>
      address.id.equals(deliveryAddressId),
    );
    if (!address) throw new NotFoundException('Delivery address not found');
    return address;
  }

  private findDefault(): DeliveryAddress {
    const defaultAddress = this._addresses.find(
      (address) => address.isDefault.value === true,
    );
    if (!defaultAddress)
      throw new InternalServerErrorException(
        'Default address not found. Something went wrong in the server',
      );
    return defaultAddress;
  }

  private validateMaxCountRule() {
    if (
      this._addresses.length >= ClientAddressBook.MAX_DELIVERY_ADDRESS_COUNT
    ) {
      throw new ConflictException('Delivery address count cannot exceed 10');
    }
  }

  private validateAddAddressParameterRule(newAddress: DeliveryAddress) {
    if (newAddress.isDefault.value === true)
      throw new BadRequestException(
        'isDefault true should be defined within client address book',
      );
  }

  private validateNoDuplicates(deliveryAddressId: DeliveryAddressId) {
    const exists = this._addresses.some((address) =>
      address.id.equals(deliveryAddressId),
    );
    if (exists) {
      throw new ConflictException('Delivery address already exists');
    }
  }

  private validateNoDuplicateAlias(aliasInfo: AliasInfo) {
    const newAlias = aliasInfo.alias;

    if (newAlias.value === AddressAliasType.other) {
      return;
    }

    const exists = this._addresses.some((address) =>
      address.aliasInfo.alias.equals(newAlias),
    );

    if (exists) {
      throw new ConflictException('This address alias is already in use');
    }
  }
}
