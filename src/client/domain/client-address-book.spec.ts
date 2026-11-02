import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ClientAddressBook } from './client-address-book';
import { DeliveryAddress } from './delivery-address';
import { DeliveryAddressId } from './vo/delivery-address-id';
import { AliasInfo } from './vo/alias-info/alias-info';
import { Address } from 'src/shared/infrastructure/entities/address/address';
import { AddressAlias, AddressAliasType } from './vo/alias-info/address-alias';
import { CustomAlias } from './vo/alias-info/custom-alias';

type TestDeliveryAddress = DeliveryAddress & {
  markAsDefault: jest.Mock;
  markAsNotDefault: jest.Mock;
  updateAddress: jest.Mock;
  updateAliasInfo: jest.Mock;
};

function createAddress(
  id: string,
  isDefault: boolean,
  alias: AddressAliasType,
  customAlias?: string,
): TestDeliveryAddress {
  const defaultState = { value: isDefault };

  return {
    id: new DeliveryAddressId(id),
    isDefault: defaultState,
    aliasInfo: new AliasInfo(
      new AddressAlias(alias),
      new CustomAlias(customAlias ?? null),
    ),

    markAsDefault: jest.fn(() => {
      defaultState.value = true;
    }),

    markAsNotDefault: jest.fn(() => {
      defaultState.value = false;
    }),

    updateAddress: jest.fn(),
    updateAliasInfo: jest.fn(),
  } as unknown as TestDeliveryAddress;
}

