import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Menu } from './menu';
import { Category } from './entities/category';
import { Dish } from './entities/dish';
import { DishFactory } from './factories/dish.factory';
import { CategoryId } from './value-objects/category-id';
import { CategoryName } from './value-objects/category-name';
import { RestaurantId } from 'src/restaurant/domain/restaurant/vo/restaurant-id';
import { DishId } from './value-objects/dish-id';
import { DishName } from './value-objects/dish-name';
import { Price } from './value-objects/price';
import { DishDescription } from './value-objects/dish-description';
import { DishImageUrl } from './value-objects/dish-image-url';

describe('Menu', () => {
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
    new Menu(new RestaurantId('restaurant-1'), categories);

  describe('getter', () => {
    it('restaurantId를 반환한다', () => {
      const menu = createMenu();

      expect(menu.restaurantId.value).toBe('restaurant-1');
    });

    it('categories를 반환한다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      const menu = createMenu([pizzaCategory, pastaCategory]);

      expect(menu.categories).toEqual([pizzaCategory, pastaCategory]);
    });

    it('모든 카테고리의 메뉴를 하나의 배열로 반환한다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      const margherita = createDish('dish-1', 'Margherita Pizza');
      const pepperoni = createDish('dish-2', 'Pepperoni Pizza');
      const carbonara = createDish('dish-3', 'Carbonara');

      pizzaCategory.addDish(margherita);
      pizzaCategory.addDish(pepperoni);
      pastaCategory.addDish(carbonara);

      const menu = createMenu([pizzaCategory, pastaCategory]);

      expect(menu.allDishes).toEqual([margherita, pepperoni, carbonara]);
    });

    it('카테고리가 없으면 allDishes는 빈 배열을 반환한다', () => {
      const menu = createMenu();

      expect(menu.allDishes).toEqual([]);
    });
  });

  describe('addDish', () => {
    it('지정한 카테고리에 메뉴를 추가한다', () => {
      const pizzaCategory = createCategory();
      const menu = createMenu([pizzaCategory]);
      const dish = createDish();

      menu.addDish(new CategoryId('category-1'), dish);

      expect(menu.allDishes).toHaveLength(1);
      expect(menu.allDishes[0]).toBe(dish);
      expect(pizzaCategory.dishes).toHaveLength(1);
    });

    it('메뉴 전체에서 동일한 이름의 메뉴가 있으면 추가할 수 없다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      pizzaCategory.addDish(createDish('dish-1', 'Margherita Pizza'));

      const menu = createMenu([pizzaCategory, pastaCategory]);

      expect(() =>
        menu.addDish(
          new CategoryId('category-2'),
          createDish('dish-2', 'Margherita Pizza'),
        ),
      ).toThrow(ConflictException);
    });

    it('존재하지 않는 카테고리에 메뉴를 추가하면 예외를 던진다', () => {
      const menu = createMenu();

      expect(() =>
        menu.addDish(new CategoryId('unknown-category'), createDish()),
      ).toThrow(NotFoundException);
    });
  });

  describe('addDishes', () => {
    it('지정한 카테고리에 여러 메뉴를 한 번에 추가한다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const menu = createMenu([pizzaCategory]);

      const dishes = [
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', 'Pepperoni Pizza'),
        createDish('dish-3', 'Hawaiian Pizza'),
      ];

      menu.addDishes(new CategoryId('category-1'), dishes);

      expect(pizzaCategory.dishes).toHaveLength(3);
      expect(menu.allDishes).toEqual(dishes);
    });

    it('요청 안에 같은 이름의 메뉴가 있으면 예외를 던지고 아무 메뉴도 추가하지 않는다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const menu = createMenu([pizzaCategory]);

      const dishes = [
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', 'Margherita Pizza'),
      ];

      expect(() =>
        menu.addDishes(new CategoryId('category-1'), dishes),
      ).toThrow(ConflictException);

      expect(pizzaCategory.dishes).toEqual([]);
      expect(menu.allDishes).toEqual([]);
    });

    it('요청 안에서 정규화된 이름이 같으면 중복으로 처리한다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const menu = createMenu([pizzaCategory]);

      const dishes = [
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', '  MARGHERITA PIZZA  '),
      ];

      expect(() =>
        menu.addDishes(new CategoryId('category-1'), dishes),
      ).toThrow(ConflictException);

      expect(menu.allDishes).toEqual([]);
    });

    it('기존 메뉴 전체에 같은 이름의 메뉴가 있으면 예외를 던지고 아무 메뉴도 추가하지 않는다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      pastaCategory.addDish(createDish('existing-dish', 'Carbonara'));

      const menu = createMenu([pizzaCategory, pastaCategory]);

      const dishes = [
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', 'Carbonara'),
      ];

      expect(() =>
        menu.addDishes(new CategoryId('category-1'), dishes),
      ).toThrow(ConflictException);

      // 검증 단계에서 실패했으므로 새 메뉴는 하나도 들어가면 안 됨
      expect(pizzaCategory.dishes).toEqual([]);
      expect(menu.allDishes).toHaveLength(1);
      expect(menu.allDishes[0].id.value).toBe('existing-dish');
    });

    it('존재하지 않는 카테고리에 여러 메뉴를 추가하면 예외를 던진다', () => {
      const menu = createMenu();

      const dishes = [
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', 'Pepperoni Pizza'),
      ];

      expect(() =>
        menu.addDishes(new CategoryId('unknown-category'), dishes),
      ).toThrow(NotFoundException);
    });

    it('빈 배열을 전달하면 메뉴 상태는 변하지 않는다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const menu = createMenu([pizzaCategory]);

      menu.addDishes(new CategoryId('category-1'), []);

      expect(pizzaCategory.dishes).toEqual([]);
      expect(menu.allDishes).toEqual([]);
    });
  });

  describe('updateDish', () => {
    it('해당 메뉴의 정보를 수정한다', () => {
      const pizzaCategory = createCategory();
      const dish = createDish();

      pizzaCategory.addDish(dish);

      const menu = createMenu([pizzaCategory]);

      menu.updateDish(
        new DishId('dish-1'),
        new DishName('Pepperoni Pizza'),
        new Price(18000),
        new DishDescription('Pepperoni and mozzarella'),
        new DishImageUrl('https://example.com/pepperoni.jpg'),
      );

      expect(menu.allDishes).toHaveLength(1);
      expect(menu.allDishes[0].name.value).toBe('pepperoni pizza');
      expect(menu.allDishes[0].price.value).toBe(18000);
      expect(menu.allDishes[0].description.value).toBe(
        'Pepperoni and mozzarella',
      );
      expect(menu.allDishes[0].dishImgUrl.value).toBe(
        'https://example.com/pepperoni.jpg',
      );
    });

    it('존재하지 않는 메뉴를 수정하면 예외를 던진다', () => {
      const menu = createMenu();

      expect(() =>
        menu.updateDish(
          new DishId('unknown-dish'),
          new DishName('New Pizza'),
          new Price(12000),
          new DishDescription('New description'),
          new DishImageUrl('https://example.com/new.jpg'),
        ),
      ).toThrow(NotFoundException);
    });
  });

  describe('deleteDish', () => {
    it('메뉴를 삭제한다', () => {
      const pizzaCategory = createCategory();
      pizzaCategory.addDish(createDish('dish-1'));

      const menu = createMenu([pizzaCategory]);

      menu.deleteDish(new DishId('dish-1'));

      expect(menu.allDishes).toEqual([]);
      expect(pizzaCategory.dishes).toEqual([]);
    });

    it('대상 메뉴만 삭제하고 다른 메뉴는 유지한다', () => {
      const pizzaCategory = createCategory();

      pizzaCategory.addDish(createDish('dish-1', 'Margherita Pizza'));
      pizzaCategory.addDish(createDish('dish-2', 'Pepperoni Pizza'));

      const menu = createMenu([pizzaCategory]);

      menu.deleteDish(new DishId('dish-1'));

      expect(menu.allDishes).toHaveLength(1);
      expect(menu.allDishes[0].id.value).toBe('dish-2');
    });

    it('존재하지 않는 메뉴를 삭제하면 예외를 던진다', () => {
      const menu = createMenu();

      expect(() => menu.deleteDish(new DishId('unknown-dish'))).toThrow(
        NotFoundException,
      );
    });
  });

  describe('addCategory', () => {
    it('카테고리를 추가한다', () => {
      const menu = createMenu();
      const pizzaCategory = createCategory();

      menu.addCategory(pizzaCategory);

      expect(menu.categories).toHaveLength(1);
      expect(menu.categories[0]).toBe(pizzaCategory);
    });

    it('동일한 이름의 카테고리는 추가할 수 없다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const menu = createMenu([pizzaCategory]);

      expect(() =>
        menu.addCategory(createCategory('category-2', 'pizza')),
      ).toThrow(ConflictException);
    });
  });

  describe('renameCategory', () => {
    it('카테고리 이름을 변경한다', () => {
      const pizzaCategory = createCategory();
      const menu = createMenu([pizzaCategory]);

      menu.renameCategory(
        new CategoryId('category-1'),
        new CategoryName('  PASTA  '),
      );

      expect(menu.categories[0].name.value).toBe('pasta');
    });

    it('존재하지 않는 카테고리의 이름을 변경하면 예외를 던진다', () => {
      const menu = createMenu();

      expect(() =>
        menu.renameCategory(
          new CategoryId('unknown-category'),
          new CategoryName('Pasta'),
        ),
      ).toThrow(NotFoundException);
    });

    it('다른 카테고리와 동일한 이름으로 변경하면 예외를 던진다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      const menu = createMenu([pizzaCategory, pastaCategory]);

      expect(() =>
        menu.renameCategory(
          new CategoryId('category-2'),
          new CategoryName('pizza'),
        ),
      ).toThrow(ConflictException);
    });

    it('현재 카테고리와 동일한 이름으로 변경하면 예외를 던진다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      const menu = createMenu([pizzaCategory, pastaCategory]);

      expect(() =>
        menu.renameCategory(
          new CategoryId('category-2'),
          new CategoryName('pasta'),
        ),
      ).toThrow(BadRequestException);
    });
  });

  describe('deleteCategory', () => {
    it('카테고리를 삭제한다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      const menu = createMenu([pizzaCategory, pastaCategory]);

      menu.deleteCategory(new CategoryId('category-1'));

      expect(menu.categories).toHaveLength(1);
      expect(menu.categories[0].id.value).toBe('category-2');
    });

    it('카테고리를 삭제하면 해당 카테고리의 메뉴도 allDishes에서 사라진다', () => {
      const pizzaCategory = createCategory('category-1', 'Pizza');
      const pastaCategory = createCategory('category-2', 'Pasta');

      pizzaCategory.addDish(createDish('dish-1', 'Margherita Pizza'));
      pastaCategory.addDish(createDish('dish-2', 'Carbonara'));

      const menu = createMenu([pizzaCategory, pastaCategory]);

      menu.deleteCategory(new CategoryId('category-1'));

      expect(menu.allDishes).toHaveLength(1);
      expect(menu.allDishes[0].id.value).toBe('dish-2');
    });

    it('존재하지 않는 카테고리를 삭제하면 예외를 던진다', () => {
      const menu = createMenu();

      expect(() =>
        menu.deleteCategory(new CategoryId('unknown-category')),
      ).toThrow(NotFoundException);
    });
  });
});
