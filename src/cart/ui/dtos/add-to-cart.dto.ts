import { IsNumber, IsString } from 'class-validator';

export class AddToCartDTO {
  @IsString()
  dishId: string;

  @IsNumber()
  quantity: number;
}
