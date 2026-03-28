'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { fetchStockPrice } from '@/lib/stockApi';
import { STOCK_SYMBOL_REGEX, MAX_STOCKS } from '@/lib/constants';
import type { AddStockForm } from '@/lib/types';

const schema = z.object({
  symbol: z
    .string()
    .min(1, 'Symbol is required')
    .max(10, 'Symbol too long')
    .transform((v) => v.trim().toUpperCase())
    .refine((v) => STOCK_SYMBOL_REGEX.test(v), 'Only letters and dots allowed (e.g. AAPL, BRK.B)'),
  quantity: z
    .number({ error: 'Must be a number' })
    .positive('Must be greater than 0')
    .max(1_000_000, 'Quantity too large'),
  buyPrice: z
    .number({ error: 'Must be a number' })
    .positive('Must be greater than 0')
    .max(1_000_000, 'Price too large'),
});

type FormValues = z.infer<typeof schema>;

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (form: AddStockForm & { name: string }) => void;
  currentCount: number;
}

export function AddStockModal({ isOpen, onClose, onAdd, currentCount }: AddStockModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    if (currentCount >= MAX_STOCKS) {
      toast.error(`Maximum ${MAX_STOCKS} stocks allowed`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Validate symbol and get stock name from API
      const quote = await fetchStockPrice(data.symbol);
      onAdd({
        symbol: data.symbol,
        name: quote.name,
        quantity: data.quantity,
        buyPrice: data.buyPrice,
      });
      toast.success(`${quote.name} added to portfolio!`);
      handleClose();
    } catch (err) {
      console.error('[AddStockModal] Failed to add stock:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to find stock. Check the symbol.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'bg-surface-800 border border-surface-700 rounded-xl px-4 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-surface-900 border border-surface-800 rounded-2xl text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-semibold">Add Stock</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          <div>
            <Label className="text-zinc-400 text-sm mb-1.5 block">Stock Symbol</Label>
            <Input
              {...register('symbol')}
              placeholder="e.g. AAPL, GOOGL, BRK.B"
              className={inputClass}
              disabled={isSubmitting}
              autoFocus
              style={{ textTransform: 'uppercase' }}
            />
            {errors.symbol && (
              <p className="text-danger-500 text-xs mt-1">{errors.symbol.message}</p>
            )}
          </div>

          <div>
            <Label className="text-zinc-400 text-sm mb-1.5 block">Shares Owned</Label>
            <Input
              {...register('quantity', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="e.g. 10"
              className={inputClass}
              disabled={isSubmitting}
            />
            {errors.quantity && (
              <p className="text-danger-500 text-xs mt-1">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <Label className="text-zinc-400 text-sm mb-1.5 block">Buy Price per Share (USD)</Label>
            <Input
              {...register('buyPrice', { valueAsNumber: true })}
              type="number"
              step="any"
              placeholder="e.g. 150.00"
              className={inputClass}
              disabled={isSubmitting}
            />
            {errors.buyPrice && (
              <p className="text-danger-500 text-xs mt-1">{errors.buyPrice.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 hover:bg-surface-800 text-zinc-400 hover:text-white rounded-xl border border-surface-700 bg-transparent transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Adding...
                </span>
              ) : (
                'Add Stock'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
