import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Coupon } from '../domain/coupon';
import { CouponRepository } from './ports/coupon.repository';
import { CouponCodeRepository } from './ports/coupon-code.repository';
import { UnassignedCouponCode } from '../domain/coupon-code/unassigned-coupon-code';

@Injectable()
export class CouponCatalogue {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly couponCodeRepository: CouponCodeRepository,
  ) {}

  async addCoupon(
    type: string,
    description: string,
    discountOptions: { discountRate: number; minOrderPrice: number }[],
    daysValidAfterAssign: number,
  ): Promise<{ couponId: string }> {
    const id = uuidv4();

    const coupon = Coupon.create({
      id,
      type,
      description,
      discountOptions,
      daysValidAfterAssign,
    });
    await this.couponRepository.save(coupon);
    return { couponId: id };
  }

  async addCouponCodes(couponId: string, amount: number, discountRate: number) {
    const coupon = await this.couponRepository.findCouponById(couponId);
    if (coupon === null) throw new NotFoundException('');
    const couponCode = coupon.createUnassignedCouponCodes(amount, discountRate);
    await this.couponCodeRepository.save(couponCode);
  }

  async grantToClient(clientId: string, code: string) {
    const couponCode = await this.couponCodeRepository.findByCode(code);
    if (couponCode === null) throw new NotFoundException();
    if (!(couponCode instanceof UnassignedCouponCode)) {
      throw new ConflictException('Can not assign this coupon to client');
    }
    const assigned = couponCode.assignTo(clientId);
    await this.couponCodeRepository.saveOne(assigned);
  }

  async viewCoupons() {}
}
