import { API_BASE_URL } from './constants';

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export const fetchStockPrice = async (symbol: string): Promise<StockQuote> => {
  const response = await fetch(`${API_BASE_URL}?symbol=${encodeURIComponent(symbol)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error((errorData as { error?: string }).error ?? `Failed to fetch ${symbol}`);
  }
  return response.json() as Promise<StockQuote>;
};

export const fetchMultipleStocks = async (symbols: string[]): Promise<StockQuote[]> => {
  const results = await Promise.allSettled(symbols.map(fetchStockPrice));
  return results
    .map((result, i) => {
      if (result.status === 'fulfilled') return result.value;
      console.error(`[stockApi] Failed to fetch ${symbols[i]}:`, result.reason);
      return null;
    })
    .filter((q): q is StockQuote => q !== null);
};
