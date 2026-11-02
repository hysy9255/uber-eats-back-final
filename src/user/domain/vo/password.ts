import { BadRequestException } from '@nestjs/common';

export class Password {
  readonly value: string;

  constructor(password: string) {
    if (password.length <= 3) {
      throw new BadRequestException('Password should be longer than 3');
    }

    this.value = password;
  }
}
