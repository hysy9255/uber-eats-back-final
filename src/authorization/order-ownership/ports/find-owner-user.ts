import { UserId } from 'src/user/domain/vo/user-id';
import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';

export abstract class FindOwnerUser {
  abstract findOwnerUserWithRestaurant(
    userId: UserId,
  ): Promise<UserEntity | null>;
}
