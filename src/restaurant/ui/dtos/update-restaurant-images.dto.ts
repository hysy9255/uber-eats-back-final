import { IsStringIfDefined } from 'src/shared/ui/validation/decorators/is-string-if-defined.decorator';

export class UpdateRestaurantImagesDTO {
  @IsStringIfDefined({ allowNull: true })
  logo?: string | null;

  @IsStringIfDefined()
  mainImage?: string;

  @IsStringIfDefined()
  sub1Image?: string;

  @IsStringIfDefined()
  sub2Image?: string;

  @IsStringIfDefined()
  bannerImage?: string;
}
