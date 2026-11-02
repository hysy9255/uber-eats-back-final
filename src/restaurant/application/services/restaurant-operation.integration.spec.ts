import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { RestaurantOperation } from './restaurant-operation';
import { RestaurantId } from '../../domain/restaurant/vo/restaurant-id';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { RestaurantStatusType } from 'src/restaurant/domain/restaurant/vo/restaurant-status';

import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { MenuModule } from 'src/menu/menu.module';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantOwnershipModule } from 'src/authorization/restaurant-ownership/restaurant-ownership.module';
import { ClientModule } from 'src/client/client.module';
import { OwnerModule } from 'src/owner/owner.module';
import { UserModule } from 'src/user/user.module';

import { createRestaurantFixture } from './test/fixtures/restaurant.fixture';

describe('RestaurantOperation Integration Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let restaurantOperation: RestaurantOperation;
  let restaurantEntityRepo: Repository<RestaurantEntity>;

  const restaurantId = 'restaurant-1';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

        JwtModule.registerAsync({
          global: true,
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow<string>('JWT_PRIVATE_KEY'),
            signOptions: {
              expiresIn: '60s',
            },
          }),
        }),
        MenuModule,
        AuthModule,
        RestaurantOwnershipModule,
        RestaurantModule,
        ClientModule,
        OwnerModule,
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    restaurantOperation = moduleFixture.get(RestaurantOperation);
    restaurantEntityRepo = dataSource.getRepository(RestaurantEntity);
  });

  beforeEach(async () => {
    await dataSource.query(`
      TRUNCATE TABLE
        "restaurants",
        "owners",
        "users"
      RESTART IDENTITY CASCADE
    `);

    await createRestaurantFixture(dataSource, {
      restaurantId,
      status: RestaurantStatusType.Closed,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('open', () => {
    it('닫힌 레스토랑을 열고 DB에 저장한다', async () => {
      await restaurantOperation.open(new RestaurantId(restaurantId));

      const saved = await restaurantEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.status).toBe(RestaurantStatusType.Open);
    });
  });

  describe('pauseOrders', () => {
    it('주문을 일시 중지하고 DB에 저장한다', async () => {
      await restaurantOperation.open(new RestaurantId(restaurantId));

      await restaurantOperation.pauseOrders(new RestaurantId(restaurantId));

      const saved = await restaurantEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.status).toBe(RestaurantStatusType.Paused);
    });
  });

  describe('close', () => {
    it('레스토랑을 닫고 DB에 저장한다', async () => {
      await restaurantOperation.open(new RestaurantId(restaurantId));

      await restaurantOperation.close(new RestaurantId(restaurantId));

      const saved = await restaurantEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.status).toBe(RestaurantStatusType.Closed);
    });
  });

  describe('존재하지 않는 레스토랑', () => {
    it('NotFoundException을 던진다', async () => {
      await expect(
        restaurantOperation.open(new RestaurantId('not-found-restaurant')),
      ).rejects.toThrow('Restaurant Not Found');
    });
  });
});
