import { UserRole } from 'src/auth/application/ports/find-user';
import { UserId } from 'src/user/domain/vo/user-id';
import { UserProfileDTO } from 'src/user/ui/dtos/user-profile.dto';

export abstract class UserReader {
  abstract findProfileById(userId: UserId): Promise<UserProfileDTO | null>;
  abstract findRoleByUserId(userId: UserId): Promise<{ role: UserRole } | null>;
}
