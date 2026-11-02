export enum CouponUsedStatus {
  Used = 'USED',
  NotUsed = 'NOT_USED',
}

export class ViewMyCouponDTO {
  constructor(
    readonly code: string,
    readonly type: string,
    readonly description: string,
    readonly expire: Date | null,
    readonly discount: number,
    readonly minOrderPrice: number,
    readonly status: CouponUsedStatus,
    readonly usedAt: Date | null,
  ) {}
}
