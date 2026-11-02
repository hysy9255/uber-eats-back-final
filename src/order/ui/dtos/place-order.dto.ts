import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsStringOrNullButDefined } from 'src/shared/ui/validation/decorators/is-string-or-null-but-defined.decorator';

export class OrderRequestDTO {
  @IsStringOrNullButDefined()
  toRestaurant: string | null;

  @IsStringOrNullButDefined()
  toDriver: string | null;
}

export class PlaceOrderDTO {
  @ValidateNested()
  @Type(() => OrderRequestDTO)
  request: OrderRequestDTO;
}
