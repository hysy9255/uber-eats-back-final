import { Module } from '@nestjs/common';
import { CouponCatalogueController } from './controllers/coupon-catalogue.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [CouponCatalogueController],
  exports: [],
})
export class CouponUiRestModule {}
