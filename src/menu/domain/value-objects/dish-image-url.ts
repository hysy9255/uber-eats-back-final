import { BadRequestException } from '@nestjs/common';

export class DishImageUrl {
  readonly value: string | null;

  constructor(value: string | null) {
    if (value === null) {
      this.value = value;
    } else {
      const trimmedUrl = value.trim();

      try {
        new URL(trimmedUrl);
      } catch {
        throw new BadRequestException('Image URL must be a valid URL');
      }

      this.value = trimmedUrl;
    }
  }
}
