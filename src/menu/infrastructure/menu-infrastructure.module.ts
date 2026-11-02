import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './entities/dish.enity';
import { CategoryEntity } from './entities/category.entity';
import { MenuRepository } from '../application/ports/menu.repository';
import { MenuOrmRepository } from './repositories/menu.orm-repository';
import { FindDish } from 'src/order/application/ports/find-dish';
import { FindDishAdaptor } from './adaptors/find-dish.adaptor';
import { FindDishRestaurant } from 'src/cart/application/ports/find-dish-restaurant';
import { FindDishRestaurantAdaptor } from './adaptors/find-dish-restaurant.adaptor';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity, CategoryEntity])],
  providers: [
    { provide: FindDish, useClass: FindDishAdaptor },
    {
      provide: MenuRepository,
      useClass: MenuOrmRepository,
    },
    { provide: FindDishRestaurant, useClass: FindDishRestaurantAdaptor },
  ],
  exports: [MenuRepository, FindDish, FindDishRestaurant],
})
export class MenuInfrastructureModule {}
