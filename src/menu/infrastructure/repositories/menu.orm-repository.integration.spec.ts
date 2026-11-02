import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuOrmRepository } from './menu.orm-repository';
import { Menu } from '../../domain/menu';
import { Category } from '../../domain/entities/category';
import { Dish } from '../../domain/entities/dish';
import { CategoryEntity } from '../entities/category.entity';
import { DishEntity } from '../entities/dish.enity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DishFactory } from 'src/menu/domain/factories/dish.factory';
import { CategoryId } from 'src/menu/domain/value-objects/category-id';
import { CategoryName } from 'src/menu/domain/value-objects/category-name';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { DishName } from 'src/menu/domain/value-objects/dish-name';
import { Price } from 'src/menu/domain/value-objects/price';
import { DishDescription } from 'src/menu/domain/value-objects/dish-description';
import { DishImageUrl } from 'src/menu/domain/value-objects/dish-image-url';

describe('MenuOrmRepository Integration Test', () => {
  let module: TestingModule;

  let menuRepository: MenuOrmRepository;
  let categoryRepo: Repository<CategoryEntity>;
  let dishRepo: Repository<DishEntity>;

  const restaurantId = new RestaurantId('restaurant-1');

  const createDish = (id = 'dish-1', name = 'Margherita Pizza'): Dish =>
    DishFactory.create(
      name,
      15000,
      'Tomato sauce and mozzarella',
      'https://example.com/margherita.jpg',
      id,
    );

  const createCategory = (id = 'category-1', name = 'Pizza'): Category =>
    new Category(new CategoryId(id), new CategoryName(name));

  const createMenu = (categories: Category[] = []) =>
    new Menu(restaurantId, categories);

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
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
      providers: [MenuOrmRepository],
    }).compile();

    menuRepository = module.get(MenuOrmRepository);

    categoryRepo = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );

    dishRepo = module.get<Repository<DishEntity>>(
      getRepositoryToken(DishEntity),
    );
  });

  beforeEach(async () => {
    await dishRepo.createQueryBuilder().delete().execute();
    await categoryRepo.createQueryBuilder().delete().execute();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('save', () => {
    it('Menu aggregate의 category와 dish를 DB에 저장한다', async () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');

      pizzaCategory.addDishes([
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', 'Pepperoni Pizza'),
      ]);

      const menu = createMenu([pizzaCategory]);

      await menuRepository.save(menu);

      const savedCategories = await categoryRepo.find({
        where: { restaurantId: restaurantId.value },
        relations: { dishes: true },
      });

      expect(savedCategories).toHaveLength(1);
      expect(savedCategories[0].categoryId).toBe('category-1');
      expect(savedCategories[0].restaurantId).toBe(restaurantId.value);
      expect(savedCategories[0].name).toBe('pizza');

      expect(savedCategories[0].dishes).toHaveLength(2);
      expect(
        savedCategories[0].dishes.map((dish) => dish.dishId).sort(),
      ).toEqual(['dish-1', 'dish-2']);
    });

    it('같은 dishId로 저장하면 새 row를 추가하지 않고 기존 메뉴를 수정한다', async () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');

      pizzaCategory.addDish(createDish('dish-1', 'Margherita Pizza'));

      const menu = createMenu([pizzaCategory]);

      await menuRepository.save(menu);

      menu.updateDish(
        new DishId('dish-1'),
        new DishName('Pepperoni Pizza'),
        new Price(18000),
        new DishDescription('Pepperoni and mozzarella'),
        new DishImageUrl('https://example.com/pepperoni.jpg'),
      );

      await menuRepository.save(menu);

      const dishes = await dishRepo.find({
        where: { categoryId: 'category-1' },
      });

      expect(dishes).toHaveLength(1);
      expect(dishes[0].dishId).toBe('dish-1');
      expect(dishes[0].name).toBe('pepperoni pizza');
      expect(dishes[0].price).toBe(18000);
      expect(dishes[0].description).toBe('Pepperoni and mozzarella');
      expect(dishes[0].dishImgUrl).toBe('https://example.com/pepperoni.jpg');
    });
  });

  describe('findByRestaurantId', () => {
    it('DB category와 dish를 Menu aggregate로 복원한다', async () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      pizzaCategory.addDish(createDish('dish-1', 'Margherita Pizza'));
      pastaCategory.addDish(createDish('dish-2', 'Carbonara'));

      await menuRepository.save(createMenu([pizzaCategory, pastaCategory]));

      const menu = await menuRepository.findByRestaurantId(restaurantId);

      expect(menu.restaurantId).toBe(restaurantId);
      expect(menu.categories).toHaveLength(2);
      expect(menu.allDishes).toHaveLength(2);

      expect(menu.allDishes.map((dish) => dish.name.value).sort()).toEqual([
        'carbonara',
        'margherita pizza',
      ]);
    });

    it('카테고리가 없어도 빈 Menu aggregate를 반환한다', async () => {
      const menu = await menuRepository.findByRestaurantId(
        new RestaurantId('restaurant-without-category'),
      );

      expect(menu.restaurantId.value).toBe('restaurant-without-category');
      expect(menu.categories).toEqual([]);
      expect(menu.allDishes).toEqual([]);
    });
  });

  describe('deleteDish', () => {
    it('dishId 기준으로 dish row를 삭제한다', async () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      pizzaCategory.addDish(createDish('dish-1'));

      await menuRepository.save(createMenu([pizzaCategory]));

      await menuRepository.deleteDish(new DishId('dish-1'));

      const dish = await dishRepo.findOne({
        where: { dishId: 'dish-1' },
      });

      expect(dish).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('카테고리를 삭제하면 onDelete CASCADE로 연결된 dish도 삭제한다', async () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');

      pizzaCategory.addDishes([
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', 'Pepperoni Pizza'),
      ]);

      await menuRepository.save(createMenu([pizzaCategory]));

      await menuRepository.deleteCategory(new CategoryId('category-1'));

      const category = await categoryRepo.findOne({
        where: { categoryId: 'category-1' },
      });

      const dishes = await dishRepo.find({
        where: { categoryId: 'category-1' },
      });

      expect(category).toBeNull();
      expect(dishes).toEqual([]);
    });
  });
});
