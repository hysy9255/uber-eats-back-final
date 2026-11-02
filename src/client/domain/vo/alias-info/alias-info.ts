import { BadRequestException } from '@nestjs/common';
import { AddressAlias, AddressAliasType } from './address-alias';
import { CustomAlias } from './custom-alias';

export class AliasInfo {
  constructor(
    readonly alias: AddressAlias,
    readonly customAlias: CustomAlias,
  ) {
    const isOther = alias.value === AddressAliasType.other;
    const hasCustomAlias = customAlias.value !== null;

    if (isOther !== hasCustomAlias) {
      throw new BadRequestException(
        'Custom alias must exist only when alias is other',
      );
    }
  }
}
