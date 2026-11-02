// import { IsStringIfDefined } from 'src/shared/ui/validation/decorators/is-string-if-defined.decorator';

import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateRestaurantAddressDTO } from './update-restaurant-address.dto';
import { UpdateRestaurantImagesDTO } from './update-restaurant-images.dto';
import { UpdateRestaurantProfileDTO } from './update-restaurant-profile.dto';
import { Type } from 'class-transformer';

export class UpdateRestaurantSettingDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRestaurantAddressDTO)
  updatedAddress?: UpdateRestaurantAddressDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRestaurantImagesDTO)
  updatedImages?: UpdateRestaurantImagesDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRestaurantProfileDTO)
  updatedProfile?: UpdateRestaurantProfileDTO;
}
