import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Password } from '../domain/vo/password';
import * as bcrypt from 'bcrypt';
import { PasswordHash } from '../domain/vo/password-hash';
import { UserRepository } from './ports/user.repository';
import { Email } from '../domain/vo/email';
import { CheckEmailAvailabilityResponseDTO } from '../ui/dtos/check-email-availability.dto';

export type ChangePasswordProps = {
  password: PasswordHash;
  newPassword: Password;
};

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async checkEmailAvailability(
    email: Email,
  ): Promise<CheckEmailAvailabilityResponseDTO> {
    const exists = await this.userRepo.findByEmail(email);
    return new CheckEmailAvailabilityResponseDTO({ available: !exists });
  }

  // async changePassword(userId: string, props: ChangePasswordProps) {
  //   const user = await this.userRepo.findById(userId);

  //   const match = await bcrypt.compare(
  //     props.password.value,
  //     user.password.value,
  //   );
  //   if (!match) throw new UnauthorizedException('Wrong password');

  //   user.changePassword(
  //     new PasswordHash(await bcrypt.hash(props.newPassword.value, 10)),
  //   );

  //   await this.userRepo.save(user);
  // }

  // async withdraw(userId: string) {}
}
