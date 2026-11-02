import { IsEmail } from 'class-validator';

export class CheckEmailAvailabilityQueryDTO {
  @IsEmail()
  email: string;
}

export class CheckEmailAvailabilityResponseDTO {
  available: boolean;

  constructor(init: { available: boolean }) {
    this.available = init.available;
  }
}
