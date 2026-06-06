import { useEffect, useState } from 'react';
import { Plus, Lock } from 'lucide-react';
import { Button, Card, ProgressBar, Badge } from '../../design-system/components';
import { BottomSheet } from '../../design-system/components/BottomSheet';
import { budgetsRepository } from '../../db/repositories/budgets.repository';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { formatCurrency } from '../../services/money';
import { Budget } from '../../types';
import { BudgetForm } from './BudgetForm';
import { FREE_TIER_LIMITS } from '../../lib/constants';
import { startOfMonth, endOfMonth } from 'date-fns';
import { ProUpgradeModal } from '../settings/ProUpgradeModal';

interface BudgetWithDetails extends Budget {
  categoryName: string;
  spent: number;
  percentage: number;
  remaining: number;
}

export function BudgetList(): JSX.Element {
  const [budgets, setBudgets] = useState<BudgetWithDetails[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [currency, setCurrency] = useState('SGD');
  const [isPro, setIsPro] = useState(false);
  const [budgetCount, setBudgetCount] = useState(0);

  const loadData = async () => {
    const settings = await settingsRepository.get();
    setCurrency(settings?.currency || 'SGD');
    setIsPro(settings?.isPro || false);

    const allBudgets = await budgetsRepository.getAll();
    const categories = await categoriesRepository.getAll();

    const now = new Date();
    const monthStart = startOfMonth(now).toISOString().split('T')[0];
    const monthEnd = endOfMonth(now).toISOString().split('T')[0];
    const monthTransactions = await transactionsRepository.getByDateRange(monthStart, monthEnd);

    const budgetsWithDetails: BudgetWithDetails[] = await Promise.all(
      allBudgets.map(async (budget) => {
        const category = categories.find(c => c.id === budget.categoryId);
        const spent = monthTransactions
          .filter(t => t.categoryId === budget.categoryId && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        const percentage = (spent / budget.limitAmount) * 100;
        const remaining = budget.limitAmount - spent;

        return {
          ...budget,
          categoryName: category?.name || 'Unknown',
          spent,
          percentage,
          remaining,
        };
      })
    );

    setBudgets(budgetsWithDetails);
    setBudgetCount(budgetsWithDetails.length);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    if (!isPro && budgetCount >= FREE_TIER_LIMITS.maxBudgets) {
      setShowProModal(true);
      return;
    }
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    loadData();
  };

  const getProgressVariant = (percentage: number): 'success' | 'warning' | 'error' => {
    if (percentage >= 100) return 'error';
    if (percentage >= 80) return 'warning';
    return 'success';
  };

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-mc-text-1">Budgets</h1>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {!isPro && budgetCount >= FREE_TIER_LIMITS.maxBudgets && (
        <Card variant="subtle" className="mb-4 border-l-4 border-mc-warning">
          <div className="flex items-start gap-3">
            <Lock className="text-mc-warning" size={20} />
            <div>
              <p className="text-sm font-medium text-mc-text-1">Budget limit reached</p>
              <p className="text-xs text-mc-text-2">Upgrade to Pro for unlimited budgets</p>
            </div>
          </div>
        </Card>
      )}

      {budgets.length === 0 ? (
        <Card variant="elevated" className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-mc-bg-subtle p-6">
              <Plus size={32} className="text-mc-text-3" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-mc-text-1">No budgets yet</h3>
            <p className="mb-4 text-sm text-mc-text-2">Set spending limits to stay on track</p>
            <Button onClick={handleAdd}>Create Budget</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => (
            <Card key={budget.id} variant="default">
              <div className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-mc-text-1">{budget.categoryName}</h3>
                    <p className="text-sm text-mc-text-3">Monthly budget</p>
                  </div>
                  {budget.percentage >= 100 ? (
                    <Badge variant="error">Over budget</Badge>
                  ) : budget.percentage >= 80 ? (
                    <Badge variant="warning">Warning</Badge>
                  ) : (
                    <Badge variant="success">On track</Badge>
                  )}
                </div>

                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-sm text-mc-text-2">Spent</span>
                  <span className="font-semibold text-mc-text-1 tabular-nums">
                    {formatCurrency(budget.spent, currency)} of {formatCurrency(budget.limitAmount, currency)}
                  </span>
                </div>

                <ProgressBar value={budget.percentage} variant={getProgressVariant(budget.percentage)} />

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-mc-text-3">Remaining</span>
                  <span className={`font-medium tabular-nums ${budget.remaining >= 0 ? 'text-mc-income' : 'text-mc-expense'}`}>
                    {formatCurrency(Math.abs(budget.remaining), currency)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <BottomSheet
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title="Create Budget"
      >
        <BudgetForm onSuccess={handleFormClose} onCancel={handleFormClose} />
      </BottomSheet>

      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        feature="Unlimited Budgets"
        benefits={[
          'Create unlimited budgets',
          'Track all your spending categories',
          'Unlimited transactions',
          'Dark mode',
          'Multi-currency support',
          'Data export (CSV, JSON, PDF)',
          'Advanced debt tracking',
          'Full health score breakdown'
        ]}
      />
    </div>
  );
}
