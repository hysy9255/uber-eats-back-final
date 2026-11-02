export function mapIfDefined<TInput, TResult>(
  value: TInput | undefined,
  factory: (value: TInput) => TResult,
): TResult | undefined {
  return value === undefined ? undefined : factory(value);
}
