import { Category } from '../entities/category';
import { CategoryId } from './category-id';
import { CategoryName } from './category-name';

describe('CategoryName', () => {
  describe('create', () => {
    it('앞뒤 공백을 제거하고 소문자로 정규화한다', () => {
      const categoryName = new CategoryName('  PIZZA  ');

      expect(categoryName.value).toBe('pizza');
    });
  });
});

describe('equals', () => {
  const createCategory = () =>
    new Category(new CategoryId('category-1'), new CategoryName('  Pizza  '));

  it('정규화된 이름과 같으면 true를 반환한다', () => {
    const category = createCategory();

    expect(category.name.equals(new CategoryName('pizza'))).toBe(true);
  });

  it('raw 값이 대문자나 공백을 가지면 정규화를 하기 때문에 true를 반환한다', () => {
    const category = createCategory();

    expect(category.name.equals(new CategoryName('Pizza'))).toBe(true);
    expect(category.name.equals(new CategoryName('  pizza  '))).toBe(true);
  });

  it('다른 카테고리 이름이면 false를 반환한다', () => {
    const category = createCategory();

    expect(category.name.equals(new CategoryName('pasta'))).toBe(false);
  });
});
