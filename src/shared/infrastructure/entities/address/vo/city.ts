export class City {
  readonly value: string;
  constructor(value: string) {
    this.value = value.trim().toLowerCase();
  }
}
