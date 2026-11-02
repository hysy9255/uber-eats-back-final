import { BadRequestException } from '@nestjs/common';

export class WebsiteUrl {
  readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
      throw new BadRequestException('Website URL is required');
    }

    let url: URL;

    try {
      url = new URL(trimmed);
    } catch {
      throw new BadRequestException('Invalid website URL');
    }

    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new BadRequestException('Website URL must use http or https');
    }

    this.value = url.toString();
  }
}
