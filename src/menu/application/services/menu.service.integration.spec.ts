import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MenuService } from './menu.service';
import { MenuRepository } from '../ports/menu.repository';

import { CategoryEntity } from '../../infrastructure/entities/category.entity';
import { DishEntity } from '../../infrastructure/entities/dish.enity';
import { MenuOrmRepository } from '../../infrastructure/repositories/menu.orm-repository';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { Category } from 'src/menu/domain/entities/category';
import { CategoryId } from 'src/menu/domain/value-objects/category-id';
import { CategoryName } from 'src/menu/domain/value-objects/category-name';
import { DishFactory } from 'src/menu/domain/factories/dish.factory';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishDescription } from 'src/menu/domain/value-objects/dish-description';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';

describe('MenuService Integration Test', () => {
  let module: TestingModule;

  let menuService: MenuService;
  let categoryRepo: Repository<CategoryEntity>;
  let dishRepo: Repository<DishEntity>;

  const restaurantId = new RestaurantId('restaurant-1');

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),

        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: Number(configService.get<string>('DB_PORT')),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),

            autoLoadEntities: true,
            synchronize: true,
            dropSchema: true,
          }),
        }),

        TypeOrmModule.forFeature([CategoryEntity, DishEntity]),
      ],
      providers: [
        MenuService,
        MenuOrmRepository,

        // MenuService가 MenuRepository를 주입받을 때
        // 실제 구현체인 MenuOrmRepository를 사용하게 연결
        {
          provide: MenuRepository,
          useExisting: MenuOrmRepository,
        },
      ],
    }).compile();

    menuService = module.get(MenuService);

    categoryRepo = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );

    dishRepo = module.get<Repository<DishEntity>>(
      getRepositoryToken(DishEntity),
    );
  });

  beforeEach(async () => {
    // FK 때문에 자식 테이블부터 삭제
    await dishRepo.createQueryBuilder().delete().execute();
    await categoryRepo.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await module.close();
  });

  const findCategoryByName = async (name: string) => {
    return categoryRepo.findOne({
      where: {
        restaurantId: restaurantId.value,
        name,
      },
    });
  };

  describe('addCategory', () => {
    it('카테고리를 생성하고 DB에 저장한다', async () => {
      await menuService.addCategory(
        restaurantId,
        new Category(CategoryId.generate(), new CategoryName('Pizza')),
      );

      const category = await findCategoryByName('pizza');

      expect(category).not.toBeNull();
      expect(category!.restaurantId).toBe(restaurantId.value);
      expect(category!.name).toBe('pizza');
    });
  });

  describe('updateCategory', () => {
    it('카테고리 이름을 수정하고 DB에 반영한다', async () => {
      await menuService.addCategory(
        restaurantId,
        new Category(CategoryId.generate(), new CategoryName('Pizza')),
      );

      const category = await findCategoryByName('pizza');

      await menuService.updateCategory(
        restaurantId,
        new CategoryId(category!.categoryId),
        new CategoryName('Italian Pizza'),
      );

      const updatedCategory = await categoryRepo.findOne({
        where: { categoryId: category!.categoryId },
      });

      expect(updatedCategory!.name).toBe('italian pizza');
    });
  });

  describe('addDish', () => {
    it('카테고리에 dish를 생성하고 DB에 저장한다', async () => {
      await menuService.addCategory(
        restaurantId,
        new Category(CategoryId.generate(), new CategoryName('Pizza')),
      );

      const category = await findCategoryByName('pizza');

      await menuService.addDish(
        restaurantId,
        new CategoryId(category!.categoryId),
        DishFactory.create(
          'Margherita Pizza',
          15000,
          'Tomato sauce and mozzarella',
          'https://example.com/margherita.jpg',
        ),
      );

      const dishes = await dishRepo.find({
        where: { categoryId: category!.categoryId },
      });

      expect(dishes).toHaveLength(1);
      expect(dishes[0].categoryId).toBe(category!.categoryId);
      expect(dishes[0].name).toBe('margherita pizza');
      expect(dishes[0].price).toBe(15000);
      expect(dishes[0].description).toBe('Tomato sauce and mozzarella');
      expect(dishes[0].dishImgUrl).toBe('https://example.com/margherita.jpg');
    });
  });

  describe('addDishes', () => {
    it('여러 dish를 한 번에 저장한다', async () => {
      await menuService.addCategory(
        restaurantId,
        new Category(CategoryId.generate(), new CategoryName('Pizza')),
      );

      const category = await findCategoryByName('pizza');

      await menuService.addDishes(
        restaurantId,
        new CategoryId(category!.categoryId),
        [
          DishFactory.create(
            'Margherita Pizza',
            15000,
            'Tomato sauce and mozzarella',
            null,
          ),
          DishFactory.create(
            'Pepperoni Pizza',
            18000,
            'Pepperoni and mozzarella',
            'https://example.com/pepperoni.jpg',
          ),
        ],
      );

      const dishes = await dishRepo.find({
        where: { categoryId: category!.categoryId },
      });

      expect(dishes).toHaveLength(2);

      expect(dishes.map((dish) => dish.name).sort()).toEqual([
        'margherita pizza',
        'pepperoni pizza',
      ]);
    });
  });

  describe('updateDish', () => {
    it('기존 dish를 수정하고 DB에 반영한다', async () => {
      await menuService.addCategory(
        restaurantId,
        new Category(CategoryId.generate(), new CategoryName('Pizza')),
      );

      const category = await findCategoryByName('pizza');

      await menuService.addDish(
        restaurantId,
        new CategoryId(category!.categoryId),
        DishFactory.create(
          'Margherita Pizza',
          15000,
          'Tomato sauce and mozzarella',
          null,
        ),
      );

      const dish = await dishRepo.findOne({
        where: { categoryId: category!.categoryId },
      });

      await menuService.updateDish(
        restaurantId,
        new DishId(dish!.dishId),
        new DishName('Pepperoni Pizza'),
        new Price(18000),
        new DishDescription('Pepperoni and mozzarella'),
        new DishImageUrl('https://example.com/pepperoni.jpg'),
      );

      const updatedDish = await dishRepo.findOne({
        where: { dishId: dish!.dishId },
      });

      expect(updatedDish!.name).toBe('pepperoni pizza');
      expect(updatedDish!.price).toBe(18000);
      expect(updatedDish!.description).toBe('Pepperoni and mozzarella');
      expect(updatedDish!.dishImgUrl).toBe('https://example.com/pepperoni.jpg');
    });
  });

  describe('deleteDish', () => {
    it('dish를 삭제하면 DB row도 삭제된다', async () => {
      await menuService.addCategory(
        restaurantId,
        new Category(CategoryId.generate(), new CategoryName('Pizza')),
      );

      const category = await findCategoryByName('pizza');

      await menuService.addDish(
        restaurantId,
        new CategoryId(category!.categoryId),
        DishFactory.create(
          'Margherita Pizza',
          15000,
          'Tomato sauce and mozzarella',
          null,
        ),
      );

      const dish = await dishRepo.findOne({
        where: { categoryId: category!.categoryId },
      });

      await menuService.deleteDish(restaurantId, new DishId(dish!.dishId));

      const deletedDish = await dishRepo.findOne({
        where: { dishId: dish!.dishId },
      });

      expect(deletedDish).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('카테고리를 삭제하면 연결된 dish도 cascade 삭제된다', async () => {
      await menuService.addCategory(
        restaurantId,
        new Category(CategoryId.generate(), new CategoryName('Pizza')),
      );

      const category = await findCategoryByName('pizza');

      await menuService.addDishes(
        restaurantId,
        new CategoryId(category!.categoryId),
        [
          DishFactory.create(
            'Margherita Pizza',
            15000,
            'Tomato sauce and mozzarella',
            null,
          ),
          DishFactory.create(
            'Pepperoni Pizza',
            18000,
            'Pepperoni and mozzarella',
            null,
          ),
        ],
      );

      await menuService.deleteCategory(
        restaurantId,
        new CategoryId(category!.categoryId),
      );

      const deletedCategory = await categoryRepo.findOne({
        where: { categoryId: category!.categoryId },
      });

      const dishes = await dishRepo.find({
        where: { categoryId: category!.categoryId },
      });

      expect(deletedCategory).toBeNull();
      expect(dishes).toEqual([]);
    });
  });
});
