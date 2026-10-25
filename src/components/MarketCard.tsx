'use client';

import React from 'react';
import { Market } from '@/lib/types';
import { Clock } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onSelect: (market: Market) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onSelect }) => {
  const totalPool = market.total_yes_amount + market.total_no_amount;
  const yesShare = totalPool > 0 ? (market.total_yes_amount / totalPool) * 100 : 50;
  const noShare = 100 - yesShare;
  const totalVolUSDC = totalPool / 10000000;

  return (
    <div className="nv-card flex flex-col justify-between p-6 transition-all duration-150">
      {/* NVIDIA signature corner square */}
      <div className="nv-corner-square" />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#76b900]">
            {market.category}
          </span>
          <div className="flex items-center space-x-1.5 text-xs text-[#898989]">
            <Clock className="h-3 w-3" />
            <span>ACTIVE RUN</span>
          </div>
        </div>

        <h3 className="mt-3 text-lg font-bold text-white leading-tight">
          {market.title}
        </h3>

        <p className="mt-2 text-sm text-[#a7a7a7] leading-relaxed line-clamp-2">
          {market.description}
        </p>
      </div>

      <div className="mt-6 border-t border-[#262626] pt-4">
        {/* Probability Metric Bar */}
        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
          <span className="text-[#76b900]">{yesShare.toFixed(0)}% YES</span>
          <span className="text-[#898989]">{noShare.toFixed(0)}% NO</span>
        </div>
        <div className="h-1.5 w-full bg-[#1a1a1a] flex">
          <div
            className="h-full bg-[#76b900] transition-all duration-300"
            style={{ width: `${yesShare}%` }}
          />
          <div
            className="h-full bg-[#404040] transition-all duration-300"
            style={{ width: `${noShare}%` }}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-mono text-[#757575]">
            VOL: ${totalVolUSDC > 0 ? (totalVolUSDC / 1000).toFixed(1) + 'K' : '0.00'}
          </span>

          <div className="flex space-x-2">
            <button
              onClick={() => onSelect(market)}
              className="nv-btn-primary px-3.5 py-1.5 text-xs tracking-wider uppercase"
            >
              YES ${(yesShare / 100).toFixed(2)}
            </button>
            <button
              onClick={() => onSelect(market)}
              className="nv-btn-outline px-3.5 py-1.5 text-xs tracking-wider uppercase"
            >
              NO ${(noShare / 100).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
