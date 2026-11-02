import { DayOfWeekType } from 'src/restaurant/domain/operating-hours/vo/day-of-week';

export class DayOperatingHoursDTO {
  dayOfWeek: DayOfWeekType;
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;

  constructor(
    dayOfWeek: DayOfWeekType,
    isClosed: boolean,
    openTime: string | null,
    closeTime: string | null,
  ) {
    this.dayOfWeek = dayOfWeek;
    this.isClosed = isClosed;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }
}
