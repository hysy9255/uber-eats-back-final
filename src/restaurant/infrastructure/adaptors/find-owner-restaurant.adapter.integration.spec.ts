import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { UserEntity } from 'src/user/infrastructure/orm-entities/user.entity';
import { OwnerEntity } from 'src/owner/infrastructure/entities/owner.entity';
import { UserRole } from 'src/auth/application/ports/find-user';
import { RestaurantAddressEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-address.orm.entity';
import { RestaurantHoursEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-hours.orm.entity';
import { RestaurantProfileEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-profile.orm-entity';
import { RestaurantGalleryEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-image.orm.entity';
import { RestaurantStatusType } from 'src/restaurant/domain/restaurant/vo/restaurant-status';
import { FindOwnerRestaurantAdapter } from './find-owner-restaurant.adaptor';

describe('FindRestaurantAdapter Integration Test', () => {
  let module: TestingModule;

  let findRestaurantAdapter: FindOwnerRestaurantAdapter;

  let userRepo: Repository<UserEntity>;
  let ownerRepo: Repository<OwnerEntity>;
  let restaurantRepo: Repository<RestaurantEntity>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            autoLoadEntities: true,
            synchronize: true,
            dropSchema: true,
          }),
        }),
        TypeOrmModule.forFeature([
          UserEntity,
          OwnerEntity,
          RestaurantEntity,
          RestaurantAddressEntity,
          RestaurantHoursEntity,
          RestaurantProfileEntity,
          RestaurantGalleryEntity,
        ]),
      ],
      providers: [FindOwnerRestaurantAdapter],
    }).compile();

    findRestaurantAdapter = module.get(FindOwnerRestaurantAdapter);

    userRepo = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );

    ownerRepo = module.get<Repository<OwnerEntity>>(
      getRepositoryToken(OwnerEntity),
    );

    restaurantRepo = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
  });

  beforeEach(async () => {
    await restaurantRepo.createQueryBuilder().delete().execute();
    await ownerRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('findByOwnerUserId', () => {
    it('owner의 userId로 restaurantId를 조회한다', async () => {
      // given
      const user = await userRepo.save({
        userId: 'user-1',
        email: 'owner@test.com',
        password: 'hashed-password',
        role: UserRole.Owner,
        name: 'Owner',
        phoneNumber: '01012345678',
        profileImgUrl: null,
      });

      const owner = await ownerRepo.save({
        ownerId: 'owner-1',
        userId: user.userId,
      });

      await restaurantRepo.save({
        restaurantId: 'restaurant-1',
        ownerId: owner.ownerId,
        status: RestaurantStatusType.Open,
        // RestaurantEntity의 필수 컬럼이 있으면 여기에 추가
        owner,
      });

      // when
      const result = await findRestaurantAdapter.findByOwnerUserId(user.userId);

      // then
      expect(result).toEqual({
        restaurantId: 'restaurant-1',
      });
    });

    it('연결된 restaurant가 없으면 null을 반환한다', async () => {
      // given
      const user = await userRepo.save({
        userId: 'user-1',
        email: 'owner@test.com',
        password: 'hashed-password',
        role: UserRole.Owner,
        name: 'Owner',
        phoneNumber: '01012345678',
        profileImgUrl: null,
      });

      await ownerRepo.save({
        ownerId: 'owner-1',
        userId: user.userId,
      });

      // when
      const result = await findRestaurantAdapter.findByOwnerUserId(user.userId);

      // then
      expect(result).toBeNull();
    });

    it('다른 owner의 restaurant은 조회하지 않는다', async () => {
      // given
      const userA = await userRepo.save({
        userId: 'user-a',
        email: 'a@test.com',
        password: 'hashed-password',
        role: UserRole.Owner,
        name: 'Owner A',
        phoneNumber: '01011111111',
        profileImgUrl: null,
      });

      const userB = await userRepo.save({
        userId: 'user-b',
        email: 'b@test.com',
        password: 'hashed-password',
        role: UserRole.Owner,
        name: 'Owner B',
        phoneNumber: '01022222222',
        profileImgUrl: null,
      });

      const ownerA = await ownerRepo.save({
        ownerId: 'owner-a',
        userId: userA.userId,
      });

      const ownerB = await ownerRepo.save({
        ownerId: 'owner-b',
        userId: userB.userId,
      });

      await restaurantRepo.save({
        restaurantId: 'restaurant-a',
        ownerId: ownerA.ownerId,
        status: RestaurantStatusType.Open,
        owner: ownerA,
      });

      await restaurantRepo.save({
        restaurantId: 'restaurant-b',
        ownerId: ownerB.ownerId,
        status: RestaurantStatusType.Open,
        owner: ownerB,
      });

      // when
      const result = await findRestaurantAdapter.findByOwnerUserId(
        userA.userId,
      );

      // then
      expect(result).toEqual({
        restaurantId: 'restaurant-a',
      });
    });
  });
});
