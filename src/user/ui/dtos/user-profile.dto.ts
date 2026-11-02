import { UserRole } from 'src/auth/application/ports/find-user';

export class UserProfileDTO {
  email: string;
  role: UserRole;
  name: string;
  phoneNumber: string;
  profileImgUrl: string | null;

  constructor(
    email: string,
    role: UserRole,
    name: string,
    phoneNumber: string,
    profileImgUrl: string | null,
  ) {
    this.email = email;
    this.role = role;
    this.name = name;
    this.phoneNumber = phoneNumber;
    this.profileImgUrl = profileImgUrl;
  }
}
