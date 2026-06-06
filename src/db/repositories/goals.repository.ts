import { db } from '../schema';
import { Goal } from '../../types';

export class GoalsRepository {
  async getAll(): Promise<Goal[]> {
    return await db.goals.toArray();
  }

  async getById(id: string): Promise<Goal | undefined> {
    return await db.goals.get(id);
  }

  async getByStatus(status: 'active' | 'completed' | 'paused'): Promise<Goal[]> {
    return await db.goals.where('status').equals(status).toArray();
  }

  async count(): Promise<number> {
    return await db.goals.count();
  }

  async countActive(): Promise<number> {
    return await db.goals.where('status').equals('active').count();
  }

  async create(goal: Goal): Promise<string> {
    return await db.goals.add(goal);
  }

  async update(id: string, updates: Partial<Goal>): Promise<number> {
    return await db.goals.update(id, updates);
  }

  async delete(id: string): Promise<void> {
    await db.goals.delete(id);
  }

  async deleteAll(): Promise<void> {
    await db.goals.clear();
  }
}

export const goalsRepository = new GoalsRepository();
