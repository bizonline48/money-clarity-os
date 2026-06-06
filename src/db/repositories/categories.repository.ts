import { db } from '../schema';
import { Category } from '../../types';

export class CategoriesRepository {
  async getAll(): Promise<Category[]> {
    return await db.categories.toArray();
  }

  async getById(id: string): Promise<Category | undefined> {
    return await db.categories.get(id);
  }

  async getByType(type: 'income' | 'expense'): Promise<Category[]> {
    return await db.categories.where('type').equals(type).toArray();
  }

  async getSystemCategories(): Promise<Category[]> {
    return await db.categories.where('isSystem').equals(1).toArray();
  }

  async getCustomCategories(): Promise<Category[]> {
    return await db.categories.where('isCustom').equals(1).toArray();
  }

  async create(category: Category): Promise<string> {
    return await db.categories.add(category);
  }

  async update(id: string, updates: Partial<Category>): Promise<number> {
    return await db.categories.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    const category = await this.getById(id);
    if (category && category.isSystem) {
      throw new Error('Cannot delete system category');
    }
    await db.categories.delete(id);
  }

  async deleteAll(): Promise<void> {
    await db.categories.clear();
  }
}

export const categoriesRepository = new CategoriesRepository();
