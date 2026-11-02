import { BadRequestException } from '@nestjs/common';

export class PhoneNumber {
  readonly value: string;

  constructor(phoneNumber: string) {
    const normalized = phoneNumber.replace(/[\s-]/g, '');

    if (!normalized) {
      throw new BadRequestException('Phone number is required');
    }

    if (!/^01[016789]\d{7,8}$/.test(normalized)) {
      throw new BadRequestException('Invalid Korean mobile phone number');
    }

    this.value = normalized;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }

  get formatted(): string {
    if (this.value.length === 10) {
      return `${this.value.slice(0, 3)}-${this.value.slice(3, 6)}-${this.value.slice(6)}`;
    }

    return `${this.value.slice(0, 3)}-${this.value.slice(3, 7)}-${this.value.slice(7)}`;
  }
}
