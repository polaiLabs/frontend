'use client';

import React, { useState } from 'react';
import { Market } from '@/lib/types';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

interface TradeModalProps {
  market: Market | null;
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  onTradeSuccess: (marketId: number, outcome: 'YES' | 'NO', amount: number) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  market,
  isOpen,
  onClose,
  walletAddress,
  onTradeSuccess,
}) => {
  const [outcome, setOutcome] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState<string>('50');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !market) return null;

  const totalPool = market.total_yes_amount + market.total_no_amount;
  const yesShare = totalPool > 0 ? market.total_yes_amount / totalPool : 0.5;
  const yesPrice = yesShare;
  const noPrice = 1 - yesShare;

  const currentPrice = outcome === 'YES' ? yesPrice : noPrice;
  const numericAmount = parseFloat(amount) || 0;
  const estimatedShares = currentPrice > 0 ? numericAmount / currentPrice : 0;
  const potentialProfit = estimatedShares - numericAmount;

  const handleConfirm = () => {
    if (!walletAddress) {
      alert('Please connect your Stellar wallet first!');
      return;
    }
    if (numericAmount <= 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      onTradeSuccess(market.id, outcome, numericAmount);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg border border-[#262626] bg-[#0d0d0d] p-6 text-white shadow-2xl" style={{ borderRadius: '2px' }}>
        {/* NVIDIA Corner Square */}
        <div className="nv-corner-square" />

        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-[#76b900]" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">Execute Prediction Order</h3>
          </div>
          <button onClick={onClose} className="text-[#757575] hover:text-white text-sm">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <span className="text-[11px] font-mono font-bold uppercase text-[#76b900] tracking-widest">
            {market.category}
          </span>
          <h4 className="mt-1 text-base font-bold text-white leading-tight">
            {market.title}
          </h4>
        </div>

        {/* Outcome Toggle */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOutcome('YES')}
            className={`flex flex-col items-center justify-center p-4 transition-all border ${
              outcome === 'YES'
                ? 'border-[#76b900] bg-[#1a2800] text-[#76b900]'
                : 'border-[#262626] bg-[#000000] text-[#898989] hover:border-[#404040]'
            }`}
            style={{ borderRadius: '2px' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider">BUY YES</span>
            <span className="text-xl font-bold font-mono mt-1 text-white">${yesPrice.toFixed(2)}</span>
            <span className="text-[11px] font-mono text-[#898989] mt-0.5">{(yesPrice * 100).toFixed(0)}% Probability</span>
          </button>

          <button
            type="button"
            onClick={() => setOutcome('NO')}
            className={`flex flex-col items-center justify-center p-4 transition-all border ${
              outcome === 'NO'
                ? 'border-[#76b900] bg-[#1a2800] text-[#76b900]'
                : 'border-[#262626] bg-[#000000] text-[#898989] hover:border-[#404040]'
            }`}
            style={{ borderRadius: '2px' }}
          >
            <span className="text-xs font-bold uppercase tracking-wider">BUY NO</span>
            <span className="text-xl font-bold font-mono mt-1 text-white">${noPrice.toFixed(2)}</span>
            <span className="text-[11px] font-mono text-[#898989] mt-0.5">{(noPrice * 100).toFixed(0)}% Probability</span>
          </button>
        </div>

        {/* Amount Input */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-mono text-[#898989] mb-1.5">
            <span className="uppercase tracking-wider">Amount (USDC)</span>
            <span>AVAILABLE: 250.00 USDC</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[#757575]">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-[#262626] bg-black py-2.5 pl-8 pr-24 font-mono text-sm text-white focus:border-[#76b900] focus:outline-none"
              style={{ borderRadius: '2px' }}
              placeholder="0.00"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              {['25', '50', '100'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className="bg-[#1a1a1a] px-2 py-0.5 font-mono text-xs text-[#a7a7a7] hover:bg-[#262626] hover:text-white"
                  style={{ borderRadius: '2px' }}
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Summary */}
        <div className="mt-5 space-y-2 border border-[#262626] bg-black p-3.5 font-mono text-xs text-[#898989]" style={{ borderRadius: '2px' }}>
          <div className="flex justify-between">
            <span>EST. CONTRACT SHARES:</span>
            <span className="text-white">{estimatedShares.toFixed(2)} {outcome}</span>
          </div>
          <div className="flex justify-between">
            <span>PROJECTED RETURN:</span>
            <span className="text-[#76b900] font-bold">
              ${estimatedShares.toFixed(2)} (+{numericAmount > 0 ? ((potentialProfit / numericAmount) * 100).toFixed(1) : '0'}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>STELLAR PROTOCOL FEE:</span>
            <span className="text-[#898989]">&lt; 0.00001 XLM</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {success ? (
            <div className="flex items-center justify-center space-x-2 border border-[#76b900] bg-[#1a2800] py-3 text-[#76b900]" style={{ borderRadius: '2px' }}>
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-bold text-xs uppercase tracking-wider">Transaction Finalized on Soroban!</span>
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={loading || numericAmount <= 0}
              className="nv-btn-primary w-full py-3 text-xs tracking-wider uppercase disabled:opacity-40"
            >
              {loading ? 'Transacting on Soroban...' : `Confirm Order (${outcome})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
