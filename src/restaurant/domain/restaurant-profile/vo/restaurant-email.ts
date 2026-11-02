import { BadRequestException } from '@nestjs/common';

export class RestaurantEmail {
  readonly value: string;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      throw new BadRequestException('Invalid restaurant email');
    }

    this.value = normalized;
  }

  equals(other: RestaurantEmail) {
    return this.value === other.value;
  }
}
