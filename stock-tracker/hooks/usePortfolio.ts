'use client';

import { useMemo } from 'react';
import { usePortfolioContext } from '@/context/PortfolioContext';
import { useStockPrices } from './useStockPrices';
import { calculateGainLoss } from '@/lib/utils';
import type { StockWithPrice, Portfolio } from '@/lib/types';

export function usePortfolio() {
  const { stocks, addStock, removeStock, updateStock } = usePortfolioContext();
  const symbols = useMemo(() => stocks.map((s) => s.symbol), [stocks]);
  const { prices, isLoading, lastUpdated, refresh } = useStockPrices(symbols);

  const stocksWithPrices = useMemo<StockWithPrice[]>(() => {
    return stocks.map((stock) => {
      const quote = prices.get(stock.symbol);
      if (!quote) {
        return {
          ...stock,
          currentPrice: 0,
          change: 0,
          changePercent: 0,
          totalValue: 0,
          totalCost: stock.buyPrice * stock.quantity,
          gainLoss: 0,
          gainLossPercent: 0,
          isLoading: isLoading,
        };
      }
      const { gainLoss, gainLossPercent } = calculateGainLoss(
        quote.price,
        stock.buyPrice,
        stock.quantity
      );
      return {
        ...stock,
        currentPrice: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        totalValue: quote.price * stock.quantity,
        totalCost: stock.buyPrice * stock.quantity,
        gainLoss,
        gainLossPercent,
        isLoading: false,
      };
    });
  }, [stocks, prices, isLoading]);

  const portfolioSummary = useMemo<Portfolio>(() => {
    const totalValue = stocksWithPrices.reduce((sum, s) => sum + s.totalValue, 0);
    const totalCost = stocksWithPrices.reduce((sum, s) => sum + s.totalCost, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    return {
      stocks: stocks,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
    };
  }, [stocksWithPrices, stocks]);

  return {
    stocks,
    stocksWithPrices,
    addStock,
    removeStock,
    updateStock,
    portfolioSummary,
    isLoading,
    lastUpdated,
    refresh,
  };
}
