import Dexie, { Table } from 'dexie';
import {
  Transaction,
  Category,
  Budget,
  Goal,
  Debt,
  DebtPayment,
  Settings,
} from '../types';
import {
  DEFAULT_INCOME_CATEGORIES,
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_CURRENCY,
} from '../lib/constants';
import { generateId } from '../lib/utils';

export class MoneyClarigyDatabase extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  budgets!: Table<Budget>;
  goals!: Table<Goal>;
  debts!: Table<Debt>;
  debtPayments!: Table<DebtPayment>;
  settings!: Table<Settings>;

  constructor() {
    super('MoneyClarigyOS');

    this.version(1).stores({
      transactions: 'id, type, categoryId, date, createdAt',
      categories: 'id, type, isSystem, isCustom',
      budgets: 'id, categoryId, startDate',
      goals: 'id, status, targetDate, createdAt',
      debts: 'id, createdAt',
      debtPayments: 'id, debtId, date, createdAt',
      settings: 'id',
    });
  }
}

export const db = new MoneyClarigyDatabase();

export async function initialiseDatabase(): Promise<void> {
  const existingSettings = await db.settings.get('singleton');

  if (!existingSettings) {
    await db.settings.add({
      id: 'singleton',
      currency: DEFAULT_CURRENCY,
      isPro: false,
      theme: 'light',
      onboardingComplete: false,
    });
  }

  const existingCategories = await db.categories.count();

  if (existingCategories === 0) {
    const incomeCategories: Category[] = DEFAULT_INCOME_CATEGORIES.map((cat) => ({
      ...cat,
      id: generateId(),
    }));

    const expenseCategories: Category[] = DEFAULT_EXPENSE_CATEGORIES.map((cat) => ({
      ...cat,
      id: generateId(),
    }));

    await db.categories.bulkAdd([...incomeCategories, ...expenseCategories]);
  }
}
