import YahooFinance from 'yahoo-finance2';
import { STOCK_SYMBOL_REGEX } from '@/lib/constants';

// yahoo-finance2 v3 requires instantiation
const yahooFinance = new YahooFinance();

interface CacheEntry {
  data: QuoteResponse;
  timestamp: number;
}

interface QuoteResponse {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

// In-memory cache: same symbol won't be fetched more than once per 30s
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol || !STOCK_SYMBOL_REGEX.test(symbol.toUpperCase())) {
    return Response.json({ error: 'Invalid or missing stock symbol' }, { status: 400 });
  }

  const upperSymbol = symbol.toUpperCase();

  // Serve from cache if fresh
  const cached = cache.get(upperSymbol);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return Response.json(cached.data);
  }

  try {
    const quote = await yahooFinance.quote(upperSymbol);

    const data: QuoteResponse = {
      symbol: quote.symbol,
      name: (quote.shortName ?? quote.longName ?? upperSymbol) as string,
      price: (quote.regularMarketPrice ?? 0) as number,
      change: (quote.regularMarketChange ?? 0) as number,
      changePercent: (quote.regularMarketChangePercent ?? 0) as number,
    };

    cache.set(upperSymbol, { data, timestamp: Date.now() });
    return Response.json(data);
  } catch (error) {
    console.error(`[/api/stocks] Failed to fetch ${upperSymbol}:`, error);
    return Response.json({ error: `Failed to fetch data for ${upperSymbol}` }, { status: 500 });
  }
}
