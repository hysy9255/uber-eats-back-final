import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CouponCodeEntity } from '../orm-entities/coupon-code.orm-entity';
import { Repository } from 'typeorm';
import {
  CouponCode,
  CouponCodeStatus,
} from '../../domain/coupon-code/coupon-code';
import { UnassignedCouponCode } from '../../domain/coupon-code/unassigned-coupon-code';
import { AssignedCouponCode } from '../../domain/coupon-code/assigned-coupon-code';
import { UsedCouponCode } from '../../domain/coupon-code/used-coupon-code';
import { DiscountPolicy } from 'src/coupon/domain/policies/discount.policy';
import { CouponCodeRepository } from 'src/coupon/application/ports/coupon-code.repository';

@Injectable()
export class CouponCodeDomainMapper {
  map(entity: CouponCodeEntity): CouponCode {
    switch (entity.status) {
      case CouponCodeStatus.Unassigned:
        return UnassignedCouponCode.restore(
          entity.code,
          entity.couponId,
          new DiscountPolicy(
            entity.discount,
            entity.minOrderPrice,
            entity.validDaysAfterAssign,
          ),
        );

      case CouponCodeStatus.Assigned: {
        if (!entity.clientId) throw new InternalServerErrorException('');
        if (!entity.expire) throw new InternalServerErrorException('');
        return AssignedCouponCode.restore(
          entity.code,
          entity.couponId,
          new DiscountPolicy(
            entity.discount,
            entity.minOrderPrice,
            entity.validDaysAfterAssign,
          ),
          entity.clientId,
          entity.expire,
        );
      }

      case CouponCodeStatus.Used: {
        if (!entity.clientId) throw new InternalServerErrorException('');
        if (!entity.expire) throw new InternalServerErrorException('');
        if (!entity.usedAt) throw new InternalServerErrorException('');
        return UsedCouponCode.restore(
          entity.code,
          entity.couponId,
          new DiscountPolicy(
            entity.discount,
            entity.minOrderPrice,
            entity.validDaysAfterAssign,
          ),
          entity.clientId,
          entity.expire,
          entity.usedAt,
        );
      }
    }
  }
}

@Injectable()
export class CouponCodeOrmRepository extends CouponCodeRepository {
  constructor(
    @InjectRepository(CouponCodeEntity)
    private readonly repo: Repository<CouponCodeEntity>,
    private readonly mapper: CouponCodeDomainMapper,
  ) {
    super();
  }

  async couponViewsForClient(clientId: string): Promise<CouponCodeEntity[]> {
    return await this.repo.find({
      where: { clientId },
      relations: {
        coupon: true,
      },
    });
  }

  async findByCode(code: string): Promise<CouponCode | null> {
    const entity = await this.repo.findOne({ where: { code } });
    if (entity === null) return null;
    return this.mapper.map(entity);
  }

  async save(instances: CouponCode[]): Promise<void> {
    const entities = instances.map((instance) =>
      CouponCodeEntity.map(instance),
    );
    await this.repo.save(entities);
  }

  async saveOne(couponInstance: CouponCode): Promise<void> {
    const entity = CouponCodeEntity.map(couponInstance);
    await this.repo.save(entity);
  }
}
