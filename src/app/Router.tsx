import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import { Welcome } from '../features/dashboard/Welcome';
import { Dashboard } from '../features/dashboard/Dashboard';
import { TransactionList } from '../features/transactions/TransactionList';
import { BudgetList } from '../features/budgets/BudgetList';
import { GoalList } from '../features/goals/GoalList';
import { DebtList } from '../features/debts/DebtList';
import { Reports } from '../features/reports/Reports';
import { ExportCentre } from '../features/export/ExportCentre';
import { Settings } from '../features/settings/Settings';
import { Categories } from '../features/categories/Categories';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { TermsOfUse } from '../pages/TermsOfUse';
import { HelpCentre } from '../pages/HelpCentre';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'transactions',
        element: <TransactionList />,
      },
      {
        path: 'budgets',
        element: <BudgetList />,
      },
      {
        path: 'goals',
        element: <GoalList />,
      },
      {
        path: 'debts',
        element: <DebtList />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'export',
        element: <ExportCentre />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'privacy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms',
        element: <TermsOfUse />,
      },
      {
        path: 'help',
        element: <HelpCentre />,
      },
    ],
  },
]);

export function Router(): JSX.Element {
  return <RouterProvider router={router} />;
}
