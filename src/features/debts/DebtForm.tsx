import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { Button, Input } from '../../design-system/components';
import { debtsRepository } from '../../db/repositories/debts.repository';
import { debtSchema, DebtInput } from '../../lib/validators';
import { Debt } from '../../types';
import { generateId } from '../../lib/utils';
import { decimalToCents } from '../../services/money';
import { useToast } from '../../design-system/components/Toast';

interface DebtFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  isPro: boolean;
}

export function DebtForm({ onSuccess, onCancel, isPro }: DebtFormProps): JSX.Element {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DebtInput>({
    resolver: zodResolver(debtSchema),
  });

  const onSubmit = async (data: DebtInput) => {
    try {
      const originalInCents = decimalToCents(data.originalAmount);
      const balanceInCents = decimalToCents(data.currentBalance);

      const newDebt: Debt = {
        id: generateId(),
        name: data.name,
        originalAmount: originalInCents,
        currentBalance: balanceInCents,
        createdAt: Date.now(),
      };

      if (isPro && data.interestRate !== undefined) {
        newDebt.interestRate = data.interestRate;
      }

      if (isPro && data.minimumPayment !== undefined) {
        newDebt.minimumPayment = decimalToCents(data.minimumPayment);
      }

      await debtsRepository.create(newDebt);
      toast.success('Debt added');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add debt');
      console.error('Debt creation error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Debt Name"
        type="text"
        placeholder="e.g., Credit Card"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Original Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.originalAmount?.message}
        {...register('originalAmount', { valueAsNumber: true })}
      />

      <Input
        label="Current Balance"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.currentBalance?.message}
        {...register('currentBalance', { valueAsNumber: true })}
      />

      {isPro ? (
        <>
          <Input
            label="Interest Rate (% APR)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.interestRate?.message}
            helperText="Annual Percentage Rate"
            {...register('interestRate', { valueAsNumber: true })}
          />

          <Input
            label="Minimum Monthly Payment"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.minimumPayment?.message}
            {...register('minimumPayment', { valueAsNumber: true })}
          />
        </>
      ) : (
        <div className="rounded-mc-md border border-mc-border bg-mc-bg-subtle p-3">
          <div className="flex items-start gap-2">
            <Lock size={16} className="mt-0.5 text-mc-text-3" />
            <div>
              <p className="text-sm font-medium text-mc-text-2">Interest tracking is a Pro feature</p>
              <p className="text-xs text-mc-text-3">Upgrade to track interest rates and monthly payments</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Add Debt
        </Button>
      </div>
    </form>
  );
}
