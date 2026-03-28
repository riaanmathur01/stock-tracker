# 📈 Stock Tracker — CLAUDE.md
> This file is automatically read by Claude Code at the start of every session.
> It contains ALL the rules, conventions, architecture decisions, and context
> needed to build and maintain this project. Follow everything here precisely.

---

## 🧠 Project Overview

**Name:** Stock Tracker  
**Type:** Full-stack web application  
**Purpose:** A personal stock portfolio tracker where users can add stocks they own,
track current prices, monitor gains/losses, and view their portfolio performance
over time — all in a clean, modern dashboard.

**Target Audience:** Individual investors and finance enthusiasts who want a
lightweight, beautiful alternative to bloated finance apps.

**Core User Goals:**
- Add stocks to a personal portfolio with the price they paid (buy price)
- See real-time (or near real-time) current prices fetched from a free API
- Instantly know if they're in profit or loss, and by how much
- View their overall portfolio health at a glance
- Have data persist across sessions (no data loss on refresh)

---

## 🛠️ Tech Stack (STRICT — Do NOT deviate)

| Layer            | Technology                          |
|------------------|-------------------------------------|
| Framework        | **Next.js 14+ (App Router)**        |
| Language         | **TypeScript** (strict mode ON)     |
| Styling          | **Tailwind CSS v3**                 |
| UI Components    | **shadcn/ui** (built on Radix UI)   |
| Icons            | **lucide-react**                    |
| Data Fetching    | **Next.js Server Actions** + fetch  |
| Stock API        | **Yahoo Finance (unofficial yfinance HTTP)** or **Alpha Vantage free tier** |
| State Management | **React useState + useContext**     |
| Persistence      | **localStorage** (client-side) for portfolio data |
| Charts           | **Recharts**                        |
| Animations       | **Framer Motion**                   |
| Forms            | **React Hook Form + Zod**           |
| Notifications    | **react-hot-toast**                 |

**Do NOT use:**
- No Python, Flask, Django, or any backend Python
- No Redux or Zustand (keep it simple)
- No external databases for MVP (localStorage is fine)
- No class components (always use functional components + hooks)
- No `any` TypeScript type (use proper types always)
- No inline styles (always use Tailwind classes)
- No `px` units in Tailwind unless absolutely necessary (prefer Tailwind spacing scale)

---

## 📁 Project Structure

Follow this EXACT folder structure. Never create files outside of it:

```
stock-tracker/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with providers, fonts
│   ├── page.tsx                  # Home page → redirects to /dashboard
│   ├── globals.css               # Tailwind base + custom CSS variables
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard view
│   ├── portfolio/
│   │   └── page.tsx              # Detailed portfolio breakdown
│   └── api/
│       └── stocks/
│           └── route.ts          # API route for fetching stock prices
│
├── components/
│   ├── ui/                       # shadcn/ui auto-generated components (DO NOT edit)
│   ├── layout/
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── Sidebar.tsx           # Side navigation (desktop)
│   │   └── MobileNav.tsx        # Bottom nav bar (mobile)
│   ├── dashboard/
│   │   ├── PortfolioSummary.tsx  # Total value, total gain/loss card
│   │   ├── StockCard.tsx        # Individual stock display card
│   │   ├── StockList.tsx        # List of all tracked stocks
│   │   ├── AddStockModal.tsx    # Modal form to add a new stock
│   │   └── PortfolioChart.tsx   # Recharts pie/line chart
│   └── shared/
│       ├── LoadingSpinner.tsx    # Reusable loading state
│       ├── ErrorBoundary.tsx     # Error fallback UI
│       └── PriceChange.tsx      # Green/red price change badge
│
├── lib/
│   ├── types.ts                  # All TypeScript interfaces and types
│   ├── utils.ts                  # Utility functions (formatting, calculations)
│   ├── constants.ts              # App-wide constants (API URLs, etc.)
│   ├── stockApi.ts               # All stock price fetching logic
│   └── portfolioStorage.ts      # localStorage read/write helpers
│
├── hooks/
│   ├── usePortfolio.ts           # Custom hook: portfolio CRUD operations
│   ├── useStockPrices.ts         # Custom hook: fetch + auto-refresh prices
│   └── useLocalStorage.ts       # Generic localStorage hook
│
├── context/
│   └── PortfolioContext.tsx      # Global portfolio state provider
│
├── public/
│   └── favicon.ico
│
├── .env.local                    # API keys (NEVER commit this file)
├── .env.example                  # Template for env vars (safe to commit)
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── CLAUDE.md                     ← YOU ARE HERE
```

