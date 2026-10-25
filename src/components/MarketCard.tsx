'use client';

import React, { useState } from 'react';
import { Market } from '@/lib/types';
import { TrendingUp, Clock, DollarSign, ChevronRight } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onSelect: (market: Market) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onSelect }) => {
  const totalPool = market.total_yes_amount + market.total_no_amount;
  const yesShare = totalPool > 0 ? (market.total_yes_amount / totalPool) * 100 : 50;
  const noShare = 100 - yesShare;

  const totalVolUSDC = totalPool / 10000000; // Stroop conversion

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/90 p-5 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-sky-950/20">
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-slate-800/80 px-2 py-0.5 text-xs font-medium text-slate-400">
            {market.category}
          </span>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Active</span>
          </div>
        </div>

        <h3 className="mt-3 text-base font-semibold text-slate-100 line-clamp-2 leading-snug">
          {market.title}
        </h3>

        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {market.description}
        </p>
      </div>

      <div className="mt-5">
        {/* Probability Bar */}
        <div className="flex items-center justify-between text-xs font-mono font-medium mb-1.5">
          <span className="text-emerald-400">{yesShare.toFixed(0)}% YES</span>
          <span className="text-rose-400">{noShare.toFixed(0)}% NO</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800 flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${yesShare}%` }}
          />
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${noShare}%` }}
          />
        </div>

        {/* Buttons & Stats */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3.5">
          <div className="flex items-center text-xs text-slate-400">
            <span>Vol: ${totalVolUSDC > 0 ? (totalVolUSDC / 1000).toFixed(1) + 'k' : '0.00'}</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onSelect(market)}
              className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              YES ${(yesShare / 100).toFixed(2)}
            </button>
            <button
              onClick={() => onSelect(market)}
              className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
            >
              NO ${(noShare / 100).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
