import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { DishEntity } from 'src/menu/infrastructure/entities/dish.enity';
import { DishId } from 'src/menu/domain/value-objects/dish-id';
import { CategoryEntity } from 'src/menu/infrastructure/entities/category.entity';
import { FindDishAdaptor } from './find-dish.adaptor';

describe('FindDishAdaptor Integration Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let findDishAdaptor: FindDishAdaptor;
  let categoryEntityRepo: Repository<CategoryEntity>;
  let dishEntityRepo: Repository<DishEntity>;

  const dishId1 = 'dish-1';
  const dishId2 = 'dish-2';
  const dishId3 = 'dish-3';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

        TypeOrmModule.forFeature([DishEntity, CategoryEntity]),
      ],
      providers: [FindDishAdaptor],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    findDishAdaptor = moduleFixture.get(FindDishAdaptor);
    categoryEntityRepo = dataSource.getRepository(CategoryEntity);
    dishEntityRepo = dataSource.getRepository(DishEntity);
  });

  beforeEach(async () => {
    await dataSource.query(`
      TRUNCATE TABLE
        "dishes",
        "categories"
      RESTART IDENTITY CASCADE
    `);

    await categoryEntityRepo.save({
      categoryId: 'category-1',
      restaurantId: 'restaurant-1',
      name: 'Main Course',
    });
    await dishEntityRepo.save([
      {
        dishId: dishId1,
        name: 'Pizza',
        price: 12.5,
        description: 'Cheese pizza',
        categoryId: 'category-1',
        dishImgUrl: 'https://example.com/pizza.png',
      },
      {
        dishId: dishId2,
        name: 'Pasta',
        price: 15,
        description: 'Cream pasta',
        categoryId: 'category-1',
        dishImgUrl: 'https://example.com/pasta.png',
      },
      {
        dishId: dishId3,
        name: 'Burger',
        price: 10,
        description: 'Beef burger',
        categoryId: 'category-1',
        dishImgUrl: 'https://example.com/burger.png',
      },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('findByIds', () => {
    it('여러 dishId에 해당하는 Dish 도메인 객체를 반환한다', async () => {
      const dishes = await findDishAdaptor.findByIds([
        new DishId(dishId1),
        new DishId(dishId2),
      ]);

      expect(dishes).toHaveLength(2);

      const pizza = dishes.find((dish) => dish.id.value === dishId1);
      const pasta = dishes.find((dish) => dish.id.value === dishId2);

      expect(pizza).toBeDefined();
      expect(pizza?.name.value).toBe('pizza');
      expect(pizza?.price.value).toBe(12.5);
      expect(pizza?.description.value).toBe('Cheese pizza');
      expect(pizza?.dishImgUrl.value).toBe('https://example.com/pizza.png');

      expect(pasta).toBeDefined();
      expect(pasta?.name.value).toBe('pasta');
      expect(pasta?.price.value).toBe(15);
    });

    it('존재하지 않는 dishId는 반환하지 않는다', async () => {
      const dishes = await findDishAdaptor.findByIds([
        new DishId(dishId1),
        new DishId('not-found-dish'),
      ]);

      expect(dishes).toHaveLength(1);
      expect(dishes[0].id.value).toBe(dishId1);
    });

    it('빈 dishId 배열을 전달하면 빈 배열을 반환한다', async () => {
      const dishes = await findDishAdaptor.findByIds([]);

      expect(dishes).toEqual([]);
    });

    it('중복된 dishId를 전달해도 Dish는 한 번만 반환한다', async () => {
      const dishes = await findDishAdaptor.findByIds([
        new DishId(dishId1),
        new DishId(dishId1),
      ]);

      expect(dishes).toHaveLength(1);
      expect(dishes[0].id.value).toBe(dishId1);
    });
  });
});
