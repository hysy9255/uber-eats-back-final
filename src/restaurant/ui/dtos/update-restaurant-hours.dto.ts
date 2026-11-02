// import { Type } from 'class-transformer';
// import { IsArray, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { IsBoolean, IsEnum } from 'class-validator';
import { DayOfWeekType } from 'src/restaurant/domain/operating-hours/vo/day-of-week';
import { IsStringOrNullButDefined } from 'src/shared/ui/validation/decorators/is-string-or-null-but-defined.decorator';

export class UpdateRestaurantHoursDTO {
  @IsEnum(DayOfWeekType)
  dayOfWeek: DayOfWeekType;

  @IsBoolean()
  isClosed: boolean;

  @IsStringOrNullButDefined()
  openTime: string | null;

  @IsStringOrNullButDefined()
  closeTime: string | null;
}
