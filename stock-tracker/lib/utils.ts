import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export const formatGainLoss = (value: number): string =>
  `${value >= 0 ? '+' : ''}${formatCurrency(value)}`;

export const formatPercent = (value: number): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

export const calculateGainLoss = (
  currentPrice: number,
  buyPrice: number,
  quantity: number
): { gainLoss: number; gainLossPercent: number } => {
  const gainLoss = (currentPrice - buyPrice) * quantity;
  const gainLossPercent = ((currentPrice - buyPrice) / buyPrice) * 100;
  return { gainLoss, gainLossPercent };
};

export const generateId = (): string => crypto.randomUUID();

export const formatTimestamp = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
};

export const sanitizeSymbol = (symbol: string): string => {
  const upper = symbol.trim().toUpperCase();
  const STOCK_SYMBOL_REGEX = /^[A-Z.]{1,10}$/;
  if (!STOCK_SYMBOL_REGEX.test(upper)) {
    throw new Error(`Invalid stock symbol: ${symbol}`);
  }
  return upper;
};
