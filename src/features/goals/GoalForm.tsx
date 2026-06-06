import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '../../design-system/components';
import { goalsRepository } from '../../db/repositories/goals.repository';
import { goalSchema, GoalInput } from '../../lib/validators';
import { Goal } from '../../types';
import { generateId } from '../../lib/utils';
import { decimalToCents } from '../../services/money';
import { useToast } from '../../design-system/components/Toast';

interface GoalFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function GoalForm({ onSuccess, onCancel }: GoalFormProps): JSX.Element {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      status: 'active',
      currentAmount: 0,
    },
  });

  const onSubmit = async (data: GoalInput) => {
    try {
      const targetInCents = decimalToCents(data.targetAmount);
      const currentInCents = decimalToCents(data.currentAmount);

      const newGoal: Goal = {
        id: generateId(),
        name: data.name,
        targetAmount: targetInCents,
        currentAmount: currentInCents,
        targetDate: data.targetDate,
        status: data.status,
        createdAt: Date.now(),
      };

      await goalsRepository.create(newGoal);
      toast.success('Goal created');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create goal');
      console.error('Goal creation error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Goal Name"
        type="text"
        placeholder="e.g., Emergency Fund"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Target Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.targetAmount?.message}
        {...register('targetAmount', { valueAsNumber: true })}
      />

      <Input
        label="Current Amount (optional)"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.currentAmount?.message}
        helperText="If you've already saved some amount"
        {...register('currentAmount', { valueAsNumber: true })}
      />

      <Input
        label="Target Date"
        type="date"
        error={errors.targetDate?.message}
        {...register('targetDate')}
      />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create Goal
        </Button>
      </div>
    </form>
  );
}
