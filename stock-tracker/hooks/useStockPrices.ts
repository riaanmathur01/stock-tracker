'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchMultipleStocks } from '@/lib/stockApi';
import { REFRESH_INTERVAL_MS } from '@/lib/constants';
import type { StockQuote } from '@/lib/stockApi';

interface UseStockPricesReturn {
  prices: Map<string, StockQuote>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useStockPrices(symbols: string[]): UseStockPricesReturn {
  const [prices, setPrices] = useState<Map<string, StockQuote>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const symbolsRef = useRef(symbols);
  symbolsRef.current = symbols;

  const fetchPrices = useCallback(async () => {
    if (symbolsRef.current.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const quotes = await fetchMultipleStocks(symbolsRef.current);
      const newMap = new Map<string, StockQuote>();
      quotes.forEach((q) => newMap.set(q.symbol, q));
      setPrices(newMap);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[useStockPrices] Failed to fetch prices:', err);
      setError('Failed to fetch stock prices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount and whenever symbols change
  useEffect(() => {
    void fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPrices, symbols.join(',')]);

  // Auto-refresh every 60s, pausing when tab is hidden
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        void fetchPrices();
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, isLoading, error, lastUpdated, refresh: fetchPrices };
}
