export class PasswordHash {
  readonly value: string;

  constructor(passwordHash: string) {
    this.value = passwordHash;
  }
}
