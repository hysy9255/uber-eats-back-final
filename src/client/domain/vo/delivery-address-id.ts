import { v4 as uuidv4 } from 'uuid';

export class DeliveryAddressId {
  constructor(readonly value: string) {}

  static generate() {
    return new DeliveryAddressId(uuidv4());
  }

  equals(other: DeliveryAddressId) {
    return this.value === other.value;
  }
}
