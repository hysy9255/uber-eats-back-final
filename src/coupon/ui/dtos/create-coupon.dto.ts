export class CreateCouponDTO {
  coupon: {
    type: string;
    description: string;
    discountOptions: { discountRate: number; minOrderPrice: number }[];
    daysValidAfterAssign: number;
  };
  couponInstances: {
    amount: number;
    discount: number;
  }[];
}
