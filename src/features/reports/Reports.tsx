import { useEffect, useState } from 'react';
import { Lock, BarChart3 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../design-system/components';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { formatCurrency, centsToDecimal } from '../../services/money';
import { startOfMonth, endOfMonth } from 'date-fns';

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export function Reports(): JSX.Element {
  const [incomeVsExpense, setIncomeVsExpense] = useState<ChartData[]>([]);
  const [topCategories, setTopCategories] = useState<ChartData[]>([]);
  const [netCashflow, setNetCashflow] = useState(0);
  const [currency, setCurrency] = useState('SGD');
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const settings = await settingsRepository.get();
      setCurrency(settings?.currency || 'SGD');
      setIsPro(settings?.isPro || false);

      const now = new Date();
      const monthStart = startOfMonth(now).toISOString().split('T')[0];
      const monthEnd = endOfMonth(now).toISOString().split('T')[0];
      const transactions = await transactionsRepository.getByDateRange(monthStart, monthEnd);
      const categories = await categoriesRepository.getAll();

      const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      setIncomeVsExpense([
        { name: 'Income', value: centsToDecimal(income).toNumber(), color: '#16653A' },
        { name: 'Expenses', value: centsToDecimal(expenses).toNumber(), color: '#9B3121' },
      ]);

      setNetCashflow(income - expenses);

      const categoryMap = new Map<string, { name: string; amount: number }>();
      transactions.filter(t => t.type === 'expense').forEach(t => {
        const cat = categories.find(c => c.id === t.categoryId);
        if (cat) {
          const existing = categoryMap.get(cat.id) || { name: cat.name, amount: 0 };
          categoryMap.set(cat.id, { ...existing, amount: existing.amount + t.amount });
        }
      });

      const top5 = Array.from(categoryMap.values())
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5)
        .map(c => ({ name: c.name, value: centsToDecimal(c.amount).toNumber() }));

      setTopCategories(top5);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const COLORS = ['#16653A', '#9B3121', '#92560E', '#1E40AF', '#9333EA'];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mc-bg-base">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-mc-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-mc-text-1">Reports</h1>

      {!isPro && (
        <Card variant="subtle" className="mb-4 border-l-4 border-mc-info">
          <div className="flex items-start gap-3">
            <Lock className="text-mc-info" size={20} />
            <div>
              <p className="text-sm font-medium text-mc-text-1">Historical reports are a Pro feature</p>
              <p className="text-xs text-mc-text-2">Upgrade to view reports for any date range</p>
            </div>
          </div>
        </Card>
      )}

      <Card variant="elevated" className="mb-6">
        <CardHeader>
          <CardTitle>Net Cashflow (This Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-4xl font-bold tabular-nums ${netCashflow >= 0 ? 'text-mc-income' : 'text-mc-expense'}`}>
            {formatCurrency(netCashflow, currency)}
          </p>
        </CardContent>
      </Card>

      {incomeVsExpense.length > 0 && incomeVsExpense.some(d => d.value > 0) && (
        <Card variant="default" className="mb-6">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeVsExpense}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value) * 100, currency)}
                  contentStyle={{
                    backgroundColor: 'var(--mc-bg-surface)',
                    border: '1px solid var(--mc-border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {incomeVsExpense.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {topCategories.length > 0 && (
        <Card variant="default">
          <CardHeader>
            <CardTitle>Top 5 Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topCategories.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value) * 100, currency)}
                  contentStyle={{
                    backgroundColor: 'var(--mc-bg-surface)',
                    border: '1px solid var(--mc-border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {incomeVsExpense.every(d => d.value === 0) && (
        <Card variant="elevated" className="py-12 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 rounded-full bg-mc-bg-subtle p-6">
              <BarChart3 size={32} className="text-mc-text-3" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-mc-text-1">No data for this month</h3>
            <p className="text-sm text-mc-text-2">Add some transactions to see reports</p>
          </div>
        </Card>
      )}
    </div>
  );
}
