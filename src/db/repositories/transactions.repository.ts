import { db } from '../schema';
import { Transaction } from '../../types';

export class TransactionsRepository {
  async getAll(): Promise<Transaction[]> {
    return await db.transactions.toArray();
  }

  async getById(id: string): Promise<Transaction | undefined> {
    return await db.transactions.get(id);
  }

  async getByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    return await db.transactions.where('type').equals(type).toArray();
  }

  async getByCategoryId(categoryId: string): Promise<Transaction[]> {
    return await db.transactions.where('categoryId').equals(categoryId).toArray();
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    return await db.transactions
      .where('date')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  async count(): Promise<number> {
    return await db.transactions.count();
  }

  async create(transaction: Transaction): Promise<string> {
    return await db.transactions.add(transaction);
  }

  async update(id: string, updates: Partial<Transaction>): Promise<number> {
    return await db.transactions.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await db.transactions.delete(id);
  }

  async deleteAll(): Promise<void> {
    await db.transactions.clear();
  }
}

export const transactionsRepository = new TransactionsRepository();
