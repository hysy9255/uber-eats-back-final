import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DayOfWeekType } from 'src/restaurant/domain/operating-hours/vo/day-of-week';
import { IsStringOrNullButDefined } from 'src/shared/ui/validation/decorators/is-string-or-null-but-defined.decorator';

export class RegisterRestaurantAddressDTO {
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

export class RegisterRestaurantImagesDTO {
  @IsStringOrNullButDefined()
  logo: string | null;

  @IsString()
  mainImage: string;

  @IsString()
  sub1Image: string;

  @IsString()
  sub2Image: string;

  @IsString()
  bannerImage: string;
}

export class RegisterRestaurantProfileDTO {
  @IsString()
  name: string;

  @IsString()
  cuisineType: string;

  @IsStringOrNullButDefined()
  email: string | null;

  @IsStringOrNullButDefined()
  instagram: string | null;

  @IsStringOrNullButDefined()
  website: string | null;

  @IsStringOrNullButDefined()
  storePhone: string | null;
}

export class RegisterRestaurantDayHoursDTO {
  @IsEnum(DayOfWeekType)
  dayOfWeek: DayOfWeekType;

  @IsBoolean()
  isClosed: boolean;

  @IsStringOrNullButDefined()
  openTime: string | null;

  @IsStringOrNullButDefined()
  closeTime: string | null;
}

export class RegisterRestaurantHoursDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegisterRestaurantDayHoursDTO)
  days: RegisterRestaurantDayHoursDTO[];
}

export class RegisterRestaurantDTO {
  @ValidateNested()
  @Type(() => RegisterRestaurantAddressDTO)
  address: RegisterRestaurantAddressDTO;

  @ValidateNested()
  @Type(() => RegisterRestaurantImagesDTO)
  images: RegisterRestaurantImagesDTO;

  @ValidateNested()
  @Type(() => RegisterRestaurantProfileDTO)
  profile: RegisterRestaurantProfileDTO;

  @ValidateNested()
  @Type(() => RegisterRestaurantHoursDTO)
  hours: RegisterRestaurantHoursDTO;
}
