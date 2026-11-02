import { Module } from '@nestjs/common';
import { CouponCatalogue } from './coupon-catalogue';
import { CouponWallet } from './coupon-wallet';

@Module({
  imports: [],
  providers: [CouponCatalogue, CouponWallet],
  exports: [CouponWallet],
})
export class CouponApplicationModule {}
