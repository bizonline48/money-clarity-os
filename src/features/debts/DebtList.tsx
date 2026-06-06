import { useEffect, useState } from 'react';
import { Plus, DollarSign, Lock } from 'lucide-react';
import { Button, Card, ProgressBar, Badge } from '../../design-system/components';
import { BottomSheet } from '../../design-system/components/BottomSheet';
import { debtsRepository } from '../../db/repositories/debts.repository';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { formatCurrency } from '../../services/money';
import { Debt } from '../../types';
import { DebtForm } from './DebtForm';

export function DebtList(): JSX.Element {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currency, setCurrency] = useState('SGD');
  const [isPro, setIsPro] = useState(false);

  const loadData = async () => {
    const settings = await settingsRepository.get();
    setCurrency(settings?.currency || 'SGD');
    setIsPro(settings?.isPro || false);

    const allDebts = await debtsRepository.getAll();
    setDebts(allDebts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormClose = () => {
    setIsFormOpen(false);
    loadData();
  };

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-mc-text-1">Debt Tracker</h1>
        <Button onClick={() => setIsFormOpen(true)} size="sm">
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {!isPro && (
        <Card variant="subtle" className="mb-4 border-l-4 border-mc-info">
          <div className="flex items-start gap-3">
            <Lock className="text-mc-info" size={20} />
            <div>
              <p className="text-sm font-medium text-mc-text-1">Interest tracking is a Pro feature</p>
              <p className="text-xs text-mc-text-2">Upgrade to see interest rates and payoff projections</p>
            </div>
          </div>
        </Card>
      )}

      {debts.length === 0 ? (
        <Card variant="elevated" className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-mc-bg-subtle p-6">
              <DollarSign size={32} className="text-mc-text-3" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-mc-text-1">No debts tracked</h3>
            <p className="mb-4 text-sm text-mc-text-2">Add debts to track your repayment progress</p>
            <Button onClick={() => setIsFormOpen(true)}>Add Debt</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {debts.map((debt) => {
            const progress = ((debt.originalAmount - debt.currentBalance) / debt.originalAmount) * 100;
            const isFullyPaid = debt.currentBalance === 0;

            return (
              <Card key={debt.id} variant="default">
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-mc-text-1">{debt.name}</h3>
                      <p className="text-sm text-mc-text-3">
                        Original: {formatCurrency(debt.originalAmount, currency)}
                      </p>
                    </div>
                    {isFullyPaid ? (
                      <Badge variant="success">Paid Off</Badge>
                    ) : (
                      <Badge variant="warning">Active</Badge>
                    )}
                  </div>

                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm text-mc-text-2">Remaining Balance</span>
                    <span className="text-2xl font-bold text-mc-expense tabular-nums">
                      {formatCurrency(debt.currentBalance, currency)}
                    </span>
                  </div>

                  <ProgressBar value={progress} variant="success" showLabel />

                  {isPro && debt.interestRate !== undefined && debt.interestRate > 0 && (
                    <div className="mt-3 space-y-1 rounded-mc-sm bg-mc-bg-subtle p-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-mc-text-2">Interest Rate</span>
                        <span className="font-medium text-mc-text-1">{debt.interestRate}% APR</span>
                      </div>
                      {debt.minimumPayment && (
                        <div className="flex justify-between text-sm">
                          <span className="text-mc-text-2">Minimum Payment</span>
                          <span className="font-medium text-mc-text-1 tabular-nums">
                            {formatCurrency(debt.minimumPayment, currency)}/mo
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <BottomSheet
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title="Add Debt"
      >
        <DebtForm onSuccess={handleFormClose} onCancel={handleFormClose} isPro={isPro} />
      </BottomSheet>
    </div>
  );
}
