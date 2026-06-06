export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  date: string;
  notes?: string;
  tags?: string[];
  isRecurring?: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  colour: string;
  isSystem: boolean;
  isCustom: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  limitAmount: number;
  period: 'monthly';
  startDate: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: number;
}

export interface Debt {
  id: string;
  name: string;
  originalAmount: number;
  currentBalance: number;
  interestRate?: number;
  minimumPayment?: number;
  createdAt: number;
}

export interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
  createdAt: number;
}

export interface Settings {
  id: 'singleton';
  currency: string;
  isPro: boolean;
  proUnlockedAt?: number;
  theme: 'light' | 'dark';
  onboardingComplete: boolean;
}

export interface HealthScoreResult {
  total: number;
  savingsRate: number;
  budgetControl: number;
  cashflow: number;
  goalProgress: number;
  debtRatio: number;
  band: 'Thriving' | 'Building' | 'Attention needed';
}
