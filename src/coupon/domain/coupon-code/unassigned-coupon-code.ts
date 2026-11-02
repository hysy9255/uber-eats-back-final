import { AssignedCouponCode } from './assigned-coupon-code';
import { CouponCode, CouponCodeStatus } from './coupon-code';
import { generateExpire } from '../utils/generate-expire-date';
import { DiscountOption } from '../coupon';
import { generateCouponCode } from '../utils/generate-coupon-code';
import { DiscountPolicy } from '../policies/discount.policy';

export class UnassignedCouponCode extends CouponCode {
  readonly status = CouponCodeStatus.Unassigned;

  private constructor(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
  ) {
    super(code, couponId, discountPolicy);
  }

  static create(
    couponId: string,
    discountOption: DiscountOption,
    validDaysAfterAssign: number,
  ) {
    return new UnassignedCouponCode(
      generateCouponCode(),
      couponId,
      new DiscountPolicy(
        discountOption.discountRate,
        discountOption.minOrderPrice,
        validDaysAfterAssign,
      ),
    );
  }

  assignTo(clientId: string) {
    return AssignedCouponCode.createFromUnassigned(
      this.code,
      this.couponId,
      this.discountPolicy,
      clientId,
      generateExpire(this.discountPolicy.validDaysAfterAssign),
    );
  }

  static restore(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
  ) {
    return new UnassignedCouponCode(code, couponId, discountPolicy);
  }
}
