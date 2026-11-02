export class StreetAddress {
  readonly value: string;
  constructor(value: string) {
    this.value = value.trim().toLowerCase();
  }
}
