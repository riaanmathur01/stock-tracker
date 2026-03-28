'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Stock } from '@/lib/types';
import { loadPortfolio, savePortfolio } from '@/lib/portfolioStorage';
import { generateId } from '@/lib/utils';
import type { AddStockForm } from '@/lib/types';

interface PortfolioContextValue {
  stocks: Stock[];
  addStock: (form: AddStockForm & { name: string }) => void;
  removeStock: (id: string) => void;
  updateStock: (id: string, updates: Partial<Stock>) => void;
  isLoading: boolean;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadPortfolio();
    setStocks(loaded);
    setIsLoading(false);
  }, []);

  // Save to localStorage whenever stocks change (skip initial load)
  useEffect(() => {
    if (!isLoading) {
      savePortfolio(stocks);
    }
  }, [stocks, isLoading]);

  const addStock = useCallback((form: AddStockForm & { name: string }) => {
    const newStock: Stock = {
      id: generateId(),
      symbol: form.symbol,
      name: form.name,
      quantity: form.quantity,
      buyPrice: form.buyPrice,
      addedAt: new Date().toISOString(),
    };
    setStocks((prev) => [...prev, newStock]);
  }, []);

  const removeStock = useCallback((id: string) => {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateStock = useCallback((id: string, updates: Partial<Stock>) => {
    setStocks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  return (
    <PortfolioContext.Provider value={{ stocks, addStock, removeStock, updateStock, isLoading }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolioContext must be used within PortfolioProvider');
  return ctx;
}
