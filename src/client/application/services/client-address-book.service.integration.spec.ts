import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClientAddressBookService } from './client-address-book.service';
import { ClientAddressBookRepository } from '../ports/client-address-book.repository';

import { ClientAddressBookOrmRepository } from '../../infrastructure/repositories/client-address-book.orm-repository';
import { DeliveryAddressEntity } from '../../infrastructure/entities/delivery-address.orm.entity';

import { ClientId } from '../../domain/vo/client-id';

import { DeliveryAddressFactory } from '../../domain/factories/delivery-address.factory';
import { AddressFactory } from '../../../shared/infrastructure/factories/address.factory';
import { AliasInfoFactory } from '../../domain/factories/alias-info.factory';
import { AddressAliasType } from '../../domain/vo/alias-info/address-alias';
import { DeliveryAddressId } from 'src/client/domain/vo/delivery-address-id';

describe('ClientAddressBookService Integration Test', () => {
  let module: TestingModule;

  let clientAddressBookService: ClientAddressBookService;
  let deliveryAddressRepo: Repository<DeliveryAddressEntity>;

  const clientId = new ClientId('client-1');

  const createDeliveryAddress = (
    deliveryAddressId: string = 'deliveryAddressId-1',
    streetAddress = '서울시 송파구 올림픽로 300',
    alias = AddressAliasType.home,
  ) =>
    DeliveryAddressFactory.create(
      new DeliveryAddressId(deliveryAddressId),
      streetAddress,
      '서울',
      '송파구',
      '05551',
      '101동 1001호',
      alias,
      null,
    );

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
        TypeOrmModule.forFeature([DeliveryAddressEntity]),
      ],
      providers: [
        ClientAddressBookService,
        {
          provide: ClientAddressBookRepository,
          useClass: ClientAddressBookOrmRepository,
        },
      ],
    }).compile();

    clientAddressBookService = module.get(ClientAddressBookService);

    deliveryAddressRepo = module.get<Repository<DeliveryAddressEntity>>(
      getRepositoryToken(DeliveryAddressEntity),
    );
  });

  beforeEach(async () => {
    await deliveryAddressRepo.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('addNewAddress', () => {
    it('첫 배송지를 추가하면 DB에 저장되고 기본 배송지가 된다', async () => {
      const newAddress = createDeliveryAddress();

      await clientAddressBookService.addNewAddress(clientId, newAddress);

      const savedAddresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(savedAddresses).toHaveLength(1);

      expect(savedAddresses[0]).toMatchObject({
        id: newAddress.id.value,
        clientId: clientId.value,
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

    it('두 번째 주소를 추가하면 기존 기본 배송지는 유지된다', async () => {
      const firstAddress = createDeliveryAddress('id-1');
      const secondAddress = createDeliveryAddress(
        'id-2',
        '서울시 강남구 테헤란로 100',
        AddressAliasType.work,
      );

      await clientAddressBookService.addNewAddress(clientId, firstAddress);
      await clientAddressBookService.addNewAddress(clientId, secondAddress);

      const savedAddresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(savedAddresses).toHaveLength(2);

      const savedFirstAddress = savedAddresses.find(
        (address) => address.id === firstAddress.id.value,
      );

      const savedSecondAddress = savedAddresses.find(
        (address) => address.id === secondAddress.id.value,
      );

      expect(savedFirstAddress?.isDefault).toBe(true);
      expect(savedSecondAddress?.isDefault).toBe(false);
    });
  });

  describe('updateAddress', () => {
    it('주소와 별칭을 수정하면 DB에 반영한다', async () => {
      const deliveryAddress = createDeliveryAddress();

      await clientAddressBookService.addNewAddress(clientId, deliveryAddress);

      await clientAddressBookService.updateAddress(
        clientId,
        deliveryAddress.id,
        AddressFactory.create(
          '서울시 강남구 테헤란로 123',
          '서울',
          '강남구',
          '06134',
          '10층',
        ),
        AliasInfoFactory.create(AddressAliasType.other, '회사'),
      );

      const updatedAddress = await deliveryAddressRepo.findOne({
        where: {
          clientId: clientId.value,
          id: deliveryAddress.id.value,
        },
      });

      expect(updatedAddress).toMatchObject({
        id: deliveryAddress.id.value,
        streetAddress: '서울시 강남구 테헤란로 123',
        city: '서울',
        state: '강남구',
        zip: '06134',
        apt: '10층',
        alias: AddressAliasType.other,
        customAlias: '회사',
      });
    });
  });

  describe('markAddressDefault', () => {
    it('기본 배송지를 변경하면 기존 기본 주소는 해제되고 대상 주소가 기본이 된다', async () => {
      const firstAddress = createDeliveryAddress();
      const secondAddress = createDeliveryAddress(
        'deliveryAddressId-2',
        '서울시 강남구 테헤란로 100',
        AddressAliasType.work,
      );

      await clientAddressBookService.addNewAddress(clientId, firstAddress);
      await clientAddressBookService.addNewAddress(clientId, secondAddress);

      await clientAddressBookService.markAddressDefault(
        clientId,
        secondAddress.id,
      );

      const savedAddresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      const savedFirstAddress = savedAddresses.find(
        (address) => address.id === firstAddress.id.value,
      );

      const savedSecondAddress = savedAddresses.find(
        (address) => address.id === secondAddress.id.value,
      );

      expect(savedFirstAddress?.isDefault).toBe(false);
      expect(savedSecondAddress?.isDefault).toBe(true);
    });
  });

  describe('deleteAddress', () => {
    it('기본이 아닌 주소를 삭제하면 DB row도 삭제된다', async () => {
      const firstAddress = createDeliveryAddress();
      const secondAddress = createDeliveryAddress(
        'deliveryAddressId-2',
        '서울시 강남구 테헤란로 100',
        AddressAliasType.work,
      );

      await clientAddressBookService.addNewAddress(clientId, firstAddress);
      await clientAddressBookService.addNewAddress(clientId, secondAddress);

      await clientAddressBookService.deleteAddress(clientId, secondAddress.id);

      const savedAddresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(savedAddresses).toHaveLength(1);
      expect(savedAddresses[0].id).toBe(firstAddress.id.value);
      expect(savedAddresses[0].isDefault).toBe(true);
    });

    it('기본 주소를 삭제하면 DB에서 제거되고 남은 주소가 새 기본 주소가 된다', async () => {
      const firstAddress = createDeliveryAddress();
      const secondAddress = createDeliveryAddress(
        'deliveryAddressId-2',
        '서울시 강남구 테헤란로 100',
        AddressAliasType.work,
      );

      await clientAddressBookService.addNewAddress(clientId, firstAddress);
      await clientAddressBookService.addNewAddress(clientId, secondAddress);

      await clientAddressBookService.deleteAddress(clientId, firstAddress.id);

      const savedAddresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(savedAddresses).toHaveLength(1);

      expect(savedAddresses[0]).toMatchObject({
        id: secondAddress.id.value,
        clientId: clientId.value,
        isDefault: true,
      });
    });
  });
});
