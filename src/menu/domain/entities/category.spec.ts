import { DishFactory } from '../factories/dish.factory';
import { CategoryId } from '../value-objects/category-id';
import { CategoryName } from '../value-objects/category-name';
import { DishId } from '../value-objects/dish-id';
import { Category } from './category';
import { Dish } from './dish';

describe('Category', () => {
  const createDish = (id = 'dish-1', name = 'Margherita Pizza'): Dish =>
    DishFactory.create(
      name,
      15000,
      'Tomato sauce and mozzarella',
      'https://example.com/margherita.jpg',
      id,
    );

  const createCategory = () =>
    new Category(new CategoryId('category-1'), new CategoryName('  Pizza  '));

  describe('create', () => {
    it('카테고리를 생성하고 이름을 정규화한다', () => {
      const category = createCategory();

      expect(category.id.value).toBe('category-1');
      expect(category.name.value).toBe('pizza');
      expect(category.dishes).toEqual([]);
    });
  });

  describe('addDish', () => {
    it('카테고리에 메뉴를 추가한다', () => {
      const category = createCategory();
      const dish = createDish();

      category.addDish(dish);

      expect(category.dishes).toHaveLength(1);
      expect(category.dishes[0]).toBe(dish);
    });
  });

  describe('deleteDish', () => {
    it('해당 dishId의 메뉴만 삭제한다', () => {
      const category = createCategory();

      category.addDish(createDish('dish-1', 'Margherita Pizza'));
      category.addDish(createDish('dish-2', 'Pepperoni Pizza'));

      category.deleteDish(new DishId('dish-1'));

      expect(category.dishes).toHaveLength(1);
      expect(category.dishes[0].id.value).toBe('dish-2');
    });

    it('존재하지 않는 메뉴를 삭제해도 기존 메뉴는 유지된다', () => {
      const category = createCategory();
      category.addDish(createDish('dish-1'));

      category.deleteDish(new DishId('unknown-dish'));

      expect(category.dishes).toHaveLength(1);
      expect(category.dishes[0].id.value).toBe('dish-1');
    });
  });

  describe('hasDish', () => {
    it('해당 메뉴가 존재하면 true를 반환한다', () => {
      const category = createCategory();
      category.addDish(createDish('dish-1'));

      expect(category.hasDish(new DishId('dish-1'))).toBe(true);
    });

    it('해당 메뉴가 없으면 false를 반환한다', () => {
      const category = createCategory();

      expect(category.hasDish(new DishId('unknown-dish'))).toBe(false);
    });
  });

  describe('replaceDishes', () => {
    it('메뉴 목록 전체를 교체한다', () => {
      const category = createCategory();

      const dishes = [
        createDish('dish-1', 'Margherita Pizza'),
        createDish('dish-2', 'Pepperoni Pizza'),
      ];

      category.replaceDishes(dishes);

      expect(category.dishes).toHaveLength(2);
      expect(category.dishes.map((dish) => dish.id.value)).toEqual([
        'dish-1',
        'dish-2',
      ]);
    });
  });

  describe('rename', () => {
    it('카테고리 이름을 변경하고 정규화한다', () => {
      const category = createCategory();

      category.rename(new CategoryName('  PASTA  '));

      expect(category.name.value).toBe('pasta');
    });
  });
});
