import type { Stock } from './types';

const STORAGE_KEY = 'stock-tracker-portfolio';

export const savePortfolio = (stocks: Stock[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
    window.dispatchEvent(new Event('portfolio-updated'));
  } catch (error) {
    console.error('[portfolioStorage] Failed to save portfolio:', error);
  }
};

export const loadPortfolio = (): Stock[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    // Basic shape validation
    return parsed.filter(
      (item): item is Stock =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Stock).id === 'string' &&
        typeof (item as Stock).symbol === 'string' &&
        typeof (item as Stock).quantity === 'number' &&
        typeof (item as Stock).buyPrice === 'number'
    );
  } catch {
    return [];
  }
};

export const clearPortfolio = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('portfolio-updated'));
  } catch (error) {
    console.error('[portfolioStorage] Failed to clear portfolio:', error);
  }
};
