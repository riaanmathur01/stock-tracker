export interface Stock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  addedAt: string;
}

export interface StockWithPrice extends Stock {
  currentPrice: number;
  change: number;
  changePercent: number;
  totalValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
  isLoading: boolean;
  error?: string;
}

export interface Portfolio {
  stocks: Stock[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export interface AddStockForm {
  symbol: string;
  quantity: number;
  buyPrice: number;
}

export type SortOption = 'gainLoss' | 'value' | 'changePercent' | 'symbol';
export type SortDirection = 'asc' | 'desc';
