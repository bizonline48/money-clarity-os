import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '../../design-system/components';
import { budgetsRepository } from '../../db/repositories/budgets.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { budgetSchema, BudgetInput } from '../../lib/validators';
import { Budget, Category } from '../../types';
import { generateId } from '../../lib/utils';
import { decimalToCents } from '../../services/money';
import { useToast } from '../../design-system/components/Toast';

interface BudgetFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function BudgetForm({ onSuccess, onCancel }: BudgetFormProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BudgetInput>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await categoriesRepository.getAll();
      setCategories(allCategories.filter(c => c.type === 'expense'));
    };
    loadCategories();
  }, []);

  const onSubmit = async (data: BudgetInput) => {
    try {
      const limitInCents = decimalToCents(data.limitAmount);

      const newBudget: Budget = {
        id: generateId(),
        categoryId: data.categoryId,
        limitAmount: limitInCents,
        period: data.period,
        startDate: data.startDate,
      };

      await budgetsRepository.create(newBudget);
      toast.success('Budget created');
      onSuccess();
    } catch (error) {
      toast.error('Failed to create budget');
      console.error('Budget creation error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-mc-text-1">
          Category
        </label>
        <select
          className="w-full rounded-mc-md border border-mc-border bg-mc-bg-surface px-3 py-2 text-mc-text-1 focus:outline-none focus:ring-2 focus:ring-mc-accent"
          {...register('categoryId')}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1.5 text-sm text-mc-error">{errors.categoryId.message}</p>
        )}
      </div>

      <Input
        label="Monthly Limit"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.limitAmount?.message}
        {...register('limitAmount', { valueAsNumber: true })}
      />

      <Input
        label="Start Date"
        type="date"
        error={errors.startDate?.message}
        {...register('startDate')}
      />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Create Budget
        </Button>
      </div>
    </form>
  );
}
