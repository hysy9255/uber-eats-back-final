import { BadRequestException } from '@nestjs/common';
import { DayOfWeek } from './vo/day-of-week';
import { IsClosed } from './vo/is-closed';
import { LocalTime } from './vo/local-time';

export class DayOperatingHours {
  constructor(
    readonly dayOfWeek: DayOfWeek,
    private _isClosed: IsClosed,
    private _openTime: LocalTime | null,
    private _closeTime: LocalTime | null,
  ) {
    this.ensureValidHours();
  }

  get isClosed() {
    return this._isClosed;
  }

  get openTime() {
    if (this._openTime === null) {
      return null;
    }
    return this._openTime;
  }

  get closeTime() {
    if (this._closeTime === null) {
      return null;
    }
    return this._closeTime;
  }

  private ensureValidHours() {
    if (this._isClosed.value) {
      if (this._openTime || this._closeTime) {
        throw new BadRequestException('Closed day cannot have operating hours');
      }
      return;
    }
    if (!this._openTime || !this._closeTime) {
      throw new BadRequestException(
        'Open day requires both openTime and closeTime',
      );
    }
    if (!this._openTime.isBefore(this._closeTime)) {
      throw new BadRequestException(
        'Open time must be earlier than close time',
      );
    }
  }
}
