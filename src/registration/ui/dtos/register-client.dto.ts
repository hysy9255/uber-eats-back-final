import { ValidateNested } from 'class-validator';
import { RegisterAccountDTO } from './register-account.dto';
import { RegisterDeliveryAddressDTO } from './register-delivery-address.dto';
import { Type } from 'class-transformer';

export class RegisterClientDTO {
  @ValidateNested()
  @Type(() => RegisterAccountDTO)
  account: RegisterAccountDTO;

  @ValidateNested()
  @Type(() => RegisterDeliveryAddressDTO)
  deliveryAddress: RegisterDeliveryAddressDTO;
}
