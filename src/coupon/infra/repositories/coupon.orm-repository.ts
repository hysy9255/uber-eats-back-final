import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponEntity } from '../orm-entities/coupon.orm-entity';
import { Repository } from 'typeorm';
import { Coupon, DiscountOption } from '../../domain/coupon';
import { CouponDiscountOptionEntity } from '../orm-entities/coupon-discount-option.orm-entity';
import { CouponRepository } from 'src/coupon/application/ports/coupon.repository';

@Injectable()
export class CouponDomainMapper {
  map(entity: CouponEntity): Coupon {
    return Coupon.create({
      id: entity.id,
      type: entity.type,
      description: entity.description,
      discountOptions: entity.discountOptions.map(
        (option) => new DiscountOption(option.discount, option.minOrderPrice),
      ),
      daysValidAfterAssign: entity.validDaysAfterAssign,
    });
  }
}

@Injectable()
export class CouponOrmRepository extends CouponRepository {
  constructor(
    private readonly domainMapper: CouponDomainMapper,
    @InjectRepository(CouponEntity)
    private readonly couponRepository: Repository<CouponEntity>,
    @InjectRepository(CouponDiscountOptionEntity)
    private readonly discountOptionRepository: Repository<CouponDiscountOptionEntity>,
  ) {
    super();
  }

  async findCouponById(couponId: string): Promise<Coupon | null> {
    const couponEntity = await this.couponRepository.findOne({
      where: { id: couponId },
    });
    if (couponEntity === null) return null;
    return this.domainMapper.map(couponEntity);
  }

  async save(coupon: Coupon) {
    const entity = CouponEntity.map(coupon);
    await this.couponRepository.save(entity);
    const discountOptionEntities = CouponDiscountOptionEntity.map(coupon);
    await this.discountOptionRepository.save(discountOptionEntities);
  }
}
