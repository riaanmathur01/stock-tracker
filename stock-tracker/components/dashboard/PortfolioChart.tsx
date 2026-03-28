'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import type { StockWithPrice } from '@/lib/types';

interface PortfolioChartProps {
  stocks: StockWithPrice[];
}

const COLORS = [
  '#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#14b8a6', '#ef4444',
];

interface ChartData {
  name: string;
  symbol: string;
  value: number;
  percent: number;
}

interface TooltipPayload {
  payload: ChartData;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-800 border border-surface-700 rounded-xl p-3 shadow-lg">
        <p className="font-mono font-bold text-white">{data.symbol}</p>
        <p className="text-zinc-400 text-sm">{data.name}</p>
        <p className="text-brand-500 font-mono mt-1">{formatCurrency(data.value)}</p>
        <p className="text-zinc-400 text-sm">{data.percent.toFixed(1)}% of portfolio</p>
      </div>
    );
  }
  return null;
};

export function PortfolioChart({ stocks }: PortfolioChartProps) {
  const totalValue = stocks.reduce((sum, s) => sum + s.totalValue, 0);
  if (totalValue === 0) return null;

  const data: ChartData[] = stocks.map((s) => ({
    name: s.name,
    symbol: s.symbol,
    value: s.totalValue,
    percent: (s.totalValue / totalValue) * 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="rounded-2xl bg-surface-900 border border-surface-800 p-6"
    >
      <h2 className="text-white font-semibold mb-4">Portfolio Allocation</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={600}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-zinc-400 text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
