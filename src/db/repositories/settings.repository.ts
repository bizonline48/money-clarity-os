import { db } from '../schema';
import { Settings } from '../../types';

export class SettingsRepository {
  async get(): Promise<Settings | undefined> {
    return await db.settings.get('singleton');
  }

  async update(updates: Partial<Settings>): Promise<number> {
    return await db.settings.update('singleton', updates);
  }

  async reset(): Promise<void> {
    await db.settings.delete('singleton');
  }
}

export const settingsRepository = new SettingsRepository();
