import { InjectRepository } from '@nestjs/typeorm';
import { ClientAddressBookRepository } from 'src/client/application/ports/client-address-book.repository';
import { DeliveryAddressEntity } from '../entities/delivery-address.orm.entity';
import { In, Repository } from 'typeorm';
import { ClientId } from 'src/client/domain/vo/client-id';
import { DeliveryAddressOrmMapper } from '../mappers/delivery-address.orm-mapper';
import { Injectable } from '@nestjs/common';
import { ClientAddressBook } from 'src/client/domain/client-address-book';

@Injectable()
export class ClientAddressBookOrmRepository implements ClientAddressBookRepository {
  constructor(
    @InjectRepository(DeliveryAddressEntity)
    private readonly deliveryAddressRepo: Repository<DeliveryAddressEntity>,
  ) {}

  async findClientAddressBook(clientId: ClientId): Promise<ClientAddressBook> {
    const entities = await this.deliveryAddressRepo.find({
      where: { clientId: clientId.value },
    });
    return DeliveryAddressOrmMapper.toDomain(entities);
  }

  async save(
    clientId: ClientId,
    addressBook: ClientAddressBook,
  ): Promise<void> {
    await this.deliveryAddressRepo.manager.transaction(async (manager) => {
      const repo = manager.getRepository(DeliveryAddressEntity);

      // DB에 현재 있는 주소 ID들
      const persistedAddresses = await repo.find({
        where: { clientId: clientId.value },
        select: {
          id: true,
        },
      });

      // aggregate에 현재 남아 있는 주소 ID들
      const currentAddressIds = new Set(
        addressBook.addresses.map((address) => address.id.value),
      );

      // DB에는 있지만 aggregate에서는 사라진 주소들
      const addressIdsToDelete = persistedAddresses
        .filter(
          (persistedAddress) => !currentAddressIds.has(persistedAddress.id),
        )
        .map((persistedAddress) => persistedAddress.id);

      if (addressIdsToDelete.length > 0) {
        await repo.delete({
          clientId: clientId.value,
          id: In(addressIdsToDelete),
        });
      }

      // aggregate에 남아 있는 주소들:
      // 새 주소는 INSERT, 같은 PK가 있으면 UPDATE
      const entities = DeliveryAddressOrmMapper.toEntities(
        clientId,
        addressBook,
      );

      await repo.save(entities);
    });
  }
}
