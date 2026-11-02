import { Module } from '@nestjs/common';
import { CouponApplicationModule } from './application/coupon-application.module';
import { CouponInfrastructureModule } from './infra/coupon-infrastructure.module';
import { CouponUiRestModule } from './ui/coupon-ui-rest.module';

@Module({
  imports: [
    CouponUiRestModule,
    CouponApplicationModule,
    CouponInfrastructureModule,
  ],
  providers: [],
  exports: [CouponApplicationModule],
})
export class CouponModule {}
