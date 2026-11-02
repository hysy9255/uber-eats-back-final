import { IsNumber, IsString } from 'class-validator';

export class WriteReviewDTO {
  @IsString()
  content: string;

  @IsNumber()
  rating: number;
}
