import { DataSource } from 'typeorm';
import { OwnerEntity } from 'src/owner/infrastructure/entities/owner.entity';
import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { UserRole } from 'src/auth/application/ports/find-user';
import { RestaurantStatusType } from 'src/restaurant/domain/restaurant/vo/restaurant-status';

type CreateRestaurantFixtureProps = {
  userId?: string;
  ownerId?: string;
  restaurantId?: string;
  status?: RestaurantStatusType;
};

export async function createRestaurantFixture(
  dataSource: DataSource,
  props: CreateRestaurantFixtureProps = {},
) {
  const userId = props.userId ?? 'test-user-1';
  const ownerId = props.ownerId ?? 'test-owner-1';
  const restaurantId = props.restaurantId ?? 'restaurant-1';

  const userRepo = dataSource.getRepository(UserEntity);
  const ownerRepo = dataSource.getRepository(OwnerEntity);
  const restaurantRepo = dataSource.getRepository(RestaurantEntity);

  await userRepo.save({
    userId,
    email: `${userId}@test.com`,
    password: 'hashed-password',
    role: UserRole.Owner,
    name: 'Test User',
    phoneNumber: '123-456-7890',
  });

  await ownerRepo.save({
    ownerId,
    userId,
    // OwnerEntity의 필수 컬럼만 추가
  });

  await restaurantRepo.save({
    restaurantId,
    ownerId,
    status: props.status ?? RestaurantStatusType.Open,
    // RestaurantEntity의 필수 컬럼만 추가
  });

  return {
    userId,
    ownerId,
    restaurantId,
  };
}
