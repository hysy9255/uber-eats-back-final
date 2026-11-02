import { v4 as uuidv4 } from 'uuid';

export class ClientId {
  private readonly __brand!: 'ClientId';
  constructor(readonly value: string) {}

  static generate() {
    return new ClientId(uuidv4());
  }

  equals(other: ClientId) {
    return this.value === other.value;
  }
}
