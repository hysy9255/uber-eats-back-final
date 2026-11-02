import { IsEmail, IsString } from 'class-validator';
import { IsStringOrNullButDefined } from 'src/shared/ui/validation/decorators/is-string-or-null-but-defined.decorator';

export class RegisterAccountDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsString()
  phoneNumber: string;

  @IsStringOrNullButDefined()
  profileImage: string | null;
}
