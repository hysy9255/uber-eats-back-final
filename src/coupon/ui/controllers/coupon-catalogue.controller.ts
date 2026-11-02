import { Body, Controller, Param, Post } from '@nestjs/common';
import { CouponCatalogue } from '../../application/coupon-catalogue';
import { CreateCouponDTO } from '../dtos/create-coupon.dto';
import { AddCouponDTO } from '../dtos/add-coupon.dto';

@Controller('coupons')
export class CouponCatalogueController {
  constructor(private readonly catalogue: CouponCatalogue) {}

  @Post()
  async createCoupon(@Body() dto: CreateCouponDTO): Promise<void> {
    const coupon = dto.coupon;
    const couponInstances = dto.couponInstances;
    const { couponId } = await this.catalogue.addCoupon(
      coupon.type,
      coupon.description,
      coupon.discountOptions,
      coupon.daysValidAfterAssign,
    );
    for (let i = 0; i < couponInstances.length; i++) {
      await this.catalogue.addCouponCodes(
        couponId,
        couponInstances[i].amount,
        couponInstances[i].discount,
      );
    }
  }

  @Post('/:couponId/codes')
  async addUpCoupons(
    @Param('couponId') couponId: string,
    @Body() dto: AddCouponDTO,
  ): Promise<void> {
    const couponInstances = dto.couponInstances;
    for (let i = 0; i < couponInstances.length; i++) {
      await this.catalogue.addCouponCodes(
        couponId,
        couponInstances[i].amount,
        couponInstances[i].discount,
      );
    }
  }
}
