import { useEffect, useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button, Card, Modal } from '../../design-system/components';
import { BottomSheet } from '../../design-system/components/BottomSheet';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { formatCurrency } from '../../services/money';
import { Transaction, Category } from '../../types';
import { TransactionForm } from './TransactionForm';
import { FREE_TIER_LIMITS } from '../../lib/constants';
import { useToast } from '../../design-system/components/Toast';

export function TransactionList(): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currency, setCurrency] = useState('SGD');
  const [isPro, setIsPro] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const toast = useToast();

  const loadData = async () => {
    const settings = await settingsRepository.get();
    setCurrency(settings?.currency || 'SGD');
    setIsPro(settings?.isPro || false);

    const allTransactions = await transactionsRepository.getAll();
    const allCategories = await categoriesRepository.getAll();

    setTransactions(allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCategories(allCategories);
    setTransactionCount(allTransactions.length);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    if (!isPro && transactionCount >= FREE_TIER_LIMITS.maxTransactions) {
      toast.warning('Free tier limit reached. Upgrade to Pro for unlimited transactions.');
      return;
    }
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await transactionsRepository.delete(id);
    toast.success('Transaction deleted');
    setDeleteConfirm(null);
    loadData();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
    loadData();
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const getCategoryName = (categoryId: string): string => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  const showWarning = !isPro && transactionCount >= FREE_TIER_LIMITS.warningThreshold && transactionCount < FREE_TIER_LIMITS.maxTransactions;
  const showBlock = !isPro && transactionCount >= FREE_TIER_LIMITS.maxTransactions;

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-mc-text-1">Transactions</h1>
        <Button onClick={handleAdd} size="sm">
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {showWarning && (
        <Card variant="subtle" className="mb-4 border-l-4 border-mc-warning">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-mc-warning" size={20} />
            <div>
              <p className="text-sm font-medium text-mc-text-1">
                You have {FREE_TIER_LIMITS.maxTransactions - transactionCount} transactions remaining
              </p>
              <p className="text-xs text-mc-text-2">Upgrade to Pro for unlimited transactions</p>
            </div>
          </div>
        </Card>
      )}

      {showBlock && (
        <Card variant="subtle" className="mb-4 border-l-4 border-mc-error">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-mc-error" size={20} />
            <div>
              <p className="text-sm font-medium text-mc-text-1">Transaction limit reached</p>
              <p className="text-xs text-mc-text-2">Upgrade to Pro to add more transactions</p>
            </div>
          </div>
        </Card>
      )}

      <div className="mb-4 flex gap-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'income' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('income')}
        >
          Income
        </Button>
        <Button
          variant={filter === 'expense' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('expense')}
        >
          Expenses
        </Button>
      </div>

      {filteredTransactions.length === 0 ? (
        <Card variant="elevated" className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-mc-bg-subtle p-6">
              <Plus size={32} className="text-mc-text-3" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-mc-text-1">No transactions yet</h3>
            <p className="mb-4 text-sm text-mc-text-2">Start tracking by adding your first transaction</p>
            <Button onClick={handleAdd}>Add Transaction</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <div key={date}>
              <p className="mb-2 text-sm font-medium text-mc-text-2">
                {format(new Date(date), 'EEEE, d MMMM yyyy')}
              </p>
              <Card variant="default">
                <div className="divide-y divide-mc-border">
                  {dayTransactions.map((transaction) => (
                    <button
                      key={transaction.id}
                      onClick={() => handleEdit(transaction)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-mc-bg-subtle"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-mc-text-1">{getCategoryName(transaction.categoryId)}</p>
                        {transaction.notes && (
                          <p className="mt-1 text-sm text-mc-text-3">{transaction.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold tabular-nums ${transaction.type === 'income' ? 'text-mc-income' : 'text-mc-expense'}`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(transaction.id);
                          }}
                          className="mt-1 text-xs text-mc-text-3 hover:text-mc-error"
                        >
                          Delete
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      <BottomSheet
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          transaction={editingTransaction}
          onSuccess={handleFormClose}
          onCancel={handleFormClose}
        />
      </BottomSheet>

      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Transaction"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-mc-text-2">Are you sure you want to delete this transaction? This action cannot be undone.</p>
      </Modal>
    </div>
  );
}
