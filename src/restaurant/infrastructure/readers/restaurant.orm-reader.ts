import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { RestaurantDetailDTO } from 'src/restaurant/ui/dtos/query/restaurant-detail.dto';
import { RestaurantSummaryDTO } from 'src/restaurant/ui/dtos/query/restaurant-summary.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from 'src/restaurant/infrastructure/orm-entities/restaurant.orm-entity';
import { DayOperatingHoursDTO } from 'src/restaurant/ui/dtos/query/day-operating-hours.dto';
import { In, Repository } from 'typeorm';
import { RestaurantReader } from 'src/restaurant/application/ports/restaurant.reader';
import { roundRating } from 'src/shared/utils/rount-rating';
import { RestaurantOverviewSummaryDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-summary.dto';
import { OrderEntity } from 'src/order/infrastructure/entities/order.orm-entity';
import { RestaurantOverviewRevenueDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-revenue.dto';
import { RestaurantOverviewLiveOrdersDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-live-order.dto';
import { OrderStatusType } from 'src/order/domain/order-progress';
import { RestaurantOverviewTopSellingItemDTO } from 'src/restaurant/ui/dtos/query/owner/restaurant-overview-top-selling-item.dto';
import { OrderItemsEntity } from 'src/order/infrastructure/entities/order-items.orm-entity';
import { RestaurantSettingDTO } from '../../ui/dtos/query/owner/restaurant-setting.dto';

@Injectable()
export class RestaurantOrmReader implements RestaurantReader {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepo: Repository<RestaurantEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemRepo: Repository<OrderItemsEntity>,
  ) {}

  private calculatePercentChange(current: number, previous: number): number {
    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  async findRestaurantSetting(
    restaurantId: RestaurantId,
  ): Promise<RestaurantSettingDTO> {
    const entity = await this.restaurantRepo.findOne({
      where: {
        restaurantId: restaurantId.value,
      },

      select: {
        restaurantId: true,

        profile: {
          name: true,
          cuisineType: true,
          storePhone: true,
        },

        address: {
          streetAddress: true,
          city: true,
          state: true,
          zip: true,
          apt: true,
        },

        gallery: {
          logo: true,
          mainImg: true,
          sub1Img: true,
          sub2Img: true,
          bannerImg: true,
        },
      },

      relations: {
        profile: true,
        address: true,
        gallery: true,
      },
    });

    if (!entity) {
      throw new NotFoundException('Restaurant not found');
    }

    return {
      name: entity.profile.name,
      cuisineType: entity.profile.cuisineType,
      logo: entity.gallery.logo,
      mainImage: entity.gallery.mainImg,
      sub1Image: entity.gallery.sub1Img,
      sub2Image: entity.gallery.sub2Img,
      bannerImage: entity.gallery.bannerImg,
      storePhone: entity.profile.storePhone,
      streetAddress: entity.address.streetAddress,
      city: entity.address.city,
      state: entity.address.state,
      zip: entity.address.zip,
      apt: entity.address.apt,
    };
  }

  async findRestaurantOverviewSummary(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewSummaryDTO> {
    const periodMs = endDate.getTime() - startDate.getTime();

    const previousEndDate = new Date(startDate.getTime() - 1);

    const previousStartDate = new Date(previousEndDate.getTime() - periodMs);

    const current = await this.orderRepo
      .createQueryBuilder('order')
      .select('COUNT(order.orderId)', 'orderCount')
      .addSelect('COALESCE(SUM(order.totalPrice), 0)', 'revenue')
      .addSelect('COALESCE(AVG(order.totalPrice), 0)', 'averageOrderValue')
      .addSelect('COUNT(DISTINCT order.clientId)', 'customerCount')
      .where('order.restaurantId = :restaurantId', {
        restaurantId: restaurantId.value,
      })
      .andWhere('"order"."orderedAt" BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{
        orderCount: string;
        revenue: string;
        averageOrderValue: string;
        customerCount: string;
      }>();

    const previous = await this.orderRepo
      .createQueryBuilder('order')
      .select('COUNT(order.orderId)', 'orderCount')
      .addSelect('COALESCE(SUM(order.totalPrice), 0)', 'revenue')
      .addSelect('COALESCE(AVG(order.totalPrice), 0)', 'averageOrderValue')
      .addSelect('COUNT(DISTINCT order.clientId)', 'customerCount')
      .where('order.restaurantId = :restaurantId', {
        restaurantId: restaurantId.value,
      })
      .andWhere('order.orderedAt BETWEEN :startDate AND :endDate', {
        startDate: previousStartDate,
        endDate: previousEndDate,
      })
      .getRawOne<{
        orderCount: string;
        revenue: string;
        averageOrderValue: string;
        customerCount: string;
      }>();

    const currentOrders = Number(current?.orderCount ?? 0);
    const previousOrders = Number(previous?.orderCount ?? 0);

    const currentRevenue = Number(current?.revenue ?? 0);
    const previousRevenue = Number(previous?.revenue ?? 0);

    const currentAverage = Number(current?.averageOrderValue ?? 0);

    const previousAverage = Number(previous?.averageOrderValue ?? 0);

    const currentCustomers = Number(current?.customerCount ?? 0);

    const previousCustomers = Number(previous?.customerCount ?? 0);

    return {
      orders: {
        value: currentOrders,
        changePercent: this.calculatePercentChange(
          currentOrders,
          previousOrders,
        ),
      },

      revenue: {
        value: currentRevenue,
        changePercent: this.calculatePercentChange(
          currentRevenue,
          previousRevenue,
        ),
      },

      averageOrderValue: {
        value: currentAverage,
        changePercent: this.calculatePercentChange(
          currentAverage,
          previousAverage,
        ),
      },

      newCustomers: {
        value: currentCustomers,
        changePercent: this.calculatePercentChange(
          currentCustomers,
          previousCustomers,
        ),
      },
    };
  }

  async findRestaurantOverviewRevenue(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewRevenueDTO> {
    const rows = await this.orderRepo
      .createQueryBuilder('o')
      .select(`TO_CHAR(DATE("o"."orderedAt"), 'YYYY-MM-DD')`, 'date')
      .addSelect('COALESCE(SUM(o.totalPrice), 0)', 'revenue')
      .where('o.restaurantId = :restaurantId', {
        restaurantId: restaurantId.value,
      })
      .andWhere('"o"."orderedAt" BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('DATE("o"."orderedAt")')
      .orderBy('DATE("o"."orderedAt")', 'ASC')
      .getRawMany<{
        date: string;
        revenue: string;
      }>();

    const revenueMap = new Map(
      rows.map((row) => [row.date, Number(row.revenue)]),
    );

    const dailyRevenue: {
      date: string;
      revenue: number;
    }[] = [];

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      const date = `${year}-${month}-${day}`;

      dailyRevenue.push({
        date,
        revenue: revenueMap.get(date) ?? 0,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const totalRevenue = dailyRevenue.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );

    return {
      totalRevenue,
      dailyRevenue,
    };
  }

  async findRestaurantOverviewLiveOrders(
    restaurantId: RestaurantId,
  ): Promise<RestaurantOverviewLiveOrdersDTO> {
    const orders = await this.orderRepo.find({
      where: {
        restaurantId: restaurantId.value,

        status: In([
          OrderStatusType.Pending,
          OrderStatusType.Cooking,
          OrderStatusType.Ready,
          OrderStatusType.Delivering,
        ]),
      },

      relations: {
        orderItems: true,
      },

      order: {
        orderedAt: 'DESC',
      },

      take: 3,
    });

    return {
      count: orders.length,

      orders: orders.map((order) => ({
        orderId: order.orderId,

        status: order.status,

        orderedAt: order.orderedAt.toISOString(),

        orderItems: order.orderItems.map((item) => ({
          name: item.dishName,
          quantity: item.quantity,
        })),
      })),
    };
  }

  async findRestaurantOverviewTopSellingItems(
    restaurantId: RestaurantId,
    startDate: Date,
    endDate: Date,
  ): Promise<RestaurantOverviewTopSellingItemDTO[]> {
    const rows = await this.orderItemRepo
      .createQueryBuilder('item')
      .innerJoin('item.order', 'order')
      .leftJoin('item.dish', 'dish')
      .select('item.dishId', 'dishId')
      .addSelect('item.dishName', 'name')
      .addSelect('dish.dishImgUrl', 'imageUrl')
      .addSelect('SUM(item.quantity)', 'soldCount')
      .addSelect('SUM(item.unitPrice * item.quantity)', 'revenue')
      .where('order.restaurantId = :restaurantId', {
        restaurantId: restaurantId.value,
      })
      .andWhere('order.orderedAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('item.dishId')
      .addGroupBy('item.dishName')
      .addGroupBy('dish.dishImgUrl')
      .orderBy('SUM(item.quantity)', 'DESC')
      .limit(3)
      .getRawMany<{
        dishId: string;
        name: string;
        imageUrl: string | null;
        soldCount: string;
        revenue: string;
      }>();

    return rows.map((row) => ({
      dishId: row.dishId,
      name: row.name,
      imageUrl: row.imageUrl,
      soldCount: Number(row.soldCount),
      revenue: Number(row.revenue),

      // 일단 previous period 계산 전
      changePercent: 0,
    }));
  }

  async findRestaurantHours(
    restaurantId: RestaurantId,
  ): Promise<DayOperatingHoursDTO[]> {
    const entity = await this.restaurantRepo.findOne({
      where: {
        restaurantId: restaurantId.value,
      },
      relations: {
        hours: true,
      },
      select: {
        restaurantId: true,
        hours: {
          restaurantId: true,
          dayOfWeek: true,
          isClosed: true,
          openTime: true,
          closeTime: true,
        },
      },
    });

    if (!entity) return [];

    return entity.hours.map(
      (elem) =>
        new DayOperatingHoursDTO(
          elem.dayOfWeek,
          elem.isClosed,
          elem.openTime,
          elem.closeTime,
        ),
    );
  }

  async findRestaurants(): Promise<RestaurantSummaryDTO[]> {
    const entities = await this.restaurantRepo.find({
      select: {
        restaurantId: true,
        status: true,
        profile: {
          name: true,
        },
        address: {
          streetAddress: true,
          city: true,
          state: true,
          zip: true,
        },
        gallery: {
          logo: true,
          mainImg: true,
          sub1Img: true,
          sub2Img: true,
        },
      },
      relations: { profile: true, address: true, gallery: true },
    });

    const ratingRows = await this.restaurantRepo
      .createQueryBuilder('restaurant')
      .leftJoin('restaurant.reviews', 'review')
      .leftJoin('review.rating', 'rating')
      .select('restaurant.restaurantId', 'restaurantId')
      .addSelect('AVG(rating.rating)', 'averageRating')
      .addSelect('COUNT(DISTINCT review.reviewId)', 'reviewCount')
      .groupBy('restaurant.restaurantId')
      .getRawMany<{
        restaurantId: string;
        averageRating: string | null;
        reviewCount: string;
      }>();

    const ratingMap = new Map(
      ratingRows.map((row) => [
        row.restaurantId,
        {
          averageRating: roundRating(row.averageRating),
          reviewCount: Number(row.reviewCount),
        },
      ]),
    );

    return entities.map((entity) => {
      const address = [
        entity.address.streetAddress,
        entity.address.apt,
        entity.address.city,
        entity.address.state,
        entity.address.zip,
      ]
        .filter((value) => value != null)
        .join(' ');

      const reviewInfo = ratingMap.get(entity.restaurantId);

      return new RestaurantSummaryDTO(
        entity.restaurantId,
        entity.gallery.logo,
        entity.profile.name,
        address,
        entity.status,
        entity.gallery.mainImg,
        entity.gallery.sub1Img,
        entity.gallery.sub2Img,
        reviewInfo?.averageRating ?? null,
        reviewInfo?.reviewCount ?? 0,
      );
    });
  }

  async findRestaurant(
    restaurantId: RestaurantId,
  ): Promise<RestaurantDetailDTO> {
    // const avgRestaurantRating = await this.restaurantRepo
    //   .createQueryBuilder('restaurant')
    //   .leftJoin('restaurant.reviews', 'review')
    //   .leftJoin('review.rating', 'rating')
    //   .where('restaurant.restaurantId = :restaurantId', {
    //     restaurantId: restaurantId.value,
    //   })
    //   .select('AVG(rating.rating)', 'averageRating')
    //   .getRawOne<{
    //     averageRating: string | null;
    //   }>();

    // const averageRating = roundRating(avgRestaurantRating?.averageRating);
    const reviewInfo = await this.restaurantRepo
      .createQueryBuilder('restaurant')
      .leftJoin('restaurant.reviews', 'review')
      .leftJoin('review.rating', 'rating')
      .where('restaurant.restaurantId = :restaurantId', {
        restaurantId: restaurantId.value,
      })
      .select('AVG(rating.rating)', 'averageRating')
      .addSelect('COUNT(DISTINCT review.reviewId)', 'reviewCount')
      .getRawOne<{
        averageRating: string | null;
        reviewCount: string;
      }>();

    const averageRating = roundRating(reviewInfo?.averageRating);
    const reviewCount = Number(reviewInfo?.reviewCount ?? 0);

    const entity = await this.restaurantRepo.findOne({
      where: { restaurantId: restaurantId.value },
      select: {
        restaurantId: true,
        status: true,
        profile: {
          name: true,
        },
        address: {
          streetAddress: true,
          city: true,
          state: true,
          zip: true,
        },
        gallery: {
          logo: true,
          bannerImg: true,
        },
        hours: {
          dayOfWeek: true,
          openTime: true,
          closeTime: true,
          isClosed: true,
        },
      },
      relations: { profile: true, address: true, gallery: true, hours: true },
    });

    if (!entity) throw new NotFoundException('Restaurant is not found');

    const address = [
      entity.address.streetAddress,
      entity.address.apt,
      entity.address.city,
      entity.address.state,
      entity.address.zip,
    ]
      .filter((value) => value != null)
      .join(' ');

    return new RestaurantDetailDTO(
      entity.profile.name,
      address,
      entity.status,
      entity.gallery.bannerImg,
      entity.gallery.logo,
      averageRating,
      reviewCount,
      entity.hours.map(
        (day) =>
          new DayOperatingHoursDTO(
            day.dayOfWeek,
            day.isClosed,
            day.openTime,
            day.closeTime,
          ),
      ),
    );
  }
}
