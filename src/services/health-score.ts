import { differenceInDays, startOfDay } from 'date-fns';
import { Transaction, Budget, Goal, Debt } from '../types';
import { HealthScoreResult } from '../types';
import { MIN_DAYS_FOR_HEALTH_SCORE } from '../lib/constants';
import { centsToDecimal } from './money';

interface HealthScoreInput {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
}

export function calculateHealthScore(input: HealthScoreInput): HealthScoreResult | null {
  const { transactions, budgets, goals, debts } = input;

  if (transactions.length === 0) {
    return null;
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const oldestDate = new Date(sortedTransactions[0].date);
  const today = startOfDay(new Date());
  const daysSinceFirstTransaction = differenceInDays(today, oldestDate);

  if (daysSinceFirstTransaction < MIN_DAYS_FOR_HEALTH_SCORE) {
    return null;
  }

  const savingsRate = calculateSavingsRate(transactions);
  const budgetControl = calculateBudgetControl(transactions, budgets);
  const cashflow = calculateCashflow(transactions);
  const goalProgress = calculateGoalProgress(goals);
  const debtRatio = calculateDebtRatio(transactions, debts);

  const total = savingsRate + budgetControl + cashflow + goalProgress + debtRatio;

  let band: 'Thriving' | 'Building' | 'Attention needed';
  if (total >= 80) {
    band = 'Thriving';
  } else if (total >= 50) {
    band = 'Building';
  } else {
    band = 'Attention needed';
  }

  return {
    total: Math.round(total),
    savingsRate: Math.round(savingsRate * 10) / 10,
    budgetControl: Math.round(budgetControl * 10) / 10,
    cashflow: Math.round(cashflow * 10) / 10,
    goalProgress: Math.round(goalProgress * 10) / 10,
    debtRatio: Math.round(debtRatio * 10) / 10,
    band,
  };
}

function calculateSavingsRate(transactions: Transaction[]): number {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome === 0) {
    return 0;
  }

  const savingsAmount = totalIncome - totalExpenses;
  const savingsRatePercentage = (savingsAmount / totalIncome) * 100;

  if (savingsRatePercentage >= 20) {
    return 25;
  }

  if (savingsRatePercentage < 0) {
    return 0;
  }

  return (savingsRatePercentage / 20) * 25;
}

function calculateBudgetControl(transactions: Transaction[], budgets: Budget[]): number {
  if (budgets.length === 0) {
    return 25;
  }

  const activeBudgets = budgets.filter((b) => {
    const budgetStart = new Date(b.startDate);
    const now = new Date();
    return now >= budgetStart;
  });

  if (activeBudgets.length === 0) {
    return 25;
  }

  const currentMonth = new Date().toISOString().slice(0, 7);

  const budgetsRespected = activeBudgets.filter((budget) => {
    const categoryTransactions = transactions.filter(
      (t) => t.categoryId === budget.categoryId && t.date.startsWith(currentMonth)
    );

    const totalSpent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return totalSpent <= budget.limitAmount;
  });

  return (budgetsRespected.length / activeBudgets.length) * 25;
}

function calculateCashflow(transactions: Transaction[]): number {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome === 0) {
    return 0;
  }

  const netCashflow = totalIncome - totalExpenses;

  if (netCashflow <= 0) {
    return 0;
  }

  const margin = netCashflow / totalIncome;

  if (margin >= 0.2) {
    return 20;
  }

  return (margin / 0.2) * 20;
}

function calculateGoalProgress(goals: Goal[]): number {
  const activeGoals = goals.filter((g) => g.status === 'active');

  if (activeGoals.length === 0) {
    return 15;
  }

  const today = new Date();

  const goalsOnTrack = activeGoals.filter((goal) => {
    const targetDate = new Date(goal.targetDate);
    const createdDate = new Date(goal.createdAt);

    if (today > targetDate) {
      return goal.currentAmount >= goal.targetAmount;
    }

    const totalDays = differenceInDays(targetDate, createdDate);
    const daysPassed = differenceInDays(today, createdDate);

    if (totalDays <= 0) {
      return goal.currentAmount >= goal.targetAmount;
    }

    const expectedProgress = (daysPassed / totalDays) * goal.targetAmount;
    const actualProgress = goal.currentAmount;

    return actualProgress >= expectedProgress;
  });

  return (goalsOnTrack.length / activeGoals.length) * 15;
}

function calculateDebtRatio(transactions: Transaction[], debts: Debt[]): number {
  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);

  if (totalDebt === 0) {
    return 15;
  }

  const monthlyIncome = calculateMonthlyIncome(transactions);

  if (monthlyIncome === 0) {
    return 0;
  }

  const debtToIncomeRatio = centsToDecimal(totalDebt).dividedBy(centsToDecimal(monthlyIncome)).toNumber();

  if (debtToIncomeRatio >= 5) {
    return 0;
  }

  if (debtToIncomeRatio < 1) {
    return 15;
  }

  return ((5 - debtToIncomeRatio) / 4) * 15;
}

function calculateMonthlyIncome(transactions: Transaction[]): number {
  const incomeTransactions = transactions.filter((t) => t.type === 'income');

  if (incomeTransactions.length === 0) {
    return 0;
  }

  const sortedIncome = [...incomeTransactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const oldestDate = new Date(sortedIncome[0].date);
  const newestDate = new Date(sortedIncome[sortedIncome.length - 1].date);
  const daysDiff = differenceInDays(newestDate, oldestDate);

  if (daysDiff === 0) {
    return 0;
  }

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const monthsDiff = daysDiff / 30.44;

  return Math.round(totalIncome / monthsDiff);
}
