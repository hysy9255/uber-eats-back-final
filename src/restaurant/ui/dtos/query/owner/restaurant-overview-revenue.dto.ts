export class DailyRevenueDTO {
  date: string;
  revenue: number;
}

export class RestaurantOverviewRevenueDTO {
  totalRevenue: number;

  dailyRevenue: DailyRevenueDTO[];
}
