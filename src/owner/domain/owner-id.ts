import { v4 as uuidv4 } from 'uuid';

export class OwnerId {
  constructor(private readonly _value: string) {}

  static generate() {
    return new OwnerId(uuidv4());
  }

  get value(): string {
    return this._value;
  }
}
