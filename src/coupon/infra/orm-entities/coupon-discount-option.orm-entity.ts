import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CouponEntity } from './coupon.orm-entity';
import { Coupon } from 'src/coupon/domain/coupon';

@Entity()
export class CouponDiscountOptionEntity {
  @Column()
  discount: number;

  @Column()
  minOrderPrice: number;

  @Column()
  couponId: string;

  @ManyToOne(() => CouponEntity, (coupon) => coupon.discountOptions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'couponId' })
  coupon: CouponEntity;

  private constructor(
    discount: number,
    minOrderPrice: number,
    couponId: string,
  ) {
    this.discount = discount;
    this.minOrderPrice = minOrderPrice;
    this.couponId = couponId;
  }

  static map(coupon: Coupon): CouponDiscountOptionEntity[] {
    return coupon.discountOptions.map((option) => {
      return new CouponDiscountOptionEntity(
        option.discountRate,
        option.minOrderPrice,
        coupon.id,
      );
    });
  }
}
