import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '../../design-system/components';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { transactionSchema, TransactionInput } from '../../lib/validators';
import { Transaction, Category } from '../../types';
import { generateId } from '../../lib/utils';
import { decimalToCents } from '../../services/money';
import { useToast } from '../../design-system/components/Toast';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps): JSX.Element {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(transaction?.type || 'expense');
  const [categories, setCategories] = useState<Category[]>([]);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<TransactionInput>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          amount: transaction.amount / 100,
          type: transaction.type,
          categoryId: transaction.categoryId,
          date: transaction.date,
          notes: transaction.notes || '',
        }
      : {
          type: 'expense',
          date: new Date().toISOString().split('T')[0],
        },
  });

  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await categoriesRepository.getAll();
      setCategories(allCategories.filter(c => c.type === transactionType));
    };
    loadCategories();
  }, [transactionType]);

  const onSubmit = async (data: TransactionInput) => {
    try {
      const amountInCents = decimalToCents(data.amount);

      if (transaction) {
        await transactionsRepository.update(transaction.id, {
          amount: amountInCents,
          type: data.type,
          categoryId: data.categoryId,
          date: data.date,
          notes: data.notes || '',
        });
        toast.success('Transaction updated');
      } else {
        const newTransaction: Transaction = {
          id: generateId(),
          amount: amountInCents,
          type: data.type,
          categoryId: data.categoryId,
          date: data.date,
          notes: data.notes || '',
          createdAt: Date.now(),
        };
        await transactionsRepository.create(newTransaction);
        toast.success('Transaction added');
      }

      onSuccess();
    } catch (error) {
      toast.error('Failed to save transaction');
      console.error('Transaction save error:', error);
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setValue('type', type);
    setValue('categoryId', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={transactionType === 'expense' ? 'primary' : 'secondary'}
          fullWidth
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </Button>
        <Button
          type="button"
          variant={transactionType === 'income' ? 'primary' : 'secondary'}
          fullWidth
          onClick={() => handleTypeChange('income')}
        >
          Income
        </Button>
      </div>

      <Input
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        {...register('amount', { valueAsNumber: true })}
      />

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
        label="Date"
        type="date"
        error={errors.date?.message}
        {...register('date')}
      />

      <Input
        label="Notes (optional)"
        type="text"
        placeholder="Add a note..."
        {...register('notes')}
      />

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {transaction ? 'Update' : 'Add'}
        </Button>
      </div>
    </form>
  );
}
