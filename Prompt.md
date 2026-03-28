# 🚀 Stock Tracker — Claude Code Starting Prompt

> Copy and paste this prompt into Claude Code after running `claude` in your project folder.
> This is your first message. It will kick off the entire project build.

---

## 📋 THE PROMPT (copy everything below this line)

---

Hey Claude! I want you to build a full-stack stock portfolio tracker web app from scratch. I have a CLAUDE.md file in this folder — please read it first before doing anything else, as it has ALL the rules, conventions, and decisions for this project.

After reading CLAUDE.md, do the following:

---

### STEP 1 — Read the CLAUDE.md file

Read the CLAUDE.md file in this directory completely. Confirm you've read it by summarizing:
- The tech stack we're using
- The folder structure we'll follow
- The color palette and design rules
- The TypeScript types we'll need

---

### STEP 2 — Run the Initial Setup

Run all the setup commands from the CLAUDE.md "Initial Setup Checklist" section in order:

1. Create the Next.js app with TypeScript, Tailwind, ESLint, and App Router
2. Install all dependencies: framer-motion, recharts, react-hook-form, @hookform/resolvers, zod, react-hot-toast, yahoo-finance2, uuid, lucide-react
3. Initialize shadcn/ui with Zinc color and CSS variables
4. Add shadcn components: button, card, dialog, input, label, badge, skeleton, toast
5. Create ALL the folders: components/ui, components/layout, components/dashboard, components/shared, lib, hooks, context, app/dashboard, app/portfolio, app/api/stocks
6. Create all the empty placeholder files listed in CLAUDE.md

After each step, confirm it worked before moving to the next one.

---

### STEP 3 — Build the Foundation Files

Create these files with full, working code (not placeholders):

**`lib/types.ts`**
- All TypeScript interfaces exactly as defined in CLAUDE.md
- Stock, StockWithPrice, Portfolio, AddStockForm, SortOption, SortDirection

**`lib/constants.ts`**
- REFRESH_INTERVAL_MS = 60000
- STORAGE_KEY = 'stock-tracker-portfolio'
- MAX_STOCKS = 50
- STOCK_SYMBOL_REGEX = /^[A-Z.]{1,10}$/
- API_BASE_URL = '/api/stocks'

**`lib/utils.ts`**
- formatCurrency(value: number): string — using Intl.NumberFormat USD
- formatGainLoss(value: number): string — with + or - sign
- formatPercent(value: number): string — like "+5.23%" or "-2.10%"
- calculateGainLoss(currentPrice, buyPrice, quantity) — returns gainLoss and gainLossPercent
- generateId(): string — uses crypto.randomUUID()
- formatTimestamp(date: Date): string — "2 minutes ago" style
- sanitizeSymbol(symbol: string): string — uppercase + trim + validate

**`lib/portfolioStorage.ts`**
- savePortfolio(stocks: Stock[]): void — saves to localStorage with error handling
- loadPortfolio(): Stock[] — loads from localStorage with validation and fallback to []
- clearPortfolio(): void — removes the localStorage key
- Dispatch 'portfolio-updated' custom event after every write

**`lib/stockApi.ts`**
- fetchStockPrice(symbol: string): Promise<StockQuote> — calls our /api/stocks route
- fetchMultipleStocks(symbols: string[]): Promise<StockQuote[]> — fetches all in parallel with Promise.allSettled
- Define StockQuote type inside this file

---

### STEP 4 — Build the API Route

**`app/api/stocks/route.ts`**

Build a GET handler that:
- Reads `symbol` query param
- Validates it matches STOCK_SYMBOL_REGEX
- Uses yahoo-finance2 to fetch the quote
- Returns JSON: { symbol, name, price, change, changePercent }
- Has proper error handling — returns 400 for invalid symbol, 500 for API failures
- Add a simple in-memory cache (Map) so the same symbol isn't fetched more than once per 30 seconds

---

### STEP 5 — Build the Context and Hooks

**`context/PortfolioContext.tsx`**
- Provides: stocks (Stock[]), addStock, removeStock, updateStock, isLoading
- Loads from localStorage on mount using loadPortfolio()
- Saves to localStorage on every change using savePortfolio()
- Export usePortfolioContext hook
- Wrap in a PortfolioProvider component

**`hooks/useLocalStorage.ts`**
- Generic hook: useLocalStorage<T>(key, initialValue)
- Returns [value, setValue] like useState
- Syncs across tabs using the 'storage' window event

**`hooks/useStockPrices.ts`**
- Takes an array of stock symbols
- Fetches all prices on mount
- Auto-refreshes every 60 seconds (pauses when tab is hidden)
- Returns: { prices, isLoading, error, lastUpdated, refresh }
- lastUpdated is a Date object

