import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponEntity } from './orm-entities/coupon.orm-entity';
import { CouponCodeEntity } from './orm-entities/coupon-code.orm-entity';
import { CouponDiscountOptionEntity } from './orm-entities/coupon-discount-option.orm-entity';
import { CouponCodeRepository } from '../application/ports/coupon-code.repository';
import {
  CouponCodeDomainMapper,
  CouponCodeOrmRepository,
} from './repositories/coupon-code.orm-repository';
import { CouponRepository } from '../application/ports/coupon.repository';
import {
  CouponDomainMapper,
  CouponOrmRepository,
} from './repositories/coupon.orm-repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CouponEntity,
      CouponCodeEntity,
      CouponDiscountOptionEntity,
    ]),
  ],
  providers: [
    CouponDomainMapper,
    CouponCodeDomainMapper,
    {
      provide: CouponCodeRepository,
      useClass: CouponCodeOrmRepository,
    },
    {
      provide: CouponRepository,
      useClass: CouponOrmRepository,
    },
  ],
  exports: [],
})
export class CouponInfrastructureModule {}
