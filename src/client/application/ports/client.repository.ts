import { ClientId } from 'src/client/domain/vo/client-id';
import { UserId } from 'src/user/domain/vo/user-id';

export abstract class ClientRepository {
  abstract findByUserId(userId: UserId): Promise<{ clientId: ClientId } | null>;
}
