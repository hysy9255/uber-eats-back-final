export abstract class FindOwnerRestaurant {
  abstract findByOwnerUserId(
    userId: string,
  ): Promise<{ restaurantId: string } | null>;
}
