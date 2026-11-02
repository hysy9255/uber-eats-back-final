import { CouponCode } from 'src/coupon/domain/coupon-code/coupon-code';
import { CouponCodeEntity } from 'src/coupon/infra/orm-entities/coupon-code.orm-entity';

export abstract class CouponCodeRepository {
  abstract save(instances: CouponCode[]): Promise<void>;
  abstract saveOne(instance: CouponCode): Promise<void>;

  abstract findByCode(code: string): Promise<CouponCode | null>;

  abstract couponViewsForClient(clientId: string): Promise<CouponCodeEntity[]>;
}
