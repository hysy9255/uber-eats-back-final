import { ConflictException } from '@nestjs/common';
import { CouponCode, CouponCodeStatus } from './coupon-code';
import { UsedCouponCode } from './used-coupon-code';
import { DiscountPolicy } from '../policies/discount.policy';

export class AssignedCouponCode extends CouponCode {
  readonly status = CouponCodeStatus.Assigned;

  private constructor(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
    public readonly clientId: string,
    public readonly expire: Date,
  ) {
    super(code, couponId, discountPolicy);
  }

  static restore(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
    clientId: string,
    expire: Date,
  ) {
    return new AssignedCouponCode(
      code,
      couponId,
      discountPolicy,
      clientId,
      expire,
    );
  }

  static createFromUnassigned(
    code: string,
    couponId: string,
    discountPolicy: DiscountPolicy,
    clientId: string,
    expire: Date,
  ): AssignedCouponCode {
    return new AssignedCouponCode(
      code,
      couponId,
      discountPolicy,
      clientId,
      expire,
    );
  }

  private isExpired(): boolean {
    return Date.now() > this.expire.getTime();
  }

  private calculateDiscount(orderPrice: number) {
    if (orderPrice < this.minOrderPrice) {
      throw new ConflictException('Minimum order price is not met');
    }
    return Math.floor(orderPrice * this.discountPolicy.discountRate);
  }

  useBy(
    clientId: string,
    orderPrice: number,
  ): {
    usedCoupon: UsedCouponCode;
    discountAmount: number;
  } {
    if (this.clientId !== clientId) {
      throw new ConflictException('This coupon does not belong to the client');
    }
    if (this.isExpired()) {
      throw new ConflictException('This coupon is expired');
    }
    if (orderPrice < this.discountPolicy.minOrderPrice) {
      throw new ConflictException('Min order price is not met');
    }

    const discountAmount = this.calculateDiscount(orderPrice);

    return {
      usedCoupon: UsedCouponCode.createFromAssigned(
        this.code,
        this.couponId,
        this.discountPolicy,
        clientId,
        this.expire,
        new Date(),
      ),
      discountAmount,
    };
  }
}
