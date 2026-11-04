import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishEntity } from '../entities/dish.enity';
import { Repository } from 'typeorm';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { MenuDTO } from 'src/menu/ui/dtos/query/menu.dto';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import {
  DishDetailDTO,
  ReviewDTO,
} from 'src/menu/ui/dtos/query/dish-detail.dto';
import { roundRating } from 'src/shared/utils/rount-rating';
import { MenuReader } from 'src/menu/application/ports/menu.reader';
import { OwnerMenuDTO } from 'src/menu/ui/dtos/query/owner-menu.dto';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryDTO } from 'src/menu/ui/dtos/query/category.dto';

@Injectable()
export class MenuOrmReader implements MenuReader {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepo: Repository<DishEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findCategories(restaurantId: RestaurantId): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepo.find({
      where: {
        restaurantId: restaurantId.value,
      },
    });
    return categories.map(
      (category) => new CategoryDTO(category.categoryId, category.name),
    );
  }

  async findOwnerMenu(restaurantId: RestaurantId): Promise<OwnerMenuDTO[]> {
    const dishes = await this.dishRepo
      .createQueryBuilder('dish')
      .innerJoin('dish.category', 'category')
      .leftJoin('dish.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .where('category.restaurantId = :restaurantId', {
        restaurantId: restaurantId.value,
      })
      .select([
        'dish.dishId AS "dishId"',
        'category.name AS "categoryName"',
        'category.categoryId AS "categoryId"',
        'dish.name AS "name"',
        'dish.price AS "price"',
        'dish.dishImgUrl AS "dishImgUrl"',
        'dish.availability AS "isAvailable"',
        'dish.description AS description',
        'COALESCE(SUM(orderItem.quantity), 0) AS "numOfSold"',
      ])
      .groupBy('dish.dishId')
      .addGroupBy('category.name')
      .addGroupBy('category.categoryId')
      .getRawMany<{
        dishId: string;
        categoryName: string;
        categoryId: string;
        name: string;
        price: string;
        dishImgUrl: string | null;
        isAvailable: boolean;
        description: string;
        numOfSold: string;
      }>();

    return dishes.map(
      (dish) =>
        new OwnerMenuDTO(
          dish.dishId,
          dish.categoryName,
          dish.categoryId,
          dish.name,
          Number(dish.price),
          dish.dishImgUrl,
          Number(dish.numOfSold),
          dish.isAvailable,
          dish.description,
        ),
    );
  }

  async findByRestaurantId(restaurantId: RestaurantId): Promise<MenuDTO[]> {
    const dishes = await this.dishRepo
      .createQueryBuilder('dish')
      .innerJoin('dish.category', 'category')
      .leftJoin('dish.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('order.review', 'review')
      .where('category.restaurantId = :restaurantId', {
        restaurantId: restaurantId.value,
      })
      .select([
        'dish.dishId AS "dishId"',
        'dish.name AS "name"',
        'dish.price AS "price"',
        'dish.description AS "description"',
        'dish.dishImgUrl AS "dishImgUrl"',
        'category.name AS "categoryName"',
      ])
      .addSelect('COUNT(DISTINCT review.reviewId)', 'reviewCount')
      .groupBy('dish.dishId')
      .addGroupBy('category.name')
      .getRawMany<{
        dishId: string;
        categoryName: string;
        name: string;
        price: number;
        description: string;
        dishImgUrl: string | null;
        reviewCount: number;
      }>();

    return dishes.map(
      (dish) =>
        new MenuDTO(
          dish.dishId,
          dish.categoryName,
          dish.name,
          dish.price,
          dish.description,
          dish.dishImgUrl,
          dish.reviewCount,
        ),
    );
  }

  async findDishDetail(restaurantId: RestaurantId, dishId: DishId) {
    const entity = await this.dishRepo.findOne({
      relations: {
        category: {
          restaurant: { profile: true, gallery: true },
        },
        orderItems: {
          order: {
            review: {
              rating: true,
              client: {
                user: true,
              },
            },
          },
        },
      },
      select: {
        dishId: true,
        name: true,
        dishImgUrl: true,
        description: true,
        price: true,
        category: {
          categoryId: true,
          restaurant: {
            restaurantId: true,
            profile: {
              name: true,
            },
            gallery: {
              restaurantId: true,
              logo: true,
            },
          },
        },
        orderItems: {
          orderItemId: true,
          order: {
            orderId: true,
            review: {
              reviewId: true,
              content: true,
              postedAt: true,
              rating: {
                rating: true,
              },
              client: {
                clientId: true,
                user: {
                  name: true,
                },
              },
            },
          },
        },
      },
      where: {
        dishId: dishId.value,
        category: {
          restaurant: {
            restaurantId: restaurantId.value,
          },
        },
      },
    });

    if (!entity) throw new NotFoundException('Dish Not Found');

    const avgDishRating = await this.dishRepo
      .createQueryBuilder('dish')
      .leftJoin('dish.orderItems', 'orderItem')
      .leftJoin('orderItem.order', 'order')
      .leftJoin('order.review', 'review')
      .leftJoin('review.rating', 'rating')
      .where('dish.dishId = :dishId', {
        dishId: dishId.value,
      })
      .select('AVG(rating.rating)', 'averageRating')
      .getRawOne<{
        averageRating: string | null;
      }>();

    const averageRating = roundRating(avgDishRating?.averageRating);

    return new DishDetailDTO(
      entity.category.restaurant.profile.restaurantId,
      entity.category.restaurant.profile.name,
      entity.category.restaurant.gallery.logo,
      entity.name,
      entity.dishImgUrl,
      entity.description,
      entity.price,
      averageRating,
      entity.orderItems
        .map((item) => {
          if (!item.order.review) return;
          return new ReviewDTO(
            item.order.review.content,
            item.order.review.client.user.name,
            item.order.review.rating.rating,
            item.order.review.postedAt,
          );
        })
        .filter((review) => review !== undefined),
    );
  }
}
