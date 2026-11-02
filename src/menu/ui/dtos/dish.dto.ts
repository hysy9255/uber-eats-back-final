import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsStringOrNullButDefined } from 'src/shared/ui/validation/decorators/is-string-or-null-but-defined.decorator';

export class AddDishDTO {
  @IsString()
  dishName: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsStringOrNullButDefined()
  dishImgUrl: string | null;
}

export class UpdateDishDTO extends PartialType(AddDishDTO) {}
