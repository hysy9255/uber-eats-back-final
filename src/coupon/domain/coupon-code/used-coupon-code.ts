import { DiscountPolicy } from '../policies/discount.policy';
import { CouponCode, CouponCodeStatus } from './coupon-code';

export class UsedCouponCode extends CouponCode {
  readonly status = CouponCodeStatus.Used;

  private constructor(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
    public readonly clientId: string,
    public readonly expire: Date,
    public readonly usedAt: Date,
  ) {
    super(code, couponId, discountPolicy);
  }

  static restore(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
    clientId: string,
    expire: Date,
    usedAt: Date,
  ) {
    return new UsedCouponCode(
      code,
      couponId,
      discountPolicy,
      clientId,
      expire,
      usedAt,
    );
  }

  static createFromAssigned(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
    clientId: string,
    expire: Date,
    usedAt: Date,
  ): UsedCouponCode {
    return new UsedCouponCode(
      code,
      couponId,
      discountPolicy,
      clientId,
      expire,
      usedAt,
    );
  }
}
