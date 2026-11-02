export function mapIfDefinedOrNull<TInput, TResult>(
  value: TInput | null | undefined,
  factory: (value: TInput) => TResult,
): TResult | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  return factory(value);
}
