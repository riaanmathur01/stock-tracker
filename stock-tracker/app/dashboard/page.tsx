'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { PortfolioChart } from '@/components/dashboard/PortfolioChart';
import { StockList } from '@/components/dashboard/StockList';
import { AddStockModal } from '@/components/dashboard/AddStockModal';
import { usePortfolio } from '@/hooks/usePortfolio';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { stocks, stocksWithPrices, addStock, removeStock, portfolioSummary, lastUpdated } =
    usePortfolio();

  // Keyboard shortcut: press N to open Add Stock modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'n' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        setIsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar onAddStock={() => setIsModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
          <p className="text-zinc-500 text-sm">
            {stocks.length} stock{stocks.length !== 1 ? 's' : ''}
          </p>
        </div>

        <AnimatePresence>
          {stocks.length > 0 && (
            <PortfolioSummary portfolio={portfolioSummary} lastUpdated={lastUpdated} />
          )}
        </AnimatePresence>

        {stocksWithPrices.length >= 2 && (
          <PortfolioChart stocks={stocksWithPrices} />
        )}

        <StockList
          stocks={stocksWithPrices}
          onDelete={removeStock}
          onAddStock={() => setIsModalOpen(true)}
        />
      </main>

      <AddStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addStock}
        currentCount={stocks.length}
      />
    </div>
  );
}
