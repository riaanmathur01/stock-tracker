'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency, formatGainLoss, formatPercent } from '@/lib/utils';
import type { Portfolio } from '@/lib/types';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
  lastUpdated: Date | null;
}

export function PortfolioSummary({ portfolio, lastUpdated }: PortfolioSummaryProps) {
  const isProfit = portfolio.totalGainLoss >= 0;
  const accentColor = isProfit ? 'text-brand-500' : 'text-danger-500';
  const borderColor = isProfit ? 'border-brand-500/20' : 'border-danger-500/20';
  const bgGradient = isProfit
    ? 'from-brand-500/5 to-transparent'
    : 'from-danger-500/5 to-transparent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl bg-surface-900 border ${borderColor} p-6 bg-gradient-to-br ${bgGradient}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Portfolio Value</p>
          <p className="text-4xl font-mono font-bold text-white">
            {formatCurrency(portfolio.totalValue)}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${isProfit ? 'bg-brand-500/10' : 'bg-danger-500/10'}`}>
          <DollarSign className={`h-6 w-6 ${accentColor}`} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div>
          <p className="text-zinc-400 text-xs mb-1">Total Invested</p>
          <p className="font-mono text-white">{formatCurrency(portfolio.totalCost)}</p>
        </div>
        <div>
          <p className="text-zinc-400 text-xs mb-1">Total Gain / Loss</p>
          <div className={`flex items-center gap-1 font-mono font-semibold ${accentColor}`}>
            {isProfit ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{formatGainLoss(portfolio.totalGainLoss)}</span>
          </div>
        </div>
        <div>
          <p className="text-zinc-400 text-xs mb-1">Total Return</p>
          <p className={`font-mono font-semibold ${accentColor}`}>
            {formatPercent(portfolio.totalGainLossPercent)}
          </p>
        </div>
      </div>

      {lastUpdated && (
        <p className="text-zinc-600 text-xs mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </motion.div>
  );
}
