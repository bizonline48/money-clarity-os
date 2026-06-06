import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isRecurring: z.boolean().optional(),
});

export const budgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  limitAmount: z.number().positive('Limit must be greater than zero'),
  period: z.literal('monthly'),
  startDate: z.string().min(1, 'Start date is required'),
});

export const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(50, 'Name too long'),
  targetAmount: z.number().positive('Target amount must be greater than zero'),
  currentAmount: z.number().min(0, 'Current amount cannot be negative'),
  targetDate: z.string().min(1, 'Target date is required'),
  status: z.enum(['active', 'completed', 'paused']),
});

export const debtSchema = z.object({
  name: z.string().min(1, 'Debt name is required').max(50, 'Name too long'),
  originalAmount: z.number().positive('Original amount must be greater than zero'),
  currentBalance: z.number().min(0, 'Balance cannot be negative'),
  interestRate: z.number().min(0).max(100).optional(),
  minimumPayment: z.number().min(0).optional(),
});

export const debtPaymentSchema = z.object({
  debtId: z.string().min(1, 'Debt ID is required'),
  amount: z.number().positive('Payment amount must be greater than zero'),
  date: z.string().min(1, 'Payment date is required'),
});

export type TransactionInput = z.infer<typeof transactionSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type GoalInput = z.infer<typeof goalSchema>;
export type DebtInput = z.infer<typeof debtSchema>;
export type DebtPaymentInput = z.infer<typeof debtPaymentSchema>;
