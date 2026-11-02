import { Coupon } from '../../domain/coupon';

export abstract class CouponRepository {
  abstract findCouponById(couponId: string): Promise<Coupon | null>;
  abstract save(coupon: Coupon): Promise<void>;
}
