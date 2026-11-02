import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RestaurantService } from './restaurant.service';
import { RestaurantGalleryEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-image.orm.entity';
import { RestaurantAddressEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-address.orm.entity';
import { RestaurantProfileEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-profile.orm-entity';
import { RestaurantHoursEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant-hours.orm.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { AddressFactory } from 'src/shared/infrastructure/factories/address.factory';
import { RestaurantName } from 'src/restaurant/domain/restaurant-profile/vo/restaurant-name';
import { RestaurantEmail } from 'src/restaurant/domain/restaurant-profile/vo/restaurant-email';
import { DayOperatingHoursFactory } from 'src/restaurant/domain/factories/day-operating-hours.factory';
import { DayOfWeekType } from 'src/restaurant/domain/operating-hours/vo/day-of-week';
import { GeneralImageUrl } from 'src/restaurant/domain/restaurant-gallery/vo/general-image-url';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { MenuModule } from 'src/menu/menu.module';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantOwnershipModule } from 'src/authorization/restaurant-ownership/restaurant-ownership.module';
import { ClientModule } from 'src/client/client.module';
import { OwnerModule } from 'src/owner/owner.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { createRestaurantFixture } from './test/fixtures/restaurant.fixture';

describe('RestaurantService Integration Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let restaurantService: RestaurantService;

  let galleryEntityRepo: Repository<RestaurantGalleryEntity>;
  let addressEntityRepo: Repository<RestaurantAddressEntity>;
  let profileEntityRepo: Repository<RestaurantProfileEntity>;
  let hoursEntityRepo: Repository<RestaurantHoursEntity>;

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
    restaurantService = moduleFixture.get(RestaurantService);

    galleryEntityRepo = dataSource.getRepository(RestaurantGalleryEntity);
    addressEntityRepo = dataSource.getRepository(RestaurantAddressEntity);
    profileEntityRepo = dataSource.getRepository(RestaurantProfileEntity);
    hoursEntityRepo = dataSource.getRepository(RestaurantHoursEntity);
  });

  beforeEach(async () => {
    await hoursEntityRepo.clear();
    await galleryEntityRepo.clear();
    await addressEntityRepo.clear();
    await profileEntityRepo.clear();

    await createRestaurantFixture(dataSource, { restaurantId });

    await galleryEntityRepo.save({
      restaurantId,
      logo: 'https://example.com/logo.png',
      mainImg: 'https://example.com/main.png',
      sub1Img: 'https://example.com/sub1.png',
      sub2Img: 'https://example.com/sub2.png',
      bannerImg: 'https://example.com/banner.png',
    });

    await addressEntityRepo.save({
      restaurantId,
      streetAddress: 'Old Street 1',
      city: 'Seoul',
      state: 'Seoul',
      zip: '12345',
      apt: '101',
    });

    await profileEntityRepo.save({
      restaurantId,
      name: 'Old Restaurant',
      cuisineType: 'KOREAN',
      email: 'old@example.com',
      instagram: 'https://instagram.com/old',
      website: 'https://old.example.com',
      storePhone: '010-1111-1111',
    });

    await hoursEntityRepo.save([
      {
        restaurantId,
        dayOfWeek: DayOfWeekType.Mon,
        isClosed: false,
        openTime: '09:00',
        closeTime: '18:00',
      },
      {
        restaurantId,
        dayOfWeek: DayOfWeekType.Tue,
        isClosed: false,
        openTime: '09:00',
        closeTime: '18:00',
      },
      {
        restaurantId,
        dayOfWeek: DayOfWeekType.Wed,
        isClosed: false,
        openTime: '09:00',
        closeTime: '18:00',
      },
      {
        restaurantId,
        dayOfWeek: DayOfWeekType.Thu,
        isClosed: false,
        openTime: '09:00',
        closeTime: '18:00',
      },
      {
        restaurantId,
        dayOfWeek: DayOfWeekType.Fri,
        isClosed: false,
        openTime: '09:00',
        closeTime: '18:00',
      },
      {
        restaurantId,
        dayOfWeek: DayOfWeekType.Sat,
        isClosed: false,
        openTime: '09:00',
        closeTime: '18:00',
      },
      {
        restaurantId,
        dayOfWeek: DayOfWeekType.Sun,
        isClosed: false,
        openTime: '09:00',
        closeTime: '18:00',
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('updateImages', () => {
    it('전달한 이미지만 수정하고, undefined인 값은 유지한다', async () => {
      await restaurantService.updateImages(
        new RestaurantId(restaurantId),
        undefined,
        new GeneralImageUrl('https://example.com/new-main.png'),
        undefined,
        undefined,
        undefined,
      );

      const saved = await galleryEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.logo).toBe('https://example.com/logo.png');
      expect(saved.mainImg).toBe('https://example.com/new-main.png');
      expect(saved.sub1Img).toBe('https://example.com/sub1.png');
      expect(saved.sub2Img).toBe('https://example.com/sub2.png');
      expect(saved.bannerImg).toBe('https://example.com/banner.png');
    });

    it('logo에 null을 전달하면 logo를 제거한다', async () => {
      await restaurantService.updateImages(
        new RestaurantId(restaurantId),
        null,
      );

      const saved = await galleryEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.logo).toBeNull();
    });
  });

  describe('updateAddress', () => {
    it('레스토랑 주소를 수정한다', async () => {
      const newAddress = AddressFactory.create(
        'New Street 99',
        'Busan',
        'Busan',
        '54321',
        null,
      );

      await restaurantService.updateAddress(
        new RestaurantId(restaurantId),
        newAddress,
      );

      const saved = await addressEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.streetAddress).toBe('new street 99');
      expect(saved.city).toBe('busan');
      expect(saved.state).toBe('busan');
      expect(saved.zip).toBe('54321');
      expect(saved.apt).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('전달한 프로필 값만 수정한다', async () => {
      await restaurantService.updateProfile(
        new RestaurantId(restaurantId),
        new RestaurantName('New Restaurant'),
        undefined,
        new RestaurantEmail('new@example.com'),
      );

      const saved = await profileEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.name).toBe('new restaurant');
      expect(saved.email).toBe('new@example.com');

      expect(saved.cuisineType).toBe('korean');
      expect(saved.instagram).toBe('https://instagram.com/old');
      expect(saved.website).toBe('https://old.example.com/');
      expect(saved.storePhone).toBe('01011111111');
    });

    it('nullable 필드에 null을 전달하면 값을 제거한다', async () => {
      await restaurantService.updateProfile(
        new RestaurantId(restaurantId),
        undefined,
        undefined,
        null,
        null,
        null,
        null,
      );

      const saved = await profileEntityRepo.findOneByOrFail({
        restaurantId,
      });

      expect(saved.email).toBeNull();
      expect(saved.instagram).toBeNull();
      expect(saved.website).toBeNull();
      expect(saved.storePhone).toBeNull();
    });
  });

  describe('updateHours', () => {
    it('전달된 요일의 운영시간만 교체하고 나머지는 유지한다', async () => {
      const monday = DayOperatingHoursFactory.create(
        DayOfWeekType.Mon,
        false,
        '11:00',
        '22:00',
      );

      await restaurantService.updateHours(new RestaurantId(restaurantId), [
        monday,
      ]);

      const mondaySaved = await hoursEntityRepo.findOneByOrFail({
        restaurantId,
        dayOfWeek: DayOfWeekType.Mon,
      });

      const tuesdaySaved = await hoursEntityRepo.findOneByOrFail({
        restaurantId,
        dayOfWeek: DayOfWeekType.Tue,
      });

      expect(mondaySaved.openTime).toBe('11:00');
      expect(mondaySaved.closeTime).toBe('22:00');

      expect(tuesdaySaved.openTime).toBe('09:00');
      expect(tuesdaySaved.closeTime).toBe('18:00');
    });

    it('휴무일로 수정할 수 있다', async () => {
      const monday = DayOperatingHoursFactory.create(
        DayOfWeekType.Mon,
        true,
        null,
        null,
      );

      await restaurantService.updateHours(new RestaurantId(restaurantId), [
        monday,
      ]);

      const saved = await hoursEntityRepo.findOneByOrFail({
        restaurantId,
        dayOfWeek: DayOfWeekType.Mon,
      });

      expect(saved.isClosed).toBe(true);
      expect(saved.openTime).toBeNull();
      expect(saved.closeTime).toBeNull();
    });
  });
});
