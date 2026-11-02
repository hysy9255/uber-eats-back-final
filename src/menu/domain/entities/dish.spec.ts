import { DishFactory } from '../factories/dish.factory';
import { DishDescription } from '../value-objects/dish-description';
import { DishImageUrl } from '../value-objects/dish-image-url';
import { DishName } from '../value-objects/dish-name';
import { Price } from '../value-objects/price';

describe('Dish', () => {
  const createDish = () =>
    DishFactory.create(
      '  Margherita Pizza  ',
      15000,
      'Tomato sauce and mozzarella',
      'https://example.com/margherita.jpg',
      'dish-1',
    );

  describe('create', () => {
    it('primitive 값을 받아 Dish와 내부 VO를 생성한다', () => {
      const dish = createDish();

      expect(dish.id.value).toBe('dish-1');

      // DishName.create()에서 trim + toLowerCase 처리됨
      expect(dish.name.value).toBe('margherita pizza');

      expect(dish.price.value).toBe(15000);
      expect(dish.description.value).toBe('Tomato sauce and mozzarella');
      expect(dish.dishImgUrl.value).toBe('https://example.com/margherita.jpg');
    });
  });

  describe('update', () => {
    it('전달된 모든 메뉴 정보를 변경한다', () => {
      const dish = createDish();

      dish.update(
        new DishName('  Pepperoni Pizza  '),
        new Price(18000),
        new DishDescription('Pepperoni and mozzarella'),
        new DishImageUrl('https://example.com/pepperoni.jpg'),
      );

      expect(dish.name.value).toBe('pepperoni pizza');
      expect(dish.price.value).toBe(18000);
      expect(dish.description.value).toBe('Pepperoni and mozzarella');
      expect(dish.dishImgUrl.value).toBe('https://example.com/pepperoni.jpg');
    });

    it('일부 값만 전달하면 나머지 값은 유지한다', () => {
      const dish = createDish();

      dish.update(new DishName('  New Pizza Name  '));

      expect(dish.name.value).toBe('new pizza name');
      expect(dish.price.value).toBe(15000);
      expect(dish.description.value).toBe('Tomato sauce and mozzarella');
      expect(dish.dishImgUrl.value).toBe('https://example.com/margherita.jpg');
    });

    it('가격을 0으로 변경하면 Price VO의 검증 예외를 던진다', () => {
      const dish = createDish();

      expect(() => dish.update(undefined, new Price(0))).toThrow();
    });
  });
});
