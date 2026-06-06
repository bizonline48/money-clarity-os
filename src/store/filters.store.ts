import { create } from 'zustand';

interface FiltersStore {
  transactionType: 'all' | 'income' | 'expense';
  categoryId: string | null;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  searchQuery: string;
  setTransactionType: (type: 'all' | 'income' | 'expense') => void;
  setCategoryId: (id: string | null) => void;
  setDateRange: (start: string | null, end: string | null) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  transactionType: 'all',
  categoryId: null,
  dateRange: {
    start: null,
    end: null,
  },
  searchQuery: '',
  setTransactionType: (type: 'all' | 'income' | 'expense'): void =>
    set({ transactionType: type }),
  setCategoryId: (id: string | null): void => set({ categoryId: id }),
  setDateRange: (start: string | null, end: string | null): void =>
    set({ dateRange: { start, end } }),
  setSearchQuery: (query: string): void => set({ searchQuery: query }),
  resetFilters: (): void =>
    set({
      transactionType: 'all',
      categoryId: null,
      dateRange: { start: null, end: null },
      searchQuery: '',
    }),
}));
