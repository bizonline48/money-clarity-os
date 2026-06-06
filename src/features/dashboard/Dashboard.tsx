import { useEffect, useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, ProgressBar, Badge } from '../../design-system/components';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { budgetsRepository } from '../../db/repositories/budgets.repository';
import { goalsRepository } from '../../db/repositories/goals.repository';
import { debtsRepository } from '../../db/repositories/debts.repository';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { calculateHealthScore } from '../../services/health-score';
import { formatCurrency } from '../../services/money';
import { startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyStats {
  income: number;
  expenses: number;
  netCashflow: number;
}

export function Dashboard(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({ income: 0, expenses: 0, netCashflow: 0 });
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [healthBand, setHealthBand] = useState<string>('');
  const [healthPillars, setHealthPillars] = useState<any>(null);
  const [topCategories, setTopCategories] = useState<Array<{ name: string; amount: number; percentage: number }>>([]);
  const [firstGoal, setFirstGoal] = useState<{ name: string; progress: number } | null>(null);
  const [firstBudget, setFirstBudget] = useState<{ categoryName: string; remaining: number; used: number; limit: number } | null>(null);
  const [currency, setCurrency] = useState('SGD');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      try {
        const settings = await settingsRepository.get();
        const userCurrency = settings?.currency || 'SGD';
        setCurrency(userCurrency);
        setIsPro(settings?.isPro || false);

        const now = new Date();
        const monthStart = startOfMonth(now).toISOString().split('T')[0];
        const monthEnd = endOfMonth(now).toISOString().split('T')[0];

        const monthTransactions = await transactionsRepository.getByDateRange(monthStart, monthEnd);

        const income = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        setMonthlyStats({
          income,
          expenses,
          netCashflow: income - expenses,
        });

        const allTransactions = await transactionsRepository.getAll();
        const allBudgets = await budgetsRepository.getAll();
        const allGoals = await goalsRepository.getAll();
        const allDebts = await debtsRepository.getAll();

        const score = calculateHealthScore({
          transactions: allTransactions,
          budgets: allBudgets,
          goals: allGoals,
          debts: allDebts,
        });

        if (score) {
          setHealthScore(score.total);
          setHealthBand(score.band);
          setHealthPillars({
            savingsRate: score.savingsRate,
            budgetControl: score.budgetControl,
            cashflow: score.cashflow,
            goalProgress: score.goalProgress,
            debtRatio: score.debtRatio,
          });
        }

        const categories = await categoriesRepository.getAll();
        const expenseCategories = categories.filter(c => c.type === 'expense');

        const categorySpending = expenseCategories.map(cat => {
          const catTransactions = monthTransactions.filter(t => t.categoryId === cat.id && t.type === 'expense');
          const total = catTransactions.reduce((sum, t) => sum + t.amount, 0);
          return { name: cat.name, amount: total };
        }).filter(c => c.amount > 0)
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3);

        const totalExpenses = expenses || 1;
        const categoriesWithPercentage = categorySpending.map(cat => ({
          ...cat,
          percentage: (cat.amount / totalExpenses) * 100,
        }));

        setTopCategories(categoriesWithPercentage);

        const activeGoals = await goalsRepository.getByStatus('active');
        if (activeGoals.length > 0) {
          const goal = activeGoals[0];
          setFirstGoal({
            name: goal.name,
            progress: (goal.currentAmount / goal.targetAmount) * 100,
          });
        }

        const budgets = await budgetsRepository.getAll();
        if (budgets.length > 0) {
          const budget = budgets[0];
          const budgetCategory = categories.find(c => c.id === budget.categoryId);
          const budgetTransactions = monthTransactions.filter(t => t.categoryId === budget.categoryId && t.type === 'expense');
          const spent = budgetTransactions.reduce((sum, t) => sum + t.amount, 0);
          const remaining = budget.limitAmount - spent;

          setFirstBudget({
            categoryName: budgetCategory?.name || 'Unknown',
            remaining,
            used: spent,
            limit: budget.limitAmount,
          });
        }

      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mc-bg-base px-4 py-6">
        <Skeleton variant="text" height={32} width={200} className="mb-6" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
        <div className="mt-6">
          <Skeleton variant="card" height={200} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-mc-text-1">Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card variant="elevated">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-mc-text-2">Income</p>
                <p className="mt-1 text-2xl font-bold text-mc-income tabular-nums">
                  {formatCurrency(monthlyStats.income, currency)}
                </p>
                <p className="mt-1 text-xs text-mc-text-3">This month</p>
              </div>
              <div className="rounded-full bg-mc-income/10 p-2">
                <ArrowUpCircle className="text-mc-income" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-mc-text-2">Expenses</p>
                <p className="mt-1 text-2xl font-bold text-mc-expense tabular-nums">
                  {formatCurrency(monthlyStats.expenses, currency)}
                </p>
                <p className="mt-1 text-xs text-mc-text-3">This month</p>
              </div>
              <div className="rounded-full bg-mc-expense/10 p-2">
                <ArrowDownCircle className="text-mc-expense" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-mc-text-2">Net Cashflow</p>
                <p className={`mt-1 text-2xl font-bold tabular-nums ${monthlyStats.netCashflow >= 0 ? 'text-mc-income' : 'text-mc-expense'}`}>
                  {formatCurrency(monthlyStats.netCashflow, currency)}
                </p>
                <p className="mt-1 text-xs text-mc-text-3">This month</p>
              </div>
              <div className={`rounded-full p-2 ${monthlyStats.netCashflow >= 0 ? 'bg-mc-income/10' : 'bg-mc-expense/10'}`}>
                <TrendingUp className={monthlyStats.netCashflow >= 0 ? 'text-mc-income' : 'text-mc-expense'} size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {healthScore !== null && (
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <CardTitle>Financial Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-mc-accent tabular-nums">
                  {healthScore}
                </div>
                <div>
                  <Badge variant={healthBand === 'Thriving' ? 'success' : healthBand === 'Building' ? 'warning' : 'error'}>
                    {healthBand}
                  </Badge>
                  <p className="mt-1 text-sm text-mc-text-3">out of 100</p>
                </div>
              </div>
            </div>

            {isPro && healthPillars && (
              <div className="mt-6 space-y-3 border-t border-mc-border pt-4">
                <p className="text-sm font-medium text-mc-text-2">Breakdown by Pillar</p>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-mc-text-2">Savings Rate</span>
                    <span className="font-medium tabular-nums text-mc-text-1">{healthPillars.savingsRate}/25</span>
                  </div>
                  <ProgressBar value={(healthPillars.savingsRate / 25) * 100} variant="success" />
                  <p className="mt-1 text-xs text-mc-text-3">Measures income saved vs spent</p>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-mc-text-2">Budget Control</span>
                    <span className="font-medium tabular-nums text-mc-text-1">{healthPillars.budgetControl}/25</span>
                  </div>
                  <ProgressBar value={(healthPillars.budgetControl / 25) * 100} variant="success" />
                  <p className="mt-1 text-xs text-mc-text-3">Percentage of budgets respected</p>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-mc-text-2">Cashflow</span>
                    <span className="font-medium tabular-nums text-mc-text-1">{healthPillars.cashflow}/20</span>
                  </div>
                  <ProgressBar value={(healthPillars.cashflow / 20) * 100} variant="success" />
                  <p className="mt-1 text-xs text-mc-text-3">Income exceeds expenses</p>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-mc-text-2">Goal Progress</span>
                    <span className="font-medium tabular-nums text-mc-text-1">{healthPillars.goalProgress}/15</span>
                  </div>
                  <ProgressBar value={(healthPillars.goalProgress / 15) * 100} variant="success" />
                  <p className="mt-1 text-xs text-mc-text-3">Goals on track to completion</p>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-mc-text-2">Debt Ratio</span>
                    <span className="font-medium tabular-nums text-mc-text-1">{healthPillars.debtRatio}/15</span>
                  </div>
                  <ProgressBar value={(healthPillars.debtRatio / 15) * 100} variant="success" />
                  <p className="mt-1 text-xs text-mc-text-3">Total debt vs monthly income</p>
                </div>
              </div>
            )}

            {!isPro && (
              <div className="mt-4 rounded-mc-sm bg-mc-bg-subtle p-3 text-center">
                <p className="text-sm text-mc-text-2">Upgrade to Pro to see detailed pillar breakdown</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {topCategories.length > 0 && (
        <Card variant="default" className="mb-6">
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map((cat, index) => (
                <div key={index}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-mc-text-1">{cat.name}</span>
                    <span className="font-medium text-mc-text-1 tabular-nums">
                      {formatCurrency(cat.amount, currency)}
                    </span>
                  </div>
                  <ProgressBar value={cat.percentage} variant="default" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {firstGoal && (
          <Card variant="default">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} />
                Savings Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-mc-text-2">{firstGoal.name}</p>
              <ProgressBar value={firstGoal.progress} variant="success" showLabel />
            </CardContent>
          </Card>
        )}

        {firstBudget && (
          <Card variant="default">
            <CardHeader>
              <CardTitle>Budget Remaining</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-mc-text-2">{firstBudget.categoryName}</p>
              <p className="mb-2 text-xl font-bold text-mc-text-1 tabular-nums">
                {formatCurrency(firstBudget.remaining, currency)}
              </p>
              <ProgressBar
                value={(firstBudget.used / firstBudget.limit) * 100}
                variant={firstBudget.used > firstBudget.limit ? 'error' : firstBudget.used > firstBudget.limit * 0.8 ? 'warning' : 'success'}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
