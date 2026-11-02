export function roundRating(
  rating: string | number | null | undefined,
): number | null {
  if (rating == null) {
    return null;
  }

  return Math.round(Number(rating) * 2) / 2;
}