---

## 🎨 Design System

### Color Palette

Use these Tailwind CSS custom colors. Define them in `tailwind.config.ts`:

```typescript
// tailwind.config.ts
colors: {
  brand: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',  // primary green — profit
    600: '#16a34a',
    700: '#15803d',
    900: '#14532d',
  },
  danger: {
    500: '#ef4444',  // red — loss
    600: '#dc2626',
  },
  surface: {
    50:  '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  }
}
```

### Visual Rules

- **Background:** Dark theme by default (`surface-950` background, `surface-900` cards)
- **Cards:** Rounded-2xl, subtle border (`border-surface-800`), slight shadow
- **Profit:** Always `text-brand-500` with a green badge/background
- **Loss:** Always `text-danger-500` with a red badge/background
- **Neutral/unchanged:** `text-zinc-400`
- **Primary font:** Use `font-mono` for all number/price displays (feels financial)
- **Body text:** Use `font-sans` (default Tailwind)

### Component Style Rules

1. **Cards** must have: `rounded-2xl bg-surface-900 border border-surface-800 p-6`
2. **Buttons (primary):** `bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2 font-semibold transition-colors`
3. **Buttons (ghost):** `hover:bg-surface-800 text-zinc-400 hover:text-white rounded-xl px-4 py-2 transition-colors`
4. **Inputs:** `bg-surface-800 border border-surface-700 rounded-xl px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500`
5. **Modals:** Use shadcn Dialog component, always with a dark overlay

### Animations (Framer Motion)

- All cards should fade in + slide up on mount: `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`
- Stagger list items: use `transition={{ delay: index * 0.05 }}`
- Number changes (price updates) should animate with a subtle scale pulse
- Modal open/close: use shadcn's built-in Radix animation

---

## 🔌 Stock Data API

### Primary API: Yahoo Finance (via `yahoo-finance2` npm package)

Install: `npm install yahoo-finance2`

Use it in the Next.js API route (`app/api/stocks/route.ts`) to avoid CORS issues.
Never call external stock APIs directly from the client — always route through Next.js API.

```typescript
// Example usage in API route
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  
  const quote = await yahooFinance.quote(symbol);
  return Response.json({
    symbol: quote.symbol,
    price: quote.regularMarketPrice,
    change: quote.regularMarketChange,
    changePercent: quote.regularMarketChangePercent,
    name: quote.shortName,
  });
}
```

### Fallback API: Alpha Vantage (Free Tier)

- Sign up at: https://www.alphavantage.co/support/#api-key
- Store key in `.env.local` as `ALPHA_VANTAGE_API_KEY`
- Free tier: 25 requests/day, 5 requests/minute
- Use only as fallback if yahoo-finance2 fails

### Auto-Refresh

- Prices should auto-refresh every **60 seconds** when the tab is active
- Use `setInterval` inside `useStockPrices.ts` hook
- Pause refresh when `document.hidden === true` (tab not visible)
- Show a "Last updated: X seconds ago" timestamp on the dashboard

---

## 📦 TypeScript Types

Define ALL types in `lib/types.ts`. Never define types inline in component files.

```typescript
// lib/types.ts

export interface Stock {
  id: string;               // uuid generated on add
  symbol: string;           // e.g. "AAPL"
  name: string;             // e.g. "Apple Inc."
  quantity: number;         // How many shares owned
  buyPrice: number;         // Price paid per share (in USD)
  addedAt: string;          // ISO date string
}

export interface StockWithPrice extends Stock {
  currentPrice: number;
  change: number;           // price change today
  changePercent: number;    // % change today
  totalValue: number;       // currentPrice * quantity
  totalCost: number;        // buyPrice * quantity
  gainLoss: number;         // totalValue - totalCost
  gainLossPercent: number;  // (gainLoss / totalCost) * 100
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
```

---

## 🧮 Business Logic & Calculations

All financial calculations live in `lib/utils.ts`. Rules:

