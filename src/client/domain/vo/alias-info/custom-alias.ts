export class CustomAlias {
  readonly value: string | null;

  constructor(value: string | null) {
    this.value = value === null ? null : value.trim().toLowerCase();
  }
}
