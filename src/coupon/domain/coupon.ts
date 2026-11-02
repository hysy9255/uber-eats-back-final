import { ConflictException } from '@nestjs/common';
import { UnassignedCouponCode } from './coupon-code/unassigned-coupon-code';

export class DiscountOption {
  constructor(
    public readonly discountRate: number,
    public readonly minOrderPrice: number,
  ) {}
}

export class Coupon {
  private constructor(
    public readonly id: string,
    public readonly type: string,
    public description: string,
    public discountOptions: DiscountOption[],
    public daysValidAfterAssign: number,
  ) {}

  static create(props: {
    id: string;
    type: string;
    description: string;
    discountOptions: { discountRate: number; minOrderPrice: number }[];
    daysValidAfterAssign: number;
  }) {
    this.validateUniqueDiscountRates(props.discountOptions);

    return new Coupon(
      props.id,
      props.type,
      props.description,
      props.discountOptions.map(
        (option) =>
          new DiscountOption(option.discountRate, option.minOrderPrice),
      ),
      props.daysValidAfterAssign,
    );
  }

  private static validateUniqueDiscountRates(options: DiscountOption[]) {
    const rates = options.map((option) => option.discountRate);
    const uniqueRates = new Set(rates);

    if (rates.length !== uniqueRates.size) {
      throw new ConflictException('Duplicate discount rates are not allowed');
    }
  }

  private findDiscountOptionByRate(discountRate: number): DiscountOption {
    const option = this.discountOptions.find(
      (option) => option.discountRate === discountRate,
    );

    if (!option) {
      throw new ConflictException('Discount option not found');
    }

    return option;
  }

  createUnassignedCouponCodes(
    amount: number,
    discountRate: number,
  ): UnassignedCouponCode[] {
    const discountOption = this.findDiscountOptionByRate(discountRate);
    const result: UnassignedCouponCode[] = [];
    for (let i = 0; i < amount; i++) {
      result.push(
        UnassignedCouponCode.create(
          this.id,
          discountOption,
          this.daysValidAfterAssign,
        ),
      );
    }
    return result;
  }
}