```typescript
// Always round money to 2 decimal places
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

// Always show + or - sign for gain/loss
export const formatGainLoss = (value: number): string =>
  `${value >= 0 ? '+' : ''}${formatCurrency(value)}`;

// Percent formatted as "+5.23%" or "-2.10%"
export const formatPercent = (value: number): string =>
  `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

// gainLoss = (currentPrice - buyPrice) * quantity
// gainLossPercent = ((currentPrice - buyPrice) / buyPrice) * 100
```

---

## 💾 Data Persistence (localStorage)

All portfolio data is stored in the browser's localStorage under the key `"stock-tracker-portfolio"`.

Rules for `lib/portfolioStorage.ts`:

1. Always wrap localStorage calls in try/catch (it can throw in incognito/private mode)
2. Validate data shape when reading — corrupt data should be handled gracefully (show empty state, not crash)
3. Debounce writes — don't write to localStorage on every keystroke, debounce by 300ms
4. Emit a custom DOM event `"portfolio-updated"` after every write so other tabs can sync

```typescript
const STORAGE_KEY = 'stock-tracker-portfolio';

export const savePortfolio = (stocks: Stock[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
    window.dispatchEvent(new Event('portfolio-updated'));
  } catch (error) {
    console.error('Failed to save portfolio:', error);
  }
};

export const loadPortfolio = (): Stock[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // TODO: Add Zod validation here
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
```

---

## 📋 Feature List (Build in This Order)

### Phase 1 — Core MVP

- [x] Project setup (Next.js, Tailwind, shadcn/ui, TypeScript)
- [ ] `PortfolioContext` — global state for portfolio
- [ ] `useLocalStorage` hook
- [ ] `portfolioStorage.ts` — save/load from localStorage
- [ ] Dashboard page skeleton with dark theme
- [ ] `AddStockModal` — form with symbol, quantity, buy price
- [ ] `StockCard` — shows symbol, current price, gain/loss
- [ ] `StockList` — renders all stock cards
- [ ] API route `/api/stocks` — fetches real price from Yahoo Finance
- [ ] `useStockPrices` hook — fetches and auto-refreshes prices

### Phase 2 — Visualizations & UX

- [ ] `PortfolioSummary` — total value card at top of dashboard
- [ ] `PortfolioChart` — pie chart (portfolio allocation) using Recharts
- [ ] Line chart — portfolio value over time (mock historical data for now)
- [ ] Sort and filter stocks (by gain, by value, by symbol)
- [ ] Delete stock with confirmation dialog
- [ ] Edit stock (change quantity or buy price)

### Phase 3 — Polish

- [ ] Framer Motion animations on all cards and lists
- [ ] Skeleton loading states while prices load
- [ ] Error states with retry button
- [ ] "Last updated" timestamp with live counter
- [ ] Mobile-responsive layout with bottom navigation
- [ ] Empty state illustration when no stocks added yet
- [ ] Toast notifications for add/delete/error events
- [ ] Keyboard shortcut: press `N` to open Add Stock modal

---

## ✅ Code Quality Rules

### General

- Every component file must have a named export (no default exports except for pages)
- All props must be typed with a TypeScript interface
- No `console.log` left in production code — use `console.error` only for real errors
- Components should be small and single-purpose (max ~150 lines per file)
- Extract repeated logic into custom hooks or utility functions

### Naming Conventions

| Thing             | Convention              | Example                    |
|-------------------|-------------------------|----------------------------|
| Components        | PascalCase              | `StockCard.tsx`            |
| Hooks             | camelCase with `use`    | `usePortfolio.ts`          |
| Utility functions | camelCase               | `formatCurrency()`         |
| Types/Interfaces  | PascalCase              | `StockWithPrice`           |
| Constants         | UPPER_SNAKE_CASE        | `REFRESH_INTERVAL_MS`      |
| CSS classes       | Tailwind only           | `"text-brand-500 font-mono"` |
| Event handlers    | `handle` prefix         | `handleAddStock`           |
| Boolean state     | `is/has/can` prefix     | `isLoading`, `hasError`    |

### File Import Order (always in this order)

```typescript
// 1. React and Next.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

// 3. Internal components
import { StockCard } from '@/components/dashboard/StockCard';

// 4. Internal hooks and utilities
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatCurrency } from '@/lib/utils';

