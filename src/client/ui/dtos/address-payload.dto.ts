import { IsEnum, IsString } from 'class-validator';
import { AddressAliasType } from 'src/client/domain/vo/alias-info/address-alias';
import { IsStringOrNullButDefined } from 'src/shared/ui/validation/decorators/is-string-or-null-but-defined.decorator';

export class AddressPayloadDTO {
  @IsString()
  streetAddress: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;

  @IsStringOrNullButDefined()
  apt: string | null;

  @IsEnum(AddressAliasType)
  alias: AddressAliasType;

  @IsStringOrNullButDefined()
  customAlias: string | null;
}
