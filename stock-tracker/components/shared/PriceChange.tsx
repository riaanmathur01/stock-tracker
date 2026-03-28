'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface PriceChangeProps {
  value: number;
  type: 'currency' | 'percent';
  className?: string;
}

export function PriceChange({ value, type, className = '' }: PriceChangeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  const colorClass = isPositive
    ? 'text-brand-500'
    : isNegative
    ? 'text-danger-500'
    : 'text-zinc-400';

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;
  const formatted = type === 'currency' ? formatCurrency(Math.abs(value)) : formatPercent(value);
  const display = type === 'currency'
    ? `${isPositive ? '+' : isNegative ? '-' : ''}${formatted}`
    : formatted;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className={`inline-flex items-center gap-1 font-mono text-sm ${colorClass} ${className}`}
      >
        <Icon className="h-3 w-3" />
        {display}
      </motion.span>
    </AnimatePresence>
  );
}
