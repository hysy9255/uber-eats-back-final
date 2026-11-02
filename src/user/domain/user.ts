import { ImageUrl } from 'src/shared/vo/image-url';
import { UserId } from './vo/user-id';
import { Email } from './vo/email';
import { PasswordHash } from './vo/password-hash';
import { Role } from './vo/role';
import { UserName } from './vo/user-name';
import { PhoneNumber } from './vo/phone-number';

export class User {
  constructor(
    private readonly _userId: UserId,
    private _email: Email,
    private _password: PasswordHash,
    private _role: Role,
    private _name: UserName,
    private _phoneNumber: PhoneNumber,
    private _profileImage: ImageUrl,
  ) {}

  changePassword(passwordHash: PasswordHash) {
    this._password = passwordHash;
  }

  get userId() {
    return this._userId;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get role() {
    return this._role;
  }

  get name() {
    return this._name;
  }

  get phoneNumber() {
    return this._phoneNumber;
  }

  get profileImage() {
    return this._profileImage;
  }
}
