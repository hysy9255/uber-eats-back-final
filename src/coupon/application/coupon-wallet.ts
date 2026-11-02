import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CouponCode,
  CouponCodeStatus,
} from '../domain/coupon-code/coupon-code';
import { AssignedCouponCode } from '../domain/coupon-code/assigned-coupon-code';
import { CouponCodeRepository } from './ports/coupon-code.repository';
import {
  CouponUsedStatus,
  ViewMyCouponDTO,
} from '../ui/dtos/view-my-coupon.dto';
import { UnassignedCouponCode } from '../domain/coupon-code/unassigned-coupon-code';
import { UsedCouponCode } from '../domain/coupon-code/used-coupon-code';
import { ClientId } from 'src/client/domain/vo/client-id';

@Injectable()
export class CouponWallet {
  constructor(private readonly repository: CouponCodeRepository) {}

  async useCoupon(
    code: string,
    clientId: string,
    orderPrice: number,
  ): Promise<number> {
    const couponCode = await this.findCouponCode(code);

    switch (true) {
      case couponCode instanceof UnassignedCouponCode:
        throw new ConflictException('The client does not own this coupon');
      case couponCode instanceof UsedCouponCode:
        throw new ConflictException('This coupon is no longer valid');
      case couponCode instanceof AssignedCouponCode: {
        const { usedCoupon, discountAmount } = couponCode.useBy(
          clientId,
          orderPrice,
        );
        await this.repository.saveOne(usedCoupon);
        return discountAmount;
      }
      default:
        throw new InternalServerErrorException(
          'Internal server error using coupon',
        );
    }
  }

  async viewMyCoupons(clientId: ClientId): Promise<ViewMyCouponDTO[]> {
    const entities = await this.repository.couponViewsForClient(clientId.value);

    return entities.map((entity) => {
      return new ViewMyCouponDTO(
        entity.code,
        entity.coupon.type,
        entity.coupon.description,
        entity.expire,
        entity.discount,
        entity.minOrderPrice,
        entity.status === CouponCodeStatus.Used
          ? CouponUsedStatus.Used
          : CouponUsedStatus.NotUsed,
        entity.usedAt,
      );
    });
  }

  private async findCouponCode(code: string): Promise<CouponCode> {
    const couponCode = await this.repository.findByCode(code);
    if (!couponCode) throw new NotFoundException('Coupon Code Not Found');
    return couponCode;
  }
}
