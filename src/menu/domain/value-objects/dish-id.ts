import { v4 as uuidv4 } from 'uuid';

export class DishId {
  private readonly __brand!: 'DishId';
  constructor(readonly value: string) {}

  static generate() {
    return new DishId(uuidv4());
  }

  equals(other: DishId) {
    return this.value === other.value;
  }
}
