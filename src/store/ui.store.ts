import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface UIStore {
  isLoading: boolean;
  toasts: Toast[];
  activeModal: string | null;
  setLoading: (loading: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  toasts: [],
  activeModal: null,
  setLoading: (loading: boolean): void => set({ isLoading: loading }),
  addToast: (toast: Omit<Toast, 'id'>): void =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: `${Date.now()}-${Math.random()}`,
        },
      ],
    })),
  removeToast: (id: string): void =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  openModal: (modalId: string): void => set({ activeModal: modalId }),
  closeModal: (): void => set({ activeModal: null }),
}));
