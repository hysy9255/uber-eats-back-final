import { BadRequestException } from '@nestjs/common';

export class CuisineType {
  readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim().toLowerCase();

    if (!trimmed) {
      throw new BadRequestException('Cuisine type is required');
    }

    if (trimmed.length > 50) {
      throw new BadRequestException(
        'Cuisine type must be 50 characters or fewer',
      );
    }

    this.value = trimmed;
  }

  equals(other: CuisineType) {
    return this.value === other.value;
  }
}
