import { BadRequestException } from '@nestjs/common';

export class Zip {
  readonly value: string;
  constructor(value: string) {
    this.value = this.ensureFormat(value);
  }

  private ensureFormat(value: string): string {
    const zip = value.trim();

    if (!/^\d{5}$/.test(zip)) {
      throw new BadRequestException('Zip code must be exactly 5 digits.');
    }

    return zip;
  }
}
