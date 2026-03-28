'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PriceChange } from '@/components/shared/PriceChange';
import { formatCurrency } from '@/lib/utils';
import type { StockWithPrice } from '@/lib/types';

interface StockCardProps {
  stock: StockWithPrice;
  index: number;
  onDelete: (id: string) => void;
}

export function StockCard({ stock, index, onDelete }: StockCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (stock.isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="rounded-2xl bg-surface-900 border border-surface-800 p-6"
      >
        <div className="space-y-3">
          <Skeleton className="h-6 w-20 bg-surface-800" />
          <Skeleton className="h-4 w-32 bg-surface-800" />
          <Skeleton className="h-8 w-28 bg-surface-800" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16 bg-surface-800" />
            <Skeleton className="h-4 w-16 bg-surface-800" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-2xl bg-surface-900 border border-surface-800 p-6 hover:border-surface-700 transition-colors"
    >
      {/* Delete button */}
      {isHovered && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => onDelete(stock.id)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-danger-500/10 text-zinc-600 hover:text-danger-500 transition-colors"
          aria-label={`Delete ${stock.symbol}`}
        >
          <Trash2 className="h-4 w-4" />
        </motion.button>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-mono font-bold text-white">{stock.symbol}</span>
          <PriceChange value={stock.changePercent} type="percent" className="text-xs" />
        </div>
        <p className="text-zinc-400 text-sm truncate mt-0.5">{stock.name}</p>
      </div>

      {/* Current price */}
      <div className="mb-4">
        <p className="text-zinc-500 text-xs mb-1">Current Price</p>
        <p className="text-2xl font-mono font-semibold text-white">
          {formatCurrency(stock.currentPrice)}
        </p>
        <PriceChange value={stock.change} type="currency" className="text-xs mt-0.5" />
      </div>

      {/* Divider */}
      <div className="border-t border-surface-800 my-4" />

      {/* Your position */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-zinc-500 text-xs mb-1">Shares</p>
          <p className="font-mono text-zinc-300">{stock.quantity}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-1">Avg Cost</p>
          <p className="font-mono text-zinc-300">{formatCurrency(stock.buyPrice)}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-1">Total Value</p>
          <p className="font-mono text-white font-medium">{formatCurrency(stock.totalValue)}</p>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-1">Gain / Loss</p>
          <PriceChange value={stock.gainLoss} type="currency" />
        </div>
      </div>
    </motion.div>
  );
}
