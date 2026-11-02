import { InjectRepository } from '@nestjs/typeorm';
import { ClientRepository } from 'src/client/application/ports/client.repository';
import { ClientEntity } from '../entities/client.orm-entity';
import { Repository } from 'typeorm';
import { UserId } from 'src/user/domain/vo/user-id';
import { ClientId } from 'src/client/domain/vo/client-id';

export class ClientOrmRepository extends ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepo: Repository<ClientEntity>,
  ) {
    super();
  }
  async findByUserId(userId: UserId): Promise<{ clientId: ClientId } | null> {
    const result = await this.clientRepo.findOne({
      where: { userId: userId.value },
      select: { clientId: true },
    });
    if (!result) {
      return null;
    } else {
      return { clientId: new ClientId(result.clientId) };
    }
  }
}
