import { BadRequestException } from '@nestjs/common';

export class Price {
  readonly value: number;

  constructor(value: number) {
    if (!Number.isFinite(value)) {
      throw new BadRequestException('Price must be a valid number');
    }

    if (value <= 0) {
      throw new BadRequestException('Price should be bigger than 0');
    }

    const scaled = value * 100;

    const hasMoreThanTwoDecimalPlaces =
      Math.abs(scaled - Math.round(scaled)) > 1e-8;

    if (hasMoreThanTwoDecimalPlaces) {
      throw new BadRequestException('Price can have at most 2 decimal places');
    }

    this.value = Math.round(value * 100) / 100;
  }
}
