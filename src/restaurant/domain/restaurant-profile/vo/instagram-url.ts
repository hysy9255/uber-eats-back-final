import { BadRequestException } from '@nestjs/common';

export class InstagramUrl {
  readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
      throw new BadRequestException('Instagram URL is required');
    }

    let url: URL;

    try {
      url = new URL(trimmed);
    } catch {
      throw new BadRequestException('Invalid Instagram URL');
    }

    if (
      url.protocol !== 'https:' ||
      !['instagram.com', 'www.instagram.com'].includes(url.hostname)
    ) {
      throw new BadRequestException('Instagram URL must be an Instagram URL');
    }

    this.value = url.toString();
  }
}
