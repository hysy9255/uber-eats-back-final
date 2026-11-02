import { ValidateNested } from 'class-validator';
import { RegisterAccountDTO } from './register-account.dto';
import { Type } from 'class-transformer';
import {
  RegisterRestaurantAddressDTO,
  RegisterRestaurantImagesDTO,
  RegisterRestaurantProfileDTO,
} from './register-restaurant.dto';

export class RegisterRestaurant {
  @ValidateNested()
  @Type(() => RegisterRestaurantAddressDTO)
  address: RegisterRestaurantAddressDTO;

  @ValidateNested()
  @Type(() => RegisterRestaurantImagesDTO)
  images: RegisterRestaurantImagesDTO;

  @ValidateNested()
  @Type(() => RegisterRestaurantProfileDTO)
  profile: RegisterRestaurantProfileDTO;
}

export class RegisterOwnerDTO {
  @ValidateNested()
  @Type(() => RegisterAccountDTO)
  account: RegisterAccountDTO;

  @ValidateNested()
  @Type(() => RegisterRestaurant)
  restaurant: RegisterRestaurant;
}
