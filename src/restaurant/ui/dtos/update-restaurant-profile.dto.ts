import { IsStringIfDefined } from 'src/shared/ui/validation/decorators/is-string-if-defined.decorator';

export class UpdateRestaurantProfileDTO {
  @IsStringIfDefined()
  newName?: string;

  @IsStringIfDefined()
  newCuisineType?: string;

  @IsStringIfDefined({ allowNull: true })
  newEmail?: string | null;

  @IsStringIfDefined({ allowNull: true })
  newInstagram?: string | null;

  @IsStringIfDefined({ allowNull: true })
  newWebsite?: string | null;

  @IsStringIfDefined({ allowNull: true })
  newStorePhone?: string | null;
}
