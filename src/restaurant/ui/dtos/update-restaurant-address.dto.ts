import { IsString } from 'class-validator';
import { IsStringOrNullButDefined } from 'src/shared/ui/validation/decorators/is-string-or-null-but-defined.decorator';

export class UpdateRestaurantAddressDTO {
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
}
