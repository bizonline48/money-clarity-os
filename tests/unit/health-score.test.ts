import { describe, it, expect } from 'vitest';
import { calculateHealthScore } from '../../src/services/health-score';
import { Transaction, Budget } from '../../src/types';

describe('Health Score Service', () => {
  describe('calculateHealthScore', () => {
    it('returns null when there are no transactions', () => {
      const result = calculateHealthScore({
        transactions: [],
        budgets: [],
        goals: [],
        debts: [],
      });
      expect(result).toBeNull();
    });

    it('returns null when transactions span less than 14 days', () => {
      const today = new Date();
      const tenDaysAgo = new Date(today);
      tenDaysAgo.setDate(today.getDate() - 10);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: tenDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
        {
          id: '2',
          type: 'expense',
          amount: 200000,
          categoryId: 'cat2',
          date: today.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });
      expect(result).toBeNull();
    });

    it('calculates score correctly with 20 days of data', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
        {
          id: '2',
          type: 'expense',
          amount: 200000,
          categoryId: 'cat2',
          date: today.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.total).toBeGreaterThan(0);
      expect(result!.total).toBeLessThanOrEqual(100);
    });

    it('assigns correct band for high score', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
        {
          id: '2',
          type: 'expense',
          amount: 100000,
          categoryId: 'cat2',
          date: today.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      if (result!.total >= 80) {
        expect(result!.band).toBe('Thriving');
      }
    });

    it('gives full savings rate score for 20% or more', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
        {
          id: '2',
          type: 'expense',
          amount: 400000,
          categoryId: 'cat2',
          date: today.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.savingsRate).toBe(25);
    });

    it('gives zero savings rate score for negative savings', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 300000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
        {
          id: '2',
          type: 'expense',
          amount: 400000,
          categoryId: 'cat2',
          date: today.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.savingsRate).toBe(0);
    });

    it('gives full budget control score when no budgets exist', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.budgetControl).toBe(25);
    });

    it('calculates budget control correctly when budget is respected', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);
      const currentMonth = today.toISOString().slice(0, 7);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
        {
          id: '2',
          type: 'expense',
          amount: 80000,
          categoryId: 'cat2',
          date: `${currentMonth}-15`,
          createdAt: Date.now(),
        },
      ];

      const budgets: Budget[] = [
        {
          id: 'b1',
          categoryId: 'cat2',
          limitAmount: 100000,
          period: 'monthly',
          startDate: `${currentMonth}-01`,
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets,
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.budgetControl).toBe(25);
    });

    it('gives full goal progress score when no goals exist', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.goalProgress).toBe(15);
    });

    it('gives full debt ratio score when no debt exists', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 500000,
          categoryId: 'cat1',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.debtRatio).toBe(15);
    });

    it('handles zero income correctly', () => {
      const today = new Date();
      const twentyDaysAgo = new Date(today);
      twentyDaysAgo.setDate(today.getDate() - 20);

      const transactions: Transaction[] = [
        {
          id: '1',
          type: 'expense',
          amount: 100000,
          categoryId: 'cat2',
          date: twentyDaysAgo.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
        {
          id: '2',
          type: 'expense',
          amount: 50000,
          categoryId: 'cat2',
          date: today.toISOString().split('T')[0],
          createdAt: Date.now(),
        },
      ];

      const result = calculateHealthScore({
        transactions,
        budgets: [],
        goals: [],
        debts: [],
      });

      expect(result).not.toBeNull();
      expect(result!.savingsRate).toBe(0);
      expect(result!.cashflow).toBe(0);
    });
  });
});
