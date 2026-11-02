import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import request from 'supertest';

import { AuthGuard } from 'src/auth/ui/guards/auth.guard';
import { RolesGuard } from 'src/auth/ui/guards/roles.guard';
import { UserRole } from 'src/auth/application/ports/find-user';

import { ClientDeliveryAddressController } from 'src/client/ui/controllers/client-delivery-address.controller';
import { ClientContextInterceptor } from 'src/shared/ui/interceptors/client-context.interceptor';

import { ClientAddressBookService } from 'src/client/application/services/client-address-book.service';
import { ClientAddressBookRepository } from 'src/client/application/ports/client-address-book.repository';
import { ClientRepository } from 'src/client/application/ports/client.repository';

import { ClientAddressBookOrmRepository } from 'src/client/infrastructure/repositories/client-address-book.orm-repository';
import { ClientOrmRepository } from 'src/client/infrastructure/repositories/client.orm-repository';

import { DeliveryAddressEntity } from 'src/client/infrastructure/entities/delivery-address.orm.entity';
import { ClientEntity } from 'src/client/infrastructure/entities/client.orm-entity';

import { AddressAliasType } from 'src/client/domain/vo/alias-info/address-alias';

describe('ClientDeliveryAddressController E2E Test', () => {
  let module: TestingModule;
  let app: INestApplication;

  let jwtService: JwtService;
  let clientRepo: Repository<ClientEntity>;
  let deliveryAddressRepo: Repository<DeliveryAddressEntity>;

  const jwtSecret = 'test-secret';

  const clientUserId = 'user-client-1';
  const clientId = 'client-1';

  const createToken = (userId: string, userRole: UserRole): string => {
    return jwtService.sign({ userId, userRole }, { secret: jwtSecret });
  };

  const createAddressBody = (
    overrides: Partial<{
      streetAddress: string;
      city: string;
      state: string;
      zip: string;
      apt: string | null;
      alias: AddressAliasType;
      customAlias: string | null;
    }> = {},
  ) => ({
    streetAddress: '서울시 송파구 올림픽로 300',
    city: '서울',
    state: '송파구',
    zip: '05551',
    apt: '101동 1001호',
    alias: AddressAliasType.home,
    customAlias: null,
    ...overrides,
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),

        JwtModule.register({
          global: true,
          secret: jwtSecret,
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

        TypeOrmModule.forFeature([ClientEntity, DeliveryAddressEntity]),
      ],
      controllers: [ClientDeliveryAddressController],
      providers: [
        AuthGuard,
        RolesGuard,

        ClientContextInterceptor,
        ClientAddressBookService,

        {
          provide: ClientAddressBookRepository,
          useClass: ClientAddressBookOrmRepository,
        },
        {
          provide: ClientRepository,
          useClass: ClientOrmRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalGuards(module.get(AuthGuard), module.get(RolesGuard));

    await app.init();

    jwtService = module.get(JwtService);

    clientRepo = module.get<Repository<ClientEntity>>(
      getRepositoryToken(ClientEntity),
    );

    deliveryAddressRepo = module.get<Repository<DeliveryAddressEntity>>(
      getRepositoryToken(DeliveryAddressEntity),
    );
  });

  beforeEach(async () => {
    await deliveryAddressRepo.createQueryBuilder().delete().execute();
    await clientRepo.createQueryBuilder().delete().execute();

    // ClientEntity 실제 필드명에 맞춰 조정
    await clientRepo.save({
      clientId,
      userId: clientUserId,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /client/delivery-addresses', () => {
    it('토큰이 없으면 401을 반환한다', async () => {
      await request(app.getHttpServer())
        .post('/client/delivery-addresses')
        .send(createAddressBody())
        .expect(401);
    });

    it('CLIENT가 아닌 role이면 403을 반환한다', async () => {
      const ownerToken = createToken('owner-user-1', UserRole.Owner);

      await request(app.getHttpServer())
        .post('/client/delivery-addresses')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send(createAddressBody())
        .expect(403);
    });

    it('CLIENT role이지만 연결된 Client가 없으면 403을 반환한다', async () => {
      const token = createToken('user-without-client', UserRole.Client);

      await request(app.getHttpServer())
        .post('/client/delivery-addresses')
        .set('Authorization', `Bearer ${token}`)
        .send(createAddressBody())
        .expect(403);
    });

    it('CLIENT 토큰으로 첫 주소를 추가하면 201을 반환하고 기본 주소로 저장한다', async () => {
      const token = createToken(clientUserId, UserRole.Client);

      await request(app.getHttpServer())
        .post('/client/delivery-addresses')
        .set('Authorization', `Bearer ${token}`)
        .send(createAddressBody())
        .expect(201);

      const addresses = await deliveryAddressRepo.find({
        where: { clientId },
      });

      expect(addresses).toHaveLength(1);

      expect(addresses[0]).toMatchObject({
        clientId,
        streetAddress: '서울시 송파구 올림픽로 300',
        city: '서울',
        state: '송파구',
        zip: '05551',
        apt: '101동 1001호',
        alias: AddressAliasType.home,
        customAlias: null,
        isDefault: true,
      });
    });
  });
});
