import { v4 as uuidv4 } from 'uuid';

export class CategoryId {
  constructor(readonly value: string) {}

  static generate() {
    return new CategoryId(uuidv4());
  }

  equals(other: CategoryId) {
    return this.value === other.value;
  }
}
