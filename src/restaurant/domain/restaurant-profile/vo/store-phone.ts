import { BadRequestException } from '@nestjs/common';

export class StorePhone {
  readonly value: string;

  constructor(value: string) {
    const normalized = value.replace(/[^\d]/g, '');

    if (normalized.length < 9 || normalized.length > 11) {
      throw new BadRequestException('Invalid store phone number');
    }

    this.value = normalized;
  }

  equals(other: StorePhone) {
    return this.value === other.value;
  }
}
