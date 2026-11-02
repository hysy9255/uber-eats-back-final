import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { AccountRegistrationRepository } from '../application/ports/account-registration.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from 'src/client/infrastructure/entities/client.orm-entity';
import { OwnerEntity } from 'src/owner/infrastructure/entities/owner.entity';
import { User } from 'src/user/domain/user';
import { Repository } from 'typeorm';
import { ClientId } from 'src/client/domain/vo/client-id';
import { Email } from 'src/user/domain/vo/email';
import { OwnerId } from 'src/owner/domain/owner-id';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRegistrationOrmRepository extends AccountRegistrationRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(ClientEntity)
    private readonly clientRepo: Repository<ClientEntity>,
    @InjectRepository(OwnerEntity)
    private readonly ownerRepo: Repository<OwnerEntity>,
  ) {
    super();
  }

  async saveClientUser(user: User): Promise<{ clientId: ClientId }> {
    const useEntity = new UserEntity(
      user.userId.value,
      user.email.value,
      user.password.value,
      user.role.value,
      user.name.value,
      user.phoneNumber.value,
      user.profileImage.value === null ? null : user.profileImage.value,
    );
    await this.userRepo.save(useEntity);
    const clientId = ClientId.generate();
    const clientEntity = new ClientEntity(clientId.value, user.userId.value);
    await this.clientRepo.save(clientEntity);
    return { clientId };
  }

  async saveOwnerUser(user: User): Promise<{ ownerId: OwnerId }> {
    const useEntity = new UserEntity(
      user.userId.value,
      user.email.value,
      user.password.value,
      user.role.value,
      user.name.value,
      user.phoneNumber.value,
      user.profileImage.value === null ? null : user.profileImage.value,
    );
    await this.userRepo.save(useEntity);
    const ownerId = OwnerId.generate();
    const ownerEntity = new OwnerEntity(ownerId.value, user.userId.value);
    await this.ownerRepo.save(ownerEntity);
    return { ownerId };
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.userRepo.count({ where: { email: email.value } });
    return count > 0;
  }
}
