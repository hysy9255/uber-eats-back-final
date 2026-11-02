import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ClientAddressBookOrmRepository } from './client-address-book.orm-repository';
import { DeliveryAddressEntity } from '../entities/delivery-address.orm.entity';

import { ClientId } from 'src/client/domain/vo/client-id';
import { DeliveryAddressFactory } from 'src/client/domain/factories/delivery-address.factory';
import { AddressFactory } from 'src/shared/infrastructure/factories/address.factory';
import { AddressAliasType } from 'src/client/domain/vo/alias-info/address-alias';
import { DeliveryAddressId } from 'src/client/domain/vo/delivery-address-id';
import { ClientAddressBook } from 'src/client/domain/client-address-book';

describe('ClientAddressBookOrmRepository Integration Test', () => {
  let module: TestingModule;

  let addressBookRepository: ClientAddressBookOrmRepository;
  let deliveryAddressRepo: Repository<DeliveryAddressEntity>;

  const clientId = new ClientId('client-1');

  const createAddressBook = () => new ClientAddressBook([]);

  const createDeliveryAddress = (
    id = 'address-1',
    streetAddress = '서울시 송파구 올림픽로 300',
  ) =>
    DeliveryAddressFactory.create(
      new DeliveryAddressId(id),
      streetAddress,
      '서울',
      '송파구',
      '05551',
      '101동 1001호',
      AddressAliasType.home,
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
      providers: [ClientAddressBookOrmRepository],
    }).compile();

    addressBookRepository = module.get(ClientAddressBookOrmRepository);

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

  describe('save', () => {
    it('AddressBook aggregate의 주소들을 DB에 저장한다', async () => {
      const addressBook = createAddressBook();

      addressBook.addAddress(createDeliveryAddress('address-1'));
      addressBook.addAddress(
        DeliveryAddressFactory.create(
          new DeliveryAddressId('address-2'),
          '서울시 강남구 테헤란로 1',
          '서울',
          '강남구',
          '06100',
          null,
          AddressAliasType.work,
          null,
        ),
      );

      await addressBookRepository.save(clientId, addressBook);

      const savedAddresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(savedAddresses).toHaveLength(2);

      expect(savedAddresses.map((address) => address.id).sort()).toEqual([
        'address-1',
        'address-2',
      ]);

      const defaultAddress = savedAddresses.find(
        (address) => address.isDefault,
      );

      expect(defaultAddress?.id).toBe('address-1');
    });

    it('같은 addressId로 다시 저장하면 새 row를 추가하지 않고 기존 row를 수정한다', async () => {
      const addressBook = createAddressBook();

      addressBook.addAddress(createDeliveryAddress('address-1'));

      await addressBookRepository.save(clientId, addressBook);

      const loadedAddressBook =
        await addressBookRepository.findClientAddressBook(clientId);

      loadedAddressBook.updateAddress(
        loadedAddressBook.addresses[0].id,
        AddressFactory.create(
          '서울시 송파구 새 주소 100',
          '서울',
          '송파구',
          '05552',
          '202동 2002호',
        ),
        loadedAddressBook.addresses[0].aliasInfo,
      );

      await addressBookRepository.save(clientId, loadedAddressBook);

      const addresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(addresses).toHaveLength(1);
      expect(addresses[0].id).toBe('address-1');
      expect(addresses[0].streetAddress).toBe('서울시 송파구 새 주소 100');
      expect(addresses[0].zip).toBe('05552');
      expect(addresses[0].apt).toBe('202동 2002호');
    });
    it('aggregate에서 제거된 일반 주소는 DB에서도 삭제한다', async () => {
      const addressBook = createAddressBook();

      addressBook.addAddress(createDeliveryAddress('address-1'));

      addressBook.addAddress(
        DeliveryAddressFactory.create(
          new DeliveryAddressId('address-2'),
          '서울시 강남구 테헤란로 1',
          '서울',
          '강남구',
          '06100',
          null,
          AddressAliasType.work,
          null,
        ),
      );

      await addressBookRepository.save(clientId, addressBook);

      addressBook.deleteAddress(
        addressBook.addresses.find(
          (address) => address.id.value === 'address-2',
        )!.id,
      );

      await addressBookRepository.save(clientId, addressBook);

      const addresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(addresses).toHaveLength(1);
      expect(addresses[0].id).toBe('address-1');
      expect(addresses[0].isDefault).toBe(true);
    });

    it('기본 주소를 삭제하면 DB row를 삭제하고 남은 주소를 기본 주소로 갱신한다', async () => {
      const addressBook = createAddressBook();

      addressBook.addAddress(createDeliveryAddress('address-1'));

      addressBook.addAddress(
        DeliveryAddressFactory.create(
          new DeliveryAddressId('address-2'),
          '서울시 강남구 테헤란로 1',
          '서울',
          '강남구',
          '06100',
          null,
          AddressAliasType.work,
          null,
        ),
      );

      await addressBookRepository.save(clientId, addressBook);

      addressBook.deleteAddress(
        addressBook.addresses.find(
          (address) => address.id.value === 'address-1',
        )!.id,
      );

      await addressBookRepository.save(clientId, addressBook);

      const addresses = await deliveryAddressRepo.find({
        where: { clientId: clientId.value },
      });

      expect(addresses).toHaveLength(1);

      expect(addresses[0]).toMatchObject({
        id: 'address-2',
        clientId: clientId.value,
        isDefault: true,
      });
    });
  });

  describe('findClientAddressBook', () => {
    it('DB의 배송지 row들을 ClientAddressBook aggregate로 복원한다', async () => {
      const addressBook = createAddressBook();

      addressBook.addAddress(createDeliveryAddress('address-1'));

      addressBook.addAddress(
        DeliveryAddressFactory.create(
          new DeliveryAddressId('address-2'),
          '서울시 강남구 테헤란로 1',
          '서울',
          '강남구',
          '06100',
          null,
          AddressAliasType.work,
          null,
        ),
      );

      await addressBookRepository.save(clientId, addressBook);

      const foundAddressBook =
        await addressBookRepository.findClientAddressBook(clientId);

      expect(foundAddressBook.addresses).toHaveLength(2);

      const foundHomeAddress = foundAddressBook.addresses.find(
        (address) => address.id.value === 'address-1',
      );

      expect(foundHomeAddress).toBeDefined();
      expect(foundHomeAddress?.address.streetAddress.value).toBe(
        '서울시 송파구 올림픽로 300',
      );
      expect(foundHomeAddress?.address.city.value).toBe('서울');
      expect(foundHomeAddress?.address.state.value).toBe('송파구');
      expect(foundHomeAddress?.address.zip.value).toBe('05551');
      expect(foundHomeAddress?.address.apt?.value).toBe('101동 1001호');
      expect(foundHomeAddress?.aliasInfo.alias.value).toBe(
        AddressAliasType.home,
      );
      expect(foundHomeAddress?.aliasInfo.customAlias.value).toBeNull();
      expect(foundHomeAddress?.isDefault.value).toBe(true);
    });

    it('해당 clientId의 주소만 조회한다', async () => {
      const anotherClientId = new ClientId('client-2');

      const firstClientAddressBook = createAddressBook();
      firstClientAddressBook.addAddress(createDeliveryAddress('address-1'));

      const secondClientAddressBook = createAddressBook();
      secondClientAddressBook.addAddress(
        DeliveryAddressFactory.create(
          new DeliveryAddressId('address-2'),
          '서울시 마포구 월드컵북로 1',
          '서울',
          '마포구',
          '03900',
          null,
          AddressAliasType.home,
          null,
        ),
      );

      await addressBookRepository.save(clientId, firstClientAddressBook);
      await addressBookRepository.save(
        anotherClientId,
        secondClientAddressBook,
      );

      const foundAddressBook =
        await addressBookRepository.findClientAddressBook(clientId);

      expect(foundAddressBook.addresses).toHaveLength(1);
      expect(foundAddressBook.addresses[0].id.value).toBe('address-1');
    });

    it('저장된 주소가 없으면 빈 AddressBook aggregate를 반환한다', async () => {
      const emptyClientId = new ClientId('client-without-address');

      const addressBook =
        await addressBookRepository.findClientAddressBook(emptyClientId);

      expect(addressBook.addresses).toEqual([]);
    });
  });
});
