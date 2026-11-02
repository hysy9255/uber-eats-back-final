import { DiscountPolicy } from '../policies/discount.policy';

export enum CouponCodeStatus {
  Unassigned = 'UNASSIGNED',
  Assigned = 'ASSIGNED',
  Used = 'USED',
}

export abstract class CouponCode {
  protected constructor(
    public readonly code: string,
    public readonly couponId: string,
    protected readonly discountPolicy: DiscountPolicy,
  ) {}

  abstract readonly status: CouponCodeStatus;

  get discount() {
    return this.discountPolicy.discountRate;
  }

  get minOrderPrice() {
    return this.discountPolicy.minOrderPrice;
  }
}
