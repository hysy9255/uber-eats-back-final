import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { CouponCodeEntity } from './coupon-code.orm-entity';
import { Coupon } from '../../domain/coupon';
import { CouponDiscountOptionEntity } from './coupon-discount-option.orm-entity';

@Entity()
export class CouponEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column()
  minOrderPrice: number;

  @Column()
  validDaysAfterAssign: number;

  @OneToMany(() => CouponCodeEntity, (instance) => instance.coupon)
  instances: CouponCodeEntity[];

  @OneToMany(
    () => CouponDiscountOptionEntity,
    (discountOption) => discountOption.coupon,
  )
  discountOptions: CouponDiscountOptionEntity[];

  static map(domain: Coupon): CouponEntity {
    const entity = new CouponEntity();
    entity.id = domain.id;
    entity.type = domain.type;
    return entity;
  }
}
