import { Category } from '../types';

export const APP_NAME = 'Money Clarity OS';
export const APP_VERSION = '1.0.0';
export const DEFAULT_CURRENCY = 'SGD';

export const FREE_TIER_LIMITS = {
  maxTransactions: 30,
  maxBudgets: 1,
  maxGoals: 1,
  warningThreshold: 28,
} as const;

export const PRO_PRICE_SGD = 39;

export const MIN_DAYS_FOR_HEALTH_SCORE = 14;

export const CURRENCIES = [
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
] as const;

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    name: 'Salary',
    type: 'income',
    icon: 'Briefcase',
    colour: '#16653A',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Freelance',
    type: 'income',
    icon: 'Laptop',
    colour: '#16653A',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Investment',
    type: 'income',
    icon: 'TrendingUp',
    colour: '#16653A',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Gift',
    type: 'income',
    icon: 'Gift',
    colour: '#16653A',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Other Income',
    type: 'income',
    icon: 'Plus',
    colour: '#16653A',
    isSystem: true,
    isCustom: false,
  },
];

export const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    name: 'Food & Dining',
    type: 'expense',
    icon: 'UtensilsCrossed',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Transport',
    type: 'expense',
    icon: 'Car',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Shopping',
    type: 'expense',
    icon: 'ShoppingBag',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Entertainment',
    type: 'expense',
    icon: 'Film',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Bills & Utilities',
    type: 'expense',
    icon: 'Receipt',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Healthcare',
    type: 'expense',
    icon: 'Heart',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Education',
    type: 'expense',
    icon: 'GraduationCap',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Housing',
    type: 'expense',
    icon: 'Home',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Insurance',
    type: 'expense',
    icon: 'Shield',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
  {
    name: 'Other Expense',
    type: 'expense',
    icon: 'Minus',
    colour: '#9B3121',
    isSystem: true,
    isCustom: false,
  },
];
