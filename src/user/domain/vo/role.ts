import { UserRole } from 'src/auth/application/ports/find-user';

export class Role {
  readonly value: UserRole;

  constructor(userRole: UserRole) {
    this.value = userRole;
  }
}