// 5. Types
import type { Stock } from '@/lib/types';
```

### Error Handling

- Every API call must be wrapped in try/catch
- Every component that fetches data must have: loading state, error state, empty state
- Show user-friendly error messages (never show raw error objects to users)
- Log errors to console.error with context: `console.error('[useStockPrices] Failed to fetch:', symbol, error)`

---

## 🌐 Environment Variables

Store secrets in `.env.local` (git-ignored). Never hardcode API keys.

```bash
# .env.local (DO NOT COMMIT)
ALPHA_VANTAGE_API_KEY=your_key_here

# .env.example (safe to commit — shows what's needed)
ALPHA_VANTAGE_API_KEY=
```

Access in code: `process.env.ALPHA_VANTAGE_API_KEY`
Only access env vars in server-side code (API routes, Server Components).
For client-side env vars, prefix with `NEXT_PUBLIC_`.

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Run dev server (localhost:3000)
npm run dev

# Type check without building
npx tsc --noEmit

# Build for production
npm run build

# Run production build locally
npm start

# Lint check
npm run lint

# Add a new shadcn component
npx shadcn@latest add <component-name>
# Examples:
npx shadcn@latest add dialog
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add toast
```

---

## 🏗️ Initial Setup Checklist

Run these commands in order when starting fresh:

```bash
# 1. Create Next.js app
npx create-next-app@latest stock-tracker --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"

cd stock-tracker

# 2. Install core dependencies
npm install framer-motion recharts react-hook-form @hookform/resolvers zod react-hot-toast yahoo-finance2 uuid lucide-react

npm install --save-dev @types/uuid

# 3. Initialize shadcn/ui
npx shadcn@latest init
# Choose: Default style, Zinc base color, CSS variables YES

# 4. Add shadcn components we'll need
npx shadcn@latest add button card dialog input label badge skeleton toast

# 5. Create the folder structure
mkdir -p components/{ui,layout,dashboard,shared} lib hooks context app/{dashboard,portfolio,api/stocks}

# 6. Create empty placeholder files
touch lib/types.ts lib/utils.ts lib/constants.ts lib/stockApi.ts lib/portfolioStorage.ts
touch hooks/usePortfolio.ts hooks/useStockPrices.ts hooks/useLocalStorage.ts
touch context/PortfolioContext.tsx
```

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Fix |
|-------|-------|-----|
| CORS error fetching stock prices | Called API from client directly | Route all API calls through `/api/stocks` Next.js route |
| localStorage is undefined | Running server-side | Wrap in `typeof window !== 'undefined'` check |
| TypeScript error on `any` | strict mode ON | Define proper types in `lib/types.ts` |
| Tailwind classes not working | Class not in purge whitelist | Use complete class names, not dynamic string concatenation |
| Rate limit from Yahoo Finance | Too many requests | Add caching in the API route, debounce refreshes |
| Price shows NaN | API returned null | Always add fallback: `quote.regularMarketPrice ?? 0` |

---

## 📐 Responsive Breakpoints

| Breakpoint | Width    | Layout                              |
|------------|----------|-------------------------------------|
| `sm`       | 640px+   | Still single column                 |
| `md`       | 768px+   | Show sidebar, 2-column grid         |
| `lg`       | 1024px+  | 3-column stock grid                 |
| `xl`       | 1280px+  | Full dashboard layout with sidebar  |

Mobile-first approach: write base styles for mobile, then add `md:` and `lg:` overrides.

---

## 🔒 Security Rules

- NEVER expose API keys on the client side
- NEVER trust user input without validation (use Zod schemas)
- Stock symbols should be sanitized before API calls: only allow `[A-Z.]{1,10}`
- Numbers (quantity, price) must be validated as positive numbers
- All form data validated on both client (real-time feedback) and server (API route)

---

## 📝 Notes for Claude

- When in doubt about a design decision, default to what makes the user experience simpler
- The user is learning — write clear, readable code with comments explaining WHY not just WHAT
- Prefer explicit over clever: `const isProfit = gainLoss > 0` is better than a ternary mess
- When adding a new feature, check this file first to see if there's already a convention for it
- Always run `npx tsc --noEmit` mentally before finishing — no TypeScript errors allowed
- Keep components pure where possible — side effects belong in hooks, not in render

---

*Last updated: 2026 | Project: Stock Tracker | Stack: Next.js + Tailwind + TypeScript*