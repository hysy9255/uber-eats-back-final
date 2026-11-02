export class OverviewMetricDTO {
  value: number;
  changePercent: number;
}

export class RestaurantOverviewSummaryDTO {
  orders: OverviewMetricDTO;

  revenue: OverviewMetricDTO;

  averageOrderValue: OverviewMetricDTO;

  newCustomers: OverviewMetricDTO;
}
