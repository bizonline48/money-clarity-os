import { db } from '../schema';
import { Budget } from '../../types';

export class BudgetsRepository {
  async getAll(): Promise<Budget[]> {
    return await db.budgets.toArray();
  }

  async getById(id: string): Promise<Budget | undefined> {
    return await db.budgets.get(id);
  }

  async getByCategoryId(categoryId: string): Promise<Budget | undefined> {
    return await db.budgets.where('categoryId').equals(categoryId).first();
  }

  async count(): Promise<number> {
    return await db.budgets.count();
  }

  async create(budget: Budget): Promise<string> {
    return await db.budgets.add(budget);
  }

  async update(id: string, updates: Partial<Budget>): Promise<number> {
    return await db.budgets.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await db.budgets.delete(id);
  }

  async deleteAll(): Promise<void> {
    await db.budgets.clear();
  }
}

export const budgetsRepository = new BudgetsRepository();
