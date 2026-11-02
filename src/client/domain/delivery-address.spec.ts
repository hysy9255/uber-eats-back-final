import { DeliveryAddressId } from './vo/delivery-address-id';
import { AliasInfo } from './vo/alias-info/alias-info';
import { IsDefaultAddress } from './vo/is-default-address';
import { Address } from 'src/shared/infrastructure/entities/address/address';
import { DeliveryAddress } from './delivery-address';

describe('DeliveryAddress', () => {
  const createDeliveryAddress = () => {
    const id = new DeliveryAddressId('address-1');
    const address = {} as Address;
    const aliasInfo = {} as AliasInfo;

    return {
      id,
      address,
      aliasInfo,
      deliveryAddress: DeliveryAddress.create(id, address, aliasInfo),
    };
  };

  describe('create', () => {
    it('새로 생성하면 기본 배송지 상태는 false다', () => {
      const { deliveryAddress } = createDeliveryAddress();

      expect(deliveryAddress.isDefault.value).toBe(false);
    });

    it('생성한 id, address, aliasInfo를 가진다', () => {
      const { id, address, aliasInfo, deliveryAddress } =
        createDeliveryAddress();

      expect(deliveryAddress.id).toBe(id);
      expect(deliveryAddress.address).toBe(address);
      expect(deliveryAddress.aliasInfo).toBe(aliasInfo);
    });
  });

  describe('restore', () => {
    it('저장된 기본 배송지 상태를 그대로 복원한다', () => {
      const id = new DeliveryAddressId('address-1');
      const address = {} as Address;
      const aliasInfo = {} as AliasInfo;

      const deliveryAddress = DeliveryAddress.restore(
        id,
        address,
        aliasInfo,
        new IsDefaultAddress(true),
      );

      expect(deliveryAddress.id).toBe(id);
      expect(deliveryAddress.address).toBe(address);
      expect(deliveryAddress.aliasInfo).toBe(aliasInfo);
      expect(deliveryAddress.isDefault.value).toBe(true);
    });

    it('저장된 일반 배송지 상태도 그대로 복원한다', () => {
      const deliveryAddress = DeliveryAddress.restore(
        new DeliveryAddressId('address-1'),
        {} as Address,
        {} as AliasInfo,
        new IsDefaultAddress(false),
      );

      expect(deliveryAddress.isDefault.value).toBe(false);
    });
  });

  describe('updateAddress', () => {
    it('주소 정보를 변경한다', () => {
      const { deliveryAddress } = createDeliveryAddress();
      const newAddress = {} as Address;

      deliveryAddress.updateAddress(newAddress);

      expect(deliveryAddress.address).toBe(newAddress);
    });
  });

  describe('updateAliasInfo', () => {
    it('별칭 정보를 변경한다', () => {
      const { deliveryAddress } = createDeliveryAddress();
      const newAliasInfo = {} as AliasInfo;

      deliveryAddress.updateAliasInfo(newAliasInfo);

      expect(deliveryAddress.aliasInfo).toBe(newAliasInfo);
    });
  });

  describe('markAsDefault', () => {
    it('기본 배송지로 변경한다', () => {
      const { deliveryAddress } = createDeliveryAddress();

      deliveryAddress.markAsDefault();

      expect(deliveryAddress.isDefault.value).toBe(true);
    });
  });

  describe('markAsNotDefault', () => {
    it('기본 배송지를 해제한다', () => {
      const { deliveryAddress } = createDeliveryAddress();

      deliveryAddress.markAsDefault();
      deliveryAddress.markAsNotDefault();

      expect(deliveryAddress.isDefault.value).toBe(false);
    });
  });
});
