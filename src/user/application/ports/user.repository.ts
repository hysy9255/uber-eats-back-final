import { User } from 'src/user/domain/user';
import { Email } from 'src/user/domain/vo/email';

export abstract class UserRepository {
  // abstract save(user: User): Promise<void>;
  // abstract findById(userId: string): Promise<User>;
  abstract findByEmail(email: Email): Promise<boolean>;
}
