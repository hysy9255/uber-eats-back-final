import { DishFactory } from '../factories/dish.factory';
import { DishName } from './dish-name';

describe('equals', () => {
  const createDish = () =>
    DishFactory.create(
      '  Margherita Pizza  ',
      15000,
      'Tomato sauce and mozzarella',
      'https://example.com/margherita.jpg',
      'dish-1',
    );
  it('정규화된 이름과 같으면 true를 반환한다', () => {
    const dish = createDish();

    expect(dish.name.equals(new DishName('margherita pizza'))).toBe(true);
  });

  it('raw 값이 대문자나 공백이 포함되도 true를 반환한다', () => {
    const dish = createDish();

    expect(dish.name.equals(new DishName('Margherita Pizza'))).toBe(true);
    expect(dish.name.equals(new DishName('  margherita pizza  '))).toBe(true);
  });

  it('다른 메뉴명이면 false를 반환한다', () => {
    const dish = createDish();

    expect(dish.name.equals(new DishName('pepperoni pizza'))).toBe(false);
  });
});
