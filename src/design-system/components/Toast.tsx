import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUIStore } from '../../store/ui.store';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  message: string;
  type: ToastVariant;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const variantStyles = {
  success: 'bg-mc-success text-white',
  error: 'bg-mc-error text-white',
  warning: 'bg-mc-warning text-white',
  info: 'bg-mc-info text-white',
};

function ToastItem({ id, message, type, duration = 3000 }: ToastProps): JSX.Element {
  const removeToast = useUIStore((state) => state.removeToast);
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  return (
    <div
      className={cn(
        'mb-2 flex min-w-[300px] max-w-md items-center gap-3 rounded-mc-md p-4 shadow-lg',
        variantStyles[type]
      )}
    >
      <Icon size={20} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="rounded-mc-sm p-1 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer(): JSX.Element | null {
  const toasts = useUIStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed right-4 top-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
}

export function useToast() {
  const addToast = useUIStore((state) => state.addToast);

  return {
    success: (message: string, duration?: number) =>
      addToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) =>
      addToast({ message, type: 'error', duration }),
    warning: (message: string, duration?: number) =>
      addToast({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) =>
      addToast({ message, type: 'info', duration }),
  };
}
