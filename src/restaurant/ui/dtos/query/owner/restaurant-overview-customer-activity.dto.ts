export class AverageRatingMetricDTO {
  value: number;
  change: number;
}

export class CountMetricDTO {
  value: number;
  change: number;
}

export class PercentageMetricDTO {
  value: number;
  changePercent: number;
}

export class RestaurantOverviewCustomerActivityDTO {
  averageRating: AverageRatingMetricDTO;

  totalReviews: CountMetricDTO;

  returningCustomers: CountMetricDTO;

  repeatOrderRate: PercentageMetricDTO;
}
