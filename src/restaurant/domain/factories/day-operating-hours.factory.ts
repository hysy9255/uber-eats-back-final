import { DayOperatingHours } from '../operating-hours/day-operating-hours';
import { DayOfWeek, DayOfWeekType } from '../operating-hours/vo/day-of-week';
import { IsClosed } from '../operating-hours/vo/is-closed';
import { LocalTime } from '../operating-hours/vo/local-time';

export class DayOperatingHoursFactory {
  static create(
    dayOfWeek: DayOfWeekType,
    isClosed: boolean,
    openTime: string | null,
    closeTime: string | null,
  ): DayOperatingHours {
    return new DayOperatingHours(
      new DayOfWeek(dayOfWeek),
      new IsClosed(isClosed),
      openTime === null ? null : new LocalTime(openTime),
      closeTime === null ? null : new LocalTime(closeTime),
    );
  }
}
