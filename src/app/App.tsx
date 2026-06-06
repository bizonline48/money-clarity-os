import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Target, BarChart3, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { IOSInstallPrompt } from '../components/IOSInstallPrompt';

interface NavItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/budgets', label: 'Budgets', icon: Target },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

function App(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const isWelcome = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col bg-mc-bg-base text-mc-text-1">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <IOSInstallPrompt />

      {!isWelcome && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-mc-border bg-mc-bg-surface">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-mc-md px-4 py-2',
                    'transition-colors duration-150',
                    isActive
                      ? 'bg-mc-accent-light text-mc-accent'
                      : 'text-mc-text-3 hover:bg-mc-bg-subtle hover:text-mc-text-1'
                  )}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
