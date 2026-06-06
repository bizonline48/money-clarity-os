import { useEffect, useState } from 'react';
import { Download, FileText, Database, FileType, Lock, Crown } from 'lucide-react';
import { Button, Card } from '../../design-system/components';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { budgetsRepository } from '../../db/repositories/budgets.repository';
import { goalsRepository } from '../../db/repositories/goals.repository';
import { debtsRepository } from '../../db/repositories/debts.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { useToast } from '../../design-system/components/Toast';
import { PRO_PRICE_SGD } from '../../lib/constants';
import { ProUpgradeModal } from '../settings/ProUpgradeModal';
import { centsToDecimal } from '../../services/money';

export function ExportCentre(): JSX.Element {
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await settingsRepository.get();
    setIsPro(settings?.isPro || false);
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    try {
      const transactions = await transactionsRepository.getAll();
      const categories = await categoriesRepository.getAll();

      const csvHeader = 'Date,Type,Category,Amount,Notes\n';
      const csvRows = transactions
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((t) => {
          const category = categories.find(c => c.id === t.categoryId);
          const amount = centsToDecimal(t.amount).toNumber();
          return `${t.date},${t.type},${category?.name || 'Unknown'},${amount},"${t.notes || ''}"`;
        })
        .join('\n');

      const csv = csvHeader + csvRows;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `money-clarity-transactions-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success('Transactions exported to CSV');
    } catch (error) {
      toast.error('Failed to export CSV');
      console.error('CSV export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = async () => {
    setIsExporting(true);
    try {
      const [transactions, categories, budgets, goals, debts, settings] = await Promise.all([
        transactionsRepository.getAll(),
        categoriesRepository.getAll(),
        budgetsRepository.getAll(),
        goalsRepository.getAll(),
        debtsRepository.getAll(),
        settingsRepository.get(),
      ]);

      const data = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        transactions,
        categories,
        budgets,
        goals,
        debts,
        settings,
      };

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `money-clarity-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success('Complete backup exported to JSON');
    } catch (error) {
      toast.error('Failed to export JSON');
      console.error('JSON export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.version || !data.transactions) {
        toast.error('Invalid backup file format');
        return;
      }

      const confirmed = window.confirm(
        'Restore from backup will replace ALL existing data. This cannot be undone. Continue?'
      );

      if (!confirmed) {
        setIsRestoring(false);
        return;
      }

      await transactionsRepository.deleteAll();
      await budgetsRepository.deleteAll();
      await goalsRepository.deleteAll();
      await debtsRepository.deleteAll();
      await categoriesRepository.deleteAll();

      if (data.transactions?.length) {
        for (const transaction of data.transactions) {
          await transactionsRepository.create(transaction);
        }
      }

      if (data.categories?.length) {
        for (const category of data.categories) {
          await categoriesRepository.create(category);
        }
      }

      if (data.budgets?.length) {
        for (const budget of data.budgets) {
          await budgetsRepository.create(budget);
        }
      }

      if (data.goals?.length) {
        for (const goal of data.goals) {
          await goalsRepository.create(goal);
        }
      }

      if (data.debts?.length) {
        for (const debt of data.debts) {
          await debtsRepository.create(debt);
        }
      }

      toast.success('Backup restored successfully');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      toast.error('Failed to restore backup');
      console.error('Restore error:', error);
    } finally {
      setIsRestoring(false);
      event.target.value = '';
    }
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to generate PDF');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Money Clarity Report</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { font-family: sans-serif; color: #111; }
              h1 { color: #16653A; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
              th { background: #f5f5f5; }
            }
          </style>
        </head>
        <body>
          <h1>Money Clarity OS Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <p>This is a placeholder for your financial report. Detailed reporting coming soon.</p>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const proBenefits = [
    'Export all transactions to CSV',
    'Complete JSON backup of all data',
    'PDF financial reports (coming soon)',
    'Import data from exports',
    'Unlimited exports anytime',
  ];

  if (!isPro) {
    return (
      <div className="min-h-screen bg-mc-bg-base px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold text-mc-text-1">Export Centre</h1>

        <Card variant="elevated" className="py-16 text-center">
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-mc-accent/10 p-6">
                <Lock size={48} className="text-mc-accent" />
              </div>
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-mc-accent/10 px-4 py-2">
              <Crown size={16} className="text-mc-accent" />
              <span className="text-sm font-medium text-mc-accent">Pro Feature</span>
            </div>

            <h2 className="mb-3 text-2xl font-bold text-mc-text-1">
              Export Your Financial Data
            </h2>
            <p className="mb-6 text-mc-text-2">
              Upgrade to Pro to export your transactions, create backups, and generate reports.
            </p>

            <div className="mb-6 space-y-2 rounded-mc-md bg-mc-bg-subtle p-4 text-left">
              <p className="font-medium text-mc-text-1">What you'll get:</p>
              <ul className="space-y-2">
                {proBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-mc-text-2">
                    <Download size={16} className="mt-0.5 flex-shrink-0 text-mc-accent" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button size="lg" fullWidth onClick={() => setShowProModal(true)}>
              Unlock Pro — SGD ${PRO_PRICE_SGD}
            </Button>
          </div>
        </Card>

        <ProUpgradeModal
          isOpen={showProModal}
          onClose={() => setShowProModal(false)}
          feature="Data Export"
          benefits={proBenefits}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-mc-text-1">Export Centre</h1>

      <div className="space-y-4">
        <Card variant="default">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full bg-mc-accent/10 p-2">
                <FileText size={20} className="text-mc-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-mc-text-1">CSV Export</h3>
                <p className="text-sm text-mc-text-3">Export transactions as CSV spreadsheet</p>
              </div>
            </div>
            <Button
              fullWidth
              onClick={exportToCSV}
              isLoading={isExporting}
              variant="secondary"
            >
              <Download size={16} className="mr-2" />
              Export to CSV
            </Button>
          </div>
        </Card>

        <Card variant="default">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full bg-mc-accent/10 p-2">
                <Database size={20} className="text-mc-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-mc-text-1">JSON Backup</h3>
                <p className="text-sm text-mc-text-3">Complete backup of all your data</p>
              </div>
            </div>
            <Button
              fullWidth
              onClick={exportToJSON}
              isLoading={isExporting}
              variant="secondary"
            >
              <Download size={16} className="mr-2" />
              Export to JSON
            </Button>
          </div>
        </Card>

        <Card variant="default">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full bg-mc-accent/10 p-2">
                <FileType size={20} className="text-mc-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-mc-text-1">PDF Report</h3>
                <p className="text-sm text-mc-text-3">Print current month summary</p>
              </div>
            </div>
            <Button fullWidth onClick={exportToPDF} variant="secondary">
              <Download size={16} className="mr-2" />
              Generate PDF
            </Button>
          </div>
        </Card>

        <Card variant="default">
          <div className="p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-full bg-mc-accent/10 p-2">
                <Database size={20} className="text-mc-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-mc-text-1">Restore Backup</h3>
                <p className="text-sm text-mc-text-3">Import data from JSON backup</p>
              </div>
            </div>
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackup}
                disabled={isRestoring}
                className="hidden"
                id="restore-file"
              />
              <div onClick={() => !isRestoring && document.getElementById('restore-file')?.click()}>
                <Button
                  fullWidth
                  variant="secondary"
                  isLoading={isRestoring}
                  type="button"
                >
                  <Download size={16} className="mr-2 rotate-180" />
                  Choose Backup File
                </Button>
              </div>
            </label>
          </div>
        </Card>
      </div>
    </div>
  );
}
