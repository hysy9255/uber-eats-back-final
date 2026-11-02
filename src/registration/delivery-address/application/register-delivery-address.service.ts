import { Injectable } from '@nestjs/common';
import { ClientAddressBookRepository } from 'src/client/application/ports/client-address-book.repository';
import { DeliveryAddress } from 'src/client/domain/delivery-address';
import { ClientId } from 'src/client/domain/vo/client-id';

@Injectable()
export class RegisterDeliveryAddressService {
  constructor(
    private readonly clientAddressBookRepo: ClientAddressBookRepository,
  ) {}

  async registerDeliveryAddress(
    clientId: ClientId,
    deliveryAddress: DeliveryAddress,
  ): Promise<void> {
    const clientAddressBook =
      await this.clientAddressBookRepo.findClientAddressBook(clientId);
    clientAddressBook.addAddress(deliveryAddress);
    await this.clientAddressBookRepo.save(clientId, clientAddressBook);
  }
}
