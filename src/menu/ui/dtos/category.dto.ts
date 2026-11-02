import { IsString } from 'class-validator';

export class AddCategoryDTO {
  @IsString()
  categoryName: string;
}

export class UpdateCategoryDTO {
  @IsString()
  newCategoryName: string;
}
