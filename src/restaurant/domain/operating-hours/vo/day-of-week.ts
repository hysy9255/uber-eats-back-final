export enum DayOfWeekType {
  Mon = 'mon',
  Tue = 'tue',
  Wed = 'wed',
  Thu = 'thu',
  Fri = 'fri',
  Sat = 'sat',
  Sun = 'sun',
}

export class DayOfWeek {
  constructor(readonly value: DayOfWeekType) {}
}
