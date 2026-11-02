export class Rating {
  constructor(private readonly _value: number) {
    this.validate(_value);
  }

  get value(): number {
    return this._value;
  }

  private validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Rating must be an integer.');
    }

    if (value < 1 || value > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }
  }
}
