'use client';

import { TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onAddStock: () => void;
}

export function Navbar({ onAddStock }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-surface-900 border-b border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500/10">
            <TrendingUp className="h-5 w-5 text-brand-500" />
          </div>
          <span className="font-semibold text-white text-lg">Stock Tracker</span>
        </div>

        <Button
          onClick={onAddStock}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-xl px-4 py-2 font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Stock
        </Button>
      </div>
    </header>
  );
}
