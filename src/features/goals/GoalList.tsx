import { useEffect, useState } from 'react';
import { Plus, Target, Lock, PartyPopper } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Button, Card, ProgressBar, Badge } from '../../design-system/components';
import { BottomSheet } from '../../design-system/components/BottomSheet';
import { goalsRepository } from '../../db/repositories/goals.repository';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { formatCurrency } from '../../services/money';
import { Goal } from '../../types';
import { GoalForm } from './GoalForm';
import { FREE_TIER_LIMITS } from '../../lib/constants';
import { ProUpgradeModal } from '../settings/ProUpgradeModal';

export function GoalList(): JSX.Element {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [currency, setCurrency] = useState('SGD');
  const [isPro, setIsPro] = useState(false);
  const [goalCount, setGoalCount] = useState(0);

  const loadData = async () => {
    const settings = await settingsRepository.get();
    setCurrency(settings?.currency || 'SGD');
    setIsPro(settings?.isPro || false);

    const allGoals = await goalsRepository.getAll();
    setGoals(allGoals);
    setGoalCount(allGoals.filter(g => g.status === 'active').length);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    if (!isPro && goalCount >= FREE_TIER_LIMITS.maxGoals) {
      setShowProModal(true);
      return;
    }
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    loadData();
  };

  const getDaysRemaining = (targetDate: string): number => {
    return differenceInDays(new Date(targetDate), new Date());
  };

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-mc-text-1">Goals</h1>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {!isPro && goalCount >= FREE_TIER_LIMITS.maxGoals && (
        <Card variant="subtle" className="mb-4 border-l-4 border-mc-warning">
          <div className="flex items-start gap-3">
            <Lock className="text-mc-warning" size={20} />
            <div>
              <p className="text-sm font-medium text-mc-text-1">Goal limit reached</p>
              <p className="text-xs text-mc-text-2">Upgrade to Pro for unlimited goals</p>
            </div>
          </div>
        </Card>
      )}

      {goals.length === 0 ? (
        <Card variant="elevated" className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-mc-bg-subtle p-6">
              <Target size={32} className="text-mc-text-3" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-mc-text-1">No goals yet</h3>
            <p className="mb-4 text-sm text-mc-text-2">Set savings goals to track your progress</p>
            <Button onClick={handleAdd}>Create Goal</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const isCompleted = goal.status === 'completed' || progress >= 100;

            return (
              <Card key={goal.id} variant="default">
                <div className="p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {isCompleted && <PartyPopper size={20} className="text-mc-income" />}
                      <div>
                        <h3 className="font-semibold text-mc-text-1">{goal.name}</h3>
                        <p className="text-sm text-mc-text-3">
                          Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    {goal.status === 'completed' ? (
                      <Badge variant="success">Completed</Badge>
                    ) : goal.status === 'paused' ? (
                      <Badge variant="neutral">Paused</Badge>
                    ) : (
                      <Badge variant="info">Active</Badge>
                    )}
                  </div>

                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-sm text-mc-text-2">Progress</span>
                    <span className="font-semibold text-mc-text-1 tabular-nums">
                      {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
                    </span>
                  </div>

                  <ProgressBar
                    value={progress}
                    variant={progress >= 100 ? 'success' : 'default'}
                    showLabel
                  />

                  {!isCompleted && (
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-mc-text-3">
                        {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Overdue'}
                      </span>
                      <span className="font-medium text-mc-text-1 tabular-nums">
                        {formatCurrency(goal.targetAmount - goal.currentAmount, currency)} to go
                      </span>
                    </div>
                  )}

                  {isCompleted && goal.status !== 'completed' && (
                    <div className="mt-3 rounded-mc-sm bg-mc-income/10 p-3 text-center">
                      <p className="text-sm font-medium text-mc-income">
                        🎉 Goal reached! Well done!
                      </p>
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
        title="Create Goal"
      >
        <GoalForm onSuccess={handleFormClose} onCancel={handleFormClose} />
      </BottomSheet>

      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        feature="Unlimited Goals"
        benefits={[
          'Create unlimited savings goals',
          'Track all your financial milestones',
          'Unlimited transactions',
          'Unlimited budgets',
          'Dark mode',
          'Multi-currency support',
          'Data export (CSV, JSON, PDF)',
          'Full health score breakdown'
        ]}
      />
    </div>
  );
}
