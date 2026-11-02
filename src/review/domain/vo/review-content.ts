export class ReviewContent {
  constructor(private readonly _value: string) {
    const value = _value.trim();

    if (value.length < 5 || value.length > 50) {
      throw new Error('Review content must be between 5 and 50 characters.');
    }

    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}
