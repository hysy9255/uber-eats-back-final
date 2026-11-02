import { ClientAddressBook } from 'src/client/domain/client-address-book';
import { ClientId } from 'src/client/domain/vo/client-id';

export abstract class ClientAddressBookRepository {
  abstract findClientAddressBook(
    clientId: ClientId,
  ): Promise<ClientAddressBook>;

  abstract save(
    clientId: ClientId,
    addressBook: ClientAddressBook,
  ): Promise<void>;
}
