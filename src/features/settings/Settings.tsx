import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Moon, Sun, DollarSign, Trash2, FileText, HelpCircle, Shield, ChevronRight, Lock } from 'lucide-react';
import { Button, Card, Modal, Input } from '../../design-system/components';
import { settingsRepository } from '../../db/repositories/settings.repository';
import { transactionsRepository } from '../../db/repositories/transactions.repository';
import { categoriesRepository } from '../../db/repositories/categories.repository';
import { budgetsRepository } from '../../db/repositories/budgets.repository';
import { goalsRepository } from '../../db/repositories/goals.repository';
import { debtsRepository } from '../../db/repositories/debts.repository';
import { debtPaymentsRepository } from '../../db/repositories/debt-payments.repository';
import { useToast } from '../../design-system/components/Toast';
import { PRO_PRICE_SGD, CURRENCIES, APP_NAME, APP_VERSION } from '../../lib/constants';
import { ProUpgradeModal } from './ProUpgradeModal';

export function Settings(): JSX.Element {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [currency, setCurrency] = useState('SGD');
  const [isPro, setIsPro] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [showProModal, setShowProModal] = useState(false);
  const [proFeature, setProFeature] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await settingsRepository.get();
    if (settings) {
      setTheme(settings.theme);
      setCurrency(settings.currency);
      setIsPro(settings.isPro);
    }
  };

  const handleThemeToggle = async () => {
    if (!isPro) {
      setProFeature('Dark Mode');
      setShowProModal(true);
      return;
    }

    const newTheme = theme === 'light' ? 'dark' : 'light';
    await settingsRepository.update({ theme: newTheme });
    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    if (!isPro) {
      setProFeature('Multi-Currency');
      setShowProModal(true);
      return;
    }

    await settingsRepository.update({ currency: newCurrency });
    setCurrency(newCurrency);
    toast.success(`Currency changed to ${newCurrency}`);
  };

  const handleProUpgrade = () => {
    setProFeature('Clarity Pro');
    setShowProModal(true);
  };

  const handleDataReset = async () => {
    if (deleteInput !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    try {
      await transactionsRepository.deleteAll();
      await budgetsRepository.deleteAll();
      await goalsRepository.deleteAll();
      await debtsRepository.deleteAll();
      await debtPaymentsRepository.deleteAll();
      await categoriesRepository.deleteAll();
      await settingsRepository.reset();

      toast.success('All data deleted successfully');
      setDeleteConfirm(false);
      setDeleteInput('');

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      toast.error('Failed to delete data');
      console.error('Data deletion error:', error);
    }
  };

  const proBenefits = [
    'Unlimited transactions',
    'Unlimited budgets and goals',
    'Dark mode',
    'Multi-currency support',
    'Advanced debt tracking with interest calculations',
    'Historical reports (all time)',
    'Data export (CSV, JSON, PDF)',
    'Full health score breakdown',
  ];

  return (
    <div className="min-h-screen bg-mc-bg-base px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-mc-text-1">Settings</h1>

      <div className="space-y-4">
        {!isPro && (
          <Card variant="elevated" className="border-2 border-mc-accent bg-gradient-to-br from-mc-accent-light to-mc-bg-surface">
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2">
                <Crown size={24} className="text-mc-accent" />
                <h2 className="text-lg font-bold text-mc-text-1">Upgrade to Clarity Pro</h2>
              </div>
              <p className="mb-4 text-sm text-mc-text-2">
                Unlock unlimited transactions, dark mode, multi-currency, and more.
              </p>
              <Button fullWidth onClick={handleProUpgrade}>
                Unlock Pro — SGD ${PRO_PRICE_SGD}
              </Button>
            </div>
          </Card>
        )}

        {isPro && (
          <Card variant="elevated">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-mc-accent/10 p-2">
                  <Crown size={20} className="text-mc-accent" />
                </div>
                <div>
                  <p className="font-semibold text-mc-text-1">Clarity Pro</p>
                  <p className="text-sm text-mc-text-3">Active</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card variant="default">
          <div className="divide-y divide-mc-border">
            <button
              onClick={handleThemeToggle}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-mc-bg-subtle"
            >
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun size={20} className="text-mc-text-2" />
                ) : (
                  <Moon size={20} className="text-mc-text-2" />
                )}
                <div>
                  <p className="font-medium text-mc-text-1">Theme</p>
                  <p className="text-sm text-mc-text-3">
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isPro && <Lock size={16} className="text-mc-text-3" />}
                <ChevronRight size={20} className="text-mc-text-3" />
              </div>
            </button>

            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-mc-text-2" />
                  <div>
                    <p className="font-medium text-mc-text-1">Currency</p>
                    <p className="text-sm text-mc-text-3">Display currency</p>
                  </div>
                </div>
                {!isPro && <Lock size={16} className="text-mc-text-3" />}
              </div>
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                disabled={!isPro}
                className="mt-2 w-full rounded-mc-md border border-mc-border bg-mc-bg-surface px-3 py-2 text-mc-text-1 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-mc-accent"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} — {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="divide-y divide-mc-border">
            <button
              onClick={() => navigate('/privacy')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-mc-bg-subtle"
            >
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-mc-text-2" />
                <p className="font-medium text-mc-text-1">Privacy Policy</p>
              </div>
              <ChevronRight size={20} className="text-mc-text-3" />
            </button>

            <button
              onClick={() => navigate('/terms')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-mc-bg-subtle"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-mc-text-2" />
                <p className="font-medium text-mc-text-1">Terms of Use</p>
              </div>
              <ChevronRight size={20} className="text-mc-text-3" />
            </button>

            <button
              onClick={() => navigate('/help')}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-mc-bg-subtle"
            >
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-mc-text-2" />
                <p className="font-medium text-mc-text-1">Help Centre</p>
              </div>
              <ChevronRight size={20} className="text-mc-text-3" />
            </button>
          </div>
        </Card>

        <Card variant="default">
          <button
            onClick={() => setDeleteConfirm(true)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-mc-bg-subtle"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} className="text-mc-error" />
              <div>
                <p className="font-medium text-mc-error">Delete All Data</p>
                <p className="text-sm text-mc-text-3">Permanently erase everything</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-mc-text-3" />
          </button>
        </Card>

        <div className="pt-4 text-center">
          <p className="text-sm text-mc-text-3">
            {APP_NAME} v{APP_VERSION}
          </p>
          <p className="mt-1 text-xs text-mc-text-3">© 2026 SK Empire, Singapore</p>
        </div>
      </div>

      <Modal
        isOpen={deleteConfirm}
        onClose={() => {
          setDeleteConfirm(false);
          setDeleteInput('');
        }}
        title="Delete All Data"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteConfirm(false);
                setDeleteInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDataReset}
              disabled={deleteInput !== 'DELETE'}
            >
              Delete Everything
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-mc-text-2">
            This will permanently delete all your transactions, budgets, goals, and debts.
          </p>
          <p className="font-semibold text-mc-error">This action cannot be undone.</p>
          <Input
            label='Type "DELETE" to confirm'
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder="DELETE"
          />
        </div>
      </Modal>

      <ProUpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        feature={proFeature}
        benefits={proBenefits}
      />
    </div>
  );
}
