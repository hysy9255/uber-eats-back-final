import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CouponEntity } from './coupon.orm-entity';
import {
  CouponCode,
  CouponCodeStatus,
} from '../../domain/coupon-code/coupon-code';
import { UnassignedCouponCode } from '../../domain/coupon-code/unassigned-coupon-code';
import { AssignedCouponCode } from '../../domain/coupon-code/assigned-coupon-code';
import { UsedCouponCode } from '../../domain/coupon-code/used-coupon-code';
import { InternalServerErrorException } from '@nestjs/common';

@Entity()
export class CouponCodeEntity {
  @PrimaryColumn()
  code: string;

  @Column()
  couponId: string;

  @Column({ type: 'enum', enum: CouponCodeStatus })
  status: CouponCodeStatus;

  @Column({ nullable: true })
  clientId: string | null;

  @Column({ nullable: true })
  expire: Date | null;

  @Column({ nullable: true })
  usedAt: Date | null;

  @Column({
    type: 'float',
  })
  discount: number;

  @Column()
  minOrderPrice: number;

  @Column()
  validDaysAfterAssign: number;

  @ManyToOne(() => CouponEntity, (coupon) => coupon.instances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'couponId' })
  coupon: CouponEntity;

  static map(domain: CouponCode): CouponCodeEntity {
    const entity = new CouponCodeEntity();
    entity.code = domain.code;
    entity.couponId = domain.couponId;
    entity.discount = domain.discount;
    entity.minOrderPrice = domain.minOrderPrice;
    entity.status = domain.status;

    if (domain instanceof UnassignedCouponCode) {
      entity.clientId = null;
      entity.expire = null;
      entity.usedAt = null;
      return entity;
    }

    if (domain instanceof AssignedCouponCode) {
      entity.clientId = domain.clientId;
      entity.expire = domain.expire;
      entity.usedAt = null;
      return entity;
    }

    if (domain instanceof UsedCouponCode) {
      entity.clientId = domain.clientId;
      entity.expire = domain.expire;
      entity.usedAt = domain.usedAt;
      return entity;
    }

    throw new InternalServerErrorException('Unknown coupon domain type');
  }
}
