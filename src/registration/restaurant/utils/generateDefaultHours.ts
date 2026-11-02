import { DayOperatingHoursFactory } from 'src/restaurant/domain/factories/day-operating-hours.factory';
import { DayOperatingHours } from 'src/restaurant/domain/operating-hours/day-operating-hours';
import { DayOfWeekType } from 'src/restaurant/domain/operating-hours/vo/day-of-week';

export const generateDefaultHours = (): DayOperatingHours[] => {
  const days: DayOfWeekType[] = [
    DayOfWeekType.Mon,
    DayOfWeekType.Tue,
    DayOfWeekType.Wed,
    DayOfWeekType.Thu,
    DayOfWeekType.Fri,
    DayOfWeekType.Sat,
    DayOfWeekType.Sun,
  ];

  const allDaysClosed = days.map((day) =>
    DayOperatingHoursFactory.create(day, true, null, null),
  );

  return allDaysClosed;
};
