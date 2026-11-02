export class DiscountPolicy {
  constructor(
    public readonly discountRate: number,
    public readonly minOrderPrice: number,
    public readonly validDaysAfterAssign: number,
  ) {}
}
