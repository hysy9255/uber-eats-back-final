import { BadRequestException } from '@nestjs/common';
import { DayOperatingHours } from './day-operating-hours';
import { DayOfWeekType } from './vo/day-of-week';
import { RestaurantId } from '../restaurant/vo/restaurant-id';

export class OperatingHours {
  constructor(
    readonly restaurantId: RestaurantId,
    private _days: DayOperatingHours[],
  ) {
    this.ensureAllDaysExist();
  }

  get days() {
    return this._days;
  }

  replaceDay(updatedDay: DayOperatingHours) {
    const index = this._days.findIndex(
      (day) => day.dayOfWeek.value === updatedDay.dayOfWeek.value,
    );

    if (index === -1) {
      throw new Error('Day operating hours not found');
    }

    this._days[index] = updatedDay;
  }

  private ensureAllDaysExist() {
    const requiredDays = Object.values(DayOfWeekType);

    if (this._days.length !== requiredDays.length) {
      throw new BadRequestException(
        'Operating hours must contain exactly seven days',
      );
    }

    const registeredDays = new Set(
      this._days.map((day) => day.dayOfWeek.value),
    );

    if (registeredDays.size !== this._days.length) {
      throw new BadRequestException(
        'Operating hours cannot contain duplicate days',
      );
    }
  }
}
