import { BadRequestException } from '@nestjs/common';

export class LocalTime {
  readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.test(trimmed);

    if (!match) {
      throw new BadRequestException(
        'Time must be in HH:mm format, for example 09:30',
      );
    }
    this.value = value;
  }

  isBefore(other: LocalTime): boolean {
    return this.value < other.value;
  }

  isAfter(other: LocalTime): boolean {
    return this.value > other.value;
  }

  isBetween(start: LocalTime, end: LocalTime): boolean {
    return this.value >= start.value && this.value < end.value;
  }
}