**`hooks/usePortfolio.ts`**
- Uses usePortfolioContext
- Returns: { stocks, stocksWithPrices, addStock, removeStock, portfolioSummary }
- stocksWithPrices merges Stock[] with live price data
- portfolioSummary computes: totalValue, totalCost, totalGainLoss, totalGainLossPercent

---

### STEP 6 — Build the UI Components

**`components/shared/LoadingSpinner.tsx`**
- A centered spinning circle using Tailwind animate-spin
- Accepts a `size` prop: 'sm' | 'md' | 'lg'
- Uses brand-500 color

**`components/shared/PriceChange.tsx`**
- Accepts: value (number), type ('currency' | 'percent')
- Shows green with TrendingUp icon if positive
- Shows red with TrendingDown icon if negative
- Shows zinc if zero
- Animates number changes with framer-motion

**`components/dashboard/PortfolioSummary.tsx`**
- Big card at the top of the dashboard
- Shows: Total Portfolio Value (large), Total Gain/Loss, Total Return %
- Subtle background gradient (brand color if profit, red if loss)
- Animate in with framer-motion on mount

**`components/dashboard/StockCard.tsx`**
- Card for one stock showing:
  - Stock symbol (large, bold, monospace)
  - Company name (smaller, zinc-400)
  - Current price (monospace)
  - Today's change (PriceChange component)
  - Your gain/loss since purchase (PriceChange component)
  - Shares owned and total value
  - Delete button (appears on hover)
- Skeleton loading state when price is loading
- framer-motion: fade in + slide up with staggered delay based on index

**`components/dashboard/StockList.tsx`**
- Renders a grid of StockCards: 1 col mobile, 2 col md, 3 col lg
- Shows empty state if no stocks: illustration + "Add your first stock" message
- Sort bar at the top: by gain/loss, value, change %, symbol

**`components/dashboard/AddStockModal.tsx`**
- shadcn Dialog component
- Form fields: Stock Symbol (text), Shares Owned (number), Buy Price per Share (number)
- Use react-hook-form + zod for validation
- Zod schema: symbol must match regex, quantity > 0, buyPrice > 0
- Show validation errors inline
- On submit: fetch the stock name from API to confirm it's valid, then add to portfolio
- Show loading state during submission
- Toast success/error on completion

**`components/dashboard/PortfolioChart.tsx`**
- Recharts PieChart showing portfolio allocation by stock
- Each slice = one stock, size = percentage of total portfolio value
- Custom tooltip showing stock name, value, percentage
- Legend below the chart
- Animate with Recharts built-in animation

**`components/layout/Navbar.tsx`**
- Top bar: app logo/name on left, "Add Stock" button on right
- Dark background: surface-900
- Subtle bottom border: border-surface-800
- "Add Stock" button opens AddStockModal

---

### STEP 7 — Build the Pages

**`app/globals.css`**
- Tailwind base, components, utilities
- Add CSS variables for the custom colors from CLAUDE.md
- Set html background to surface-950 (#09090b)
- Custom scrollbar styles (thin, dark)

**`app/layout.tsx`**
- Wrap everything in PortfolioProvider
- Import and render Navbar
- Set metadata: title "Stock Tracker", description
- Use dark color scheme
- Add Toaster from react-hot-toast

**`app/page.tsx`**
- Redirect to /dashboard using Next.js redirect()

**`app/dashboard/page.tsx`**
- Import and render in order:
  1. PortfolioSummary
  2. PortfolioChart (only if 2+ stocks)
  3. StockList
- Page title: "My Portfolio"
- Wrap entire page in framer-motion AnimatePresence

**`tailwind.config.ts`**
- Add all custom colors from CLAUDE.md (brand, danger, surface)
- Add fontFamily: mono for financial numbers

---

### STEP 8 — Final Checks

After building everything:

1. Run `npx tsc --noEmit` — fix ALL TypeScript errors before finishing
2. Make sure every component has proper TypeScript types (no `any`)
3. Check that localStorage read/write is wrapped in try/catch
4. Verify the API route works by testing with symbol "AAPL"
5. Make sure the empty state shows when no stocks are added
6. Confirm the dark theme is consistent across all components
7. Test that adding a stock, seeing the price, and deleting it all work end to end

---

### WHAT SUCCESS LOOKS LIKE

When done, I should be able to:
1. Open http://localhost:3000 and see a dark dashboard
2. Click "Add Stock", type "AAPL", enter quantity 10, buy price 150
3. See Apple's current price, today's change, and my gain/loss appear on a card
4. See the portfolio summary card update with my total value
5. See a pie chart showing 100% Apple
6. Add a second stock (e.g. GOOGL) and see the chart update
7. Delete a stock and see it disappear smoothly
8. Refresh the page and see my stocks are still there (localStorage)
9. Wait 60 seconds and see prices auto-refresh

---

Please start with STEP 1 and work through each step in order. 
Ask me before doing anything destructive. Show me what you're building as you go!