import { BadRequestException } from '@nestjs/common';

export class ImageUrl {
  constructor(private readonly _value: string | null) {}

  static create(url: string | null) {
    if (url === null) {
      return new ImageUrl(null);
    }
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      throw new BadRequestException('Image URL cannot be empty');
    }

    try {
      new URL(trimmedUrl);
    } catch {
      throw new BadRequestException('Image URL must be a valid URL');
    }

    return new ImageUrl(url);
  }

  get value() {
    return this._value;
  }
}
