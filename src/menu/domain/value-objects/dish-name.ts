export class DishName {
  readonly value: string;

  constructor(value: string) {
    this.value = value.trim().toLowerCase();
  }

  equals(other: DishName) {
    return this.value === other.value;
  }
}
