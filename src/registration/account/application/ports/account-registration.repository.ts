import { ClientId } from 'src/client/domain/vo/client-id';
import { OwnerId } from 'src/owner/domain/owner-id';
import { User } from 'src/user/domain/user';
import { Email } from 'src/user/domain/vo/email';

export abstract class AccountRegistrationRepository {
  abstract saveClientUser(user: User): Promise<{ clientId: ClientId }>;
  abstract saveOwnerUser(user: User): Promise<{ ownerId: OwnerId }>;
  abstract existsByEmail(email: Email): Promise<boolean>;
}
