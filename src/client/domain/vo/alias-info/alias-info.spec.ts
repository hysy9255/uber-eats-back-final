import { BadRequestException } from '@nestjs/common';
import { AliasInfo } from './alias-info';
import { AddressAlias, AddressAliasType } from './address-alias';
import { CustomAlias } from './custom-alias';

describe('AliasInfo', () => {
  const createAlias = (value: AddressAliasType) => new AddressAlias(value);

  const createCustomAlias = (value: string | null) => new CustomAlias(value);

  it('alias가 other가 아니고 customAlias가 null이면 생성할 수 있다', () => {
    const aliasInfo = new AliasInfo(
      createAlias(AddressAliasType.home),
      createCustomAlias(null),
    );

    expect(aliasInfo.alias.value).toBe(AddressAliasType.home);
    expect(aliasInfo.customAlias.value).toBeNull();
  });

  it('alias가 other이고 customAlias가 있으면 생성할 수 있다', () => {
    const aliasInfo = new AliasInfo(
      createAlias(AddressAliasType.other),
      createCustomAlias('우리집'),
    );

    expect(aliasInfo.alias.value).toBe(AddressAliasType.other);
    expect(aliasInfo.customAlias.value).toBe('우리집');
  });

  it('alias가 other인데 customAlias가 없으면 예외가 발생한다', () => {
    expect(() => {
      new AliasInfo(
        createAlias(AddressAliasType.other),
        createCustomAlias(null),
      );
    }).toThrow(BadRequestException);
  });

  it('alias가 other가 아닌데 customAlias가 있으면 예외가 발생한다', () => {
    expect(() => {
      new AliasInfo(
        createAlias(AddressAliasType.home),
        createCustomAlias('우리집'),
      );
    }).toThrow(BadRequestException);
  });
});
