import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from 'src/auth/application/ports/find-user';
import { ImageUrl } from 'src/shared/vo/image-url';
import { User } from 'src/user/domain/user';
import { Email } from 'src/user/domain/vo/email';
import { Password } from 'src/user/domain/vo/password';
import { PhoneNumber } from 'src/user/domain/vo/phone-number';
import { Role } from 'src/user/domain/vo/role';
import { UserId } from 'src/user/domain/vo/user-id';
import { UserName } from 'src/user/domain/vo/user-name';
import { AccountRegistrationRepository } from './ports/account-registration.repository';
import { PasswordHash } from 'src/user/domain/vo/password-hash';
import * as bcrypt from 'bcrypt';
import { ClientId } from 'src/client/domain/vo/client-id';
import { OwnerId } from 'src/owner/domain/owner-id';

@Injectable()
export class AccountRegistrationService {
  constructor(
    private readonly accountRegistrationRepo: AccountRegistrationRepository,
  ) {}

  async registerClient(
    email: Email,
    password: Password,
    name: UserName,
    phoneNumber: PhoneNumber,
    profileImage: ImageUrl,
  ): Promise<{ clientId: ClientId }> {
    const exists = await this.accountRegistrationRepo.existsByEmail(email);
    if (exists) throw new ConflictException('Email already exists');

    const clientUser = new User(
      UserId.generate(),
      email,
      new PasswordHash(await bcrypt.hash(password.value, 10)),
      new Role(UserRole.Client),
      name,
      phoneNumber,
      profileImage,
    );

    return await this.accountRegistrationRepo.saveClientUser(clientUser);
  }

  async registerOwner(
    email: Email,
    password: Password,
    name: UserName,
    phoneNumber: PhoneNumber,
    profileImage: ImageUrl,
  ): Promise<{ ownerId: OwnerId }> {
    const exists = await this.accountRegistrationRepo.existsByEmail(email);
    if (exists) throw new ConflictException('Email already exists');

    const ownerUser = new User(
      UserId.generate(),
      email,
      new PasswordHash(await bcrypt.hash(password.value, 10)),
      new Role(UserRole.Owner),
      name,
      phoneNumber,
      profileImage,
    );

    return await this.accountRegistrationRepo.saveOwnerUser(ownerUser);
  }
}
