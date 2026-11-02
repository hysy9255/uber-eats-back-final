import { AddressAlias, AddressAliasType } from '../vo/alias-info/address-alias';
import { AliasInfo } from '../vo/alias-info/alias-info';
import { CustomAlias } from '../vo/alias-info/custom-alias';

export class AliasInfoFactory {
  static create(alias: AddressAliasType, customAlias: string | null) {
    return new AliasInfo(new AddressAlias(alias), new CustomAlias(customAlias));
  }
}
