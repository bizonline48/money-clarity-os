import { db } from '../schema';
import { Debt } from '../../types';

export class DebtsRepository {
  async getAll(): Promise<Debt[]> {
    return await db.debts.toArray();
  }

  async getById(id: string): Promise<Debt | undefined> {
    return await db.debts.get(id);
  }

  async create(debt: Debt): Promise<string> {
    return await db.debts.add(debt);
  }

  async update(id: string, updates: Partial<Debt>): Promise<number> {
    return await db.debts.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await db.debts.delete(id);
  }

  async deleteAll(): Promise<void> {
    await db.debts.clear();
  }
}

export const debtsRepository = new DebtsRepository();
