export class CategoryName {
  readonly value: string;

  constructor(value: string) {
    this.value = value.trim().toLowerCase();
  }

  equals(other: CategoryName) {
    return this.value === other.value;
  }
}
