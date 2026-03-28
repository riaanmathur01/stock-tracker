'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus } from 'lucide-react';
import { StockCard } from './StockCard';
import { Button } from '@/components/ui/button';
import type { StockWithPrice, SortOption, SortDirection } from '@/lib/types';

interface StockListProps {
  stocks: StockWithPrice[];
  onDelete: (id: string) => void;
  onAddStock: () => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'gainLoss', label: 'Gain / Loss' },
  { value: 'value', label: 'Value' },
  { value: 'changePercent', label: 'Change %' },
  { value: 'symbol', label: 'Symbol' },
];

function sortStocks(stocks: StockWithPrice[], by: SortOption, dir: SortDirection): StockWithPrice[] {
  return [...stocks].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;
    switch (by) {
      case 'gainLoss': aVal = a.gainLoss; bVal = b.gainLoss; break;
      case 'value': aVal = a.totalValue; bVal = b.totalValue; break;
      case 'changePercent': aVal = a.changePercent; bVal = b.changePercent; break;
      case 'symbol': aVal = a.symbol; bVal = b.symbol; break;
    }
    if (typeof aVal === 'string') {
      return dir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
    }
    return dir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });
}

export function StockList({ stocks, onDelete, onAddStock }: StockListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('gainLoss');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(option);
      setSortDir('desc');
    }
  };

  const sorted = sortStocks(stocks, sortBy, sortDir);

  if (stocks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="p-6 rounded-full bg-surface-900 mb-6">
          <TrendingUp className="h-12 w-12 text-brand-500" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No stocks yet</h3>
        <p className="text-zinc-400 mb-6 max-w-sm">
          Start building your portfolio by adding your first stock.
        </p>
        <Button
          onClick={onAddStock}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-6 py-2 font-semibold transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Stock
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Sort bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-zinc-500 text-sm mr-1">Sort by:</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSort(opt.value)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              sortBy === opt.value
                ? 'bg-brand-500/20 text-brand-500 font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-surface-800'
            }`}
          >
            {opt.label}
            {sortBy === opt.value && (sortDir === 'asc' ? ' ↑' : ' ↓')}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((stock, index) => (
          <StockCard
            key={stock.id}
            stock={stock}
            index={index}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