describe('ClientAddressBook', () => {
  describe('addAddress', () => {
    it('첫 배송지를 추가하면 자동으로 기본 배송지가 된다', () => {
      const addressBook = new ClientAddressBook([]);
      const newAddress = createAddress(
        'address-1',
        false,
        AddressAliasType.home,
      );

      addressBook.addAddress(newAddress);

      expect(addressBook.addresses).toHaveLength(1);
      expect(newAddress.markAsDefault).toHaveBeenCalledTimes(1);
      expect(newAddress.isDefault.value).toBe(true);
    });

    it('기존 기본 배송지가 있으면 새 주소는 일반 주소로 추가된다', () => {
      const defaultAddress = createAddress(
        'address-1',
        true,
        AddressAliasType.home,
      );
      const newAddress = createAddress(
        'address-2',
        false,
        AddressAliasType.work,
      );

      const addressBook = new ClientAddressBook([defaultAddress]);

      addressBook.addAddress(newAddress);

      expect(addressBook.addresses).toHaveLength(2);

      expect(defaultAddress.isDefault.value).toBe(true);
      expect(defaultAddress.markAsNotDefault).not.toHaveBeenCalled();

      expect(newAddress.isDefault.value).toBe(false);
      expect(newAddress.markAsDefault).not.toHaveBeenCalled();
    });

    it('동일한 배송지 ID는 추가할 수 없다', () => {
      const existingAddress = createAddress(
        'address-1',
        true,
        AddressAliasType.home,
      );
      const addressBook = new ClientAddressBook([existingAddress]);
      const duplicateAddress = createAddress(
        'address-1',
        false,
        AddressAliasType.work,
      );

      expect(() => addressBook.addAddress(duplicateAddress)).toThrow(
        ConflictException,
      );
    });

    it('other 이외에 alias는 중복될 수 없다', () => {
      const defaultAddress = createAddress(
        'address-1',
        true,
        AddressAliasType.home,
      );
      const addressBook = new ClientAddressBook([defaultAddress]);
      const newAddress = createAddress(
        'address-2',
        false,
        AddressAliasType.home,
      );

      expect(() => addressBook.addAddress(newAddress)).toThrow(
        ConflictException,
      );
    });

    it('배송지는 최대 10개까지만 추가할 수 있다', () => {
      const addresses = Array.from({ length: 10 }, (_, index) =>
        createAddress(
          `address-${index + 1}`,
          index === 0,
          AddressAliasType.other,
          'somewhere',
        ),
      );

      const addressBook = new ClientAddressBook(addresses);
      const newAddress = createAddress(
        'address-11',
        false,
        AddressAliasType.other,
        'somewhere',
      );

      expect(() => addressBook.addAddress(newAddress)).toThrow(
        ConflictException,
      );
    });

    it('deliveryAddress 객체는 항상 false인 상태로 addAddress 파라미터로 사용된다 - true로 변경되는건 client address book 내부에서 결정된다', () => {
      const addressBook = new ClientAddressBook([]);
      const newAddress = createAddress(
        'address-1',
        true,
        AddressAliasType.home,
      );

      expect(() => addressBook.addAddress(newAddress)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateAddress', () => {
    it('대상 배송지의 주소와 별칭 정보를 변경한다', () => {
      const target = createAddress(
        'address-1',
        true,
        AddressAliasType.other,
        'somewhere',
      );
      const addressBook = new ClientAddressBook([target]);

      const newAddress = {} as Address;
      const newAliasInfo = {} as AliasInfo;

      addressBook.updateAddress(
        new DeliveryAddressId('address-1'),
        newAddress,
        newAliasInfo,
      );

      expect(target.updateAddress).toHaveBeenCalledWith(newAddress);
      expect(target.updateAliasInfo).toHaveBeenCalledWith(newAliasInfo);
    });

    it('없는 배송지를 수정하려 하면 예외가 발생한다', () => {
      const addressBook = new ClientAddressBook([
        createAddress('address-1', true, AddressAliasType.other, 'somewhere'),
      ]);

      expect(() =>
        addressBook.updateAddress(
          new DeliveryAddressId('not-found'),
          {} as Address,
          {} as AliasInfo,
        ),
      ).toThrow(NotFoundException);
    });
  });

  describe('deleteAddress', () => {
    it('주소가 하나뿐이면 삭제할 수 없다', () => {
      const addressBook = new ClientAddressBook([
        createAddress('address-1', true, AddressAliasType.other, 'somewhere'),
      ]);

      expect(() =>
        addressBook.deleteAddress(new DeliveryAddressId('address-1')),
      ).toThrow(ConflictException);
    });

    it('기본이 아닌 주소를 삭제해도 기존 기본 주소는 유지된다', () => {
      const defaultAddress = createAddress(
        'address-1',
        true,
        AddressAliasType.other,
        'somewhere',
      );
      const removableAddress = createAddress(
        'address-2',
        false,
        AddressAliasType.other,
        'somewhere',
      );

      const addressBook = new ClientAddressBook([
        defaultAddress,
        removableAddress,
      ]);

      addressBook.deleteAddress(new DeliveryAddressId('address-2'));

      expect(addressBook.addresses).toHaveLength(1);
      expect(addressBook.addresses[0].id.value).toBe('address-1');
      expect(defaultAddress.isDefault.value).toBe(true);
      expect(defaultAddress.markAsDefault).not.toHaveBeenCalled();
    });

    it('기본 주소를 삭제하면 남은 첫 주소가 새 기본 주소가 된다', () => {
      const previousDefault = createAddress(
        'address-1',
        true,
        AddressAliasType.other,
        'somewhere',
      );
      const nextAddress = createAddress(
        'address-2',
        false,
        AddressAliasType.other,
        'somewhere',
      );
      const thirdAddress = createAddress(
        'address-3',
        false,
        AddressAliasType.other,
        'somewhere',
      );

      const addressBook = new ClientAddressBook([
        previousDefault,
        nextAddress,
        thirdAddress,
      ]);

      addressBook.deleteAddress(new DeliveryAddressId('address-1'));

      expect(addressBook.addresses).toHaveLength(2);
      expect(addressBook.addresses[0].id.value).toBe('address-2');
      expect(nextAddress.markAsDefault).toHaveBeenCalledTimes(1);
      expect(nextAddress.isDefault.value).toBe(true);
    });

    it('없는 배송지를 삭제하려 하면 예외가 발생한다', () => {
      const addressBook = new ClientAddressBook([
        createAddress('address-1', true, AddressAliasType.other, 'somewhere'),
        createAddress('address-2', false, AddressAliasType.other, 'somewhere'),
      ]);

      expect(() =>
        addressBook.deleteAddress(new DeliveryAddressId('not-found')),
      ).toThrow(NotFoundException);
    });
  });

  describe('setDefault', () => {
    it('기본 배송지를 변경하면 기존 기본 주소는 해제되고 대상 주소가 기본이 된다', () => {
      const oldDefault = createAddress(
        'address-1',
        true,
        AddressAliasType.other,
        'somewhere',
      );
      const newDefault = createAddress(
        'address-2',
        false,
        AddressAliasType.other,
        'somewhere',
      );

      const addressBook = new ClientAddressBook([oldDefault, newDefault]);

      addressBook.setDefault(new DeliveryAddressId('address-2'));

      expect(oldDefault.markAsNotDefault).toHaveBeenCalledTimes(1);
      expect(oldDefault.isDefault.value).toBe(false);

      expect(newDefault.markAsDefault).toHaveBeenCalledTimes(1);
      expect(newDefault.isDefault.value).toBe(true);
    });

    it('이미 기본 배송지를 다시 지정하면 상태를 변경하지 않는다', () => {
      const defaultAddress = createAddress(
        'address-1',
        true,
        AddressAliasType.other,
        'somewhere',
      );
      const addressBook = new ClientAddressBook([defaultAddress]);

      addressBook.setDefault(new DeliveryAddressId('address-1'));

      expect(defaultAddress.markAsDefault).not.toHaveBeenCalled();
      expect(defaultAddress.markAsNotDefault).not.toHaveBeenCalled();
    });

    it('없는 배송지를 기본 주소로 지정하려 하면 예외가 발생한다', () => {
      const addressBook = new ClientAddressBook([
        createAddress('address-1', true, AddressAliasType.other, 'somewhere'),
      ]);

      expect(() =>
        addressBook.setDefault(new DeliveryAddressId('not-found')),
      ).toThrow(NotFoundException);
    });
  });
});
