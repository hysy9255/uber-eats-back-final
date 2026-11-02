import { BadRequestException } from '@nestjs/common';

export class Email {
  readonly value: string;

  constructor(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new BadRequestException('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throw new BadRequestException('Invalid email format');
    }

    this.value = normalizedEmail;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
