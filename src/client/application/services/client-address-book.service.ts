import { Injectable } from '@nestjs/common';
import { DeliveryAddressId } from '../../domain/vo/delivery-address-id';
import { AliasInfo } from '../../domain/vo/alias-info/alias-info';
import { ClientId } from '../../domain/vo/client-id';
import { ClientAddressBookRepository } from '../ports/client-address-book.repository';
import { DeliveryAddress } from 'src/client/domain/delivery-address';
import { Address } from 'src/shared/infrastructure/entities/address/address';

@Injectable()
export class ClientAddressBookService {
  constructor(private readonly repo: ClientAddressBookRepository) {}

  async addNewAddress(clientId: ClientId, newAddress: DeliveryAddress) {
    const addressBook = await this.repo.findClientAddressBook(clientId);
    addressBook.addAddress(newAddress);
    await this.repo.save(clientId, addressBook);
  }

  async updateAddress(
    clientId: ClientId,
    addressId: DeliveryAddressId,
    newAddress: Address,
    newAliasInfo: AliasInfo,
  ) {
    const addressBook = await this.repo.findClientAddressBook(clientId);
    addressBook.updateAddress(addressId, newAddress, newAliasInfo);
    await this.repo.save(clientId, addressBook);
  }

  async markAddressDefault(clientId: ClientId, addressId: DeliveryAddressId) {
    const addressBook = await this.repo.findClientAddressBook(clientId);
    addressBook.setDefault(addressId);
    await this.repo.save(clientId, addressBook);
  }

  async deleteAddress(clientId: ClientId, addressId: DeliveryAddressId) {
    const addressBook = await this.repo.findClientAddressBook(clientId);
    addressBook.deleteAddress(addressId);
    await this.repo.save(clientId, addressBook);
  }
}
