import { v4 as uuidv4 } from 'uuid';

export class RestaurantId {
  private readonly __brand!: 'RestaurantId';
  constructor(readonly value: string) {}

  static generate() {
    return new RestaurantId(uuidv4());
  }

  equals(other: RestaurantId) {
    return this.value === other.value;
  }
}
