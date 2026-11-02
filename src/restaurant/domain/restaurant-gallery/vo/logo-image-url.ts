import { BadRequestException } from '@nestjs/common';

export class LogoImageUrl {
  private readonly _value: string | null;
  constructor(value: string | null) {
    if (value === null) {
      this._value = null;
      return;
    }
    const trimmedUrl = value.trim();

    if (!trimmedUrl) {
      throw new BadRequestException('Image URL cannot be empty');
    }

    try {
      new URL(trimmedUrl);
    } catch {
      throw new BadRequestException('Image URL must be a valid URL');
    }

    this._value = trimmedUrl;
  }

  get value() {
    return this._value;
  }
}
