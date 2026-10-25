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
  const [amount, setAmount] = useState<string>('25');
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
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-slate-100">Place Prediction</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-100">
            ✕
          </button>
        </div>

        <div className="mt-4">
          <span className="inline-block rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
            {market.category}
          </span>
          <h4 className="mt-2 text-base font-medium text-slate-100 leading-snug">
            {market.title}
          </h4>
        </div>

        {/* Outcome Toggle */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOutcome('YES')}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 transition-all ${
              outcome === 'YES'
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-lg shadow-emerald-950/30'
                : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-xs font-semibold tracking-wider">BUY YES</span>
            <span className="text-xl font-bold font-mono mt-1">${(yesPrice).toFixed(2)}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">({(yesPrice * 100).toFixed(0)}% probability)</span>
          </button>

          <button
            type="button"
            onClick={() => setOutcome('NO')}
            className={`flex flex-col items-center justify-center rounded-xl border p-3.5 transition-all ${
              outcome === 'NO'
                ? 'border-rose-500 bg-rose-950/40 text-rose-400 shadow-lg shadow-rose-950/30'
                : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-xs font-semibold tracking-wider">BUY NO</span>
            <span className="text-xl font-bold font-mono mt-1">${(noPrice).toFixed(2)}</span>
            <span className="text-[11px] text-slate-500 mt-0.5">({(noPrice * 100).toFixed(0)}% probability)</span>
          </button>
        </div>

        {/* Amount Input */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Prediction Amount (USDC)</span>
            <span>Balance: 250.00 USDC</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 pl-8 pr-20 text-slate-100 font-mono text-sm focus:border-sky-500 focus:outline-none"
              placeholder="0.00"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
              {['10', '25', '100'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:bg-slate-700"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Summary */}
        <div className="mt-5 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Est. Shares Received:</span>
            <span className="font-mono text-slate-200">{estimatedShares.toFixed(2)} {outcome}</span>
          </div>
          <div className="flex justify-between">
            <span>Potential Return:</span>
            <span className="font-mono text-emerald-400 font-medium">
              ${estimatedShares.toFixed(2)} (+{numericAmount > 0 ? ((potentialProfit / numericAmount) * 100).toFixed(1) : '0'}%)
            </span>
          </div>
          <div className="flex justify-between">
            <span>Network Fee (Stellar):</span>
            <span className="font-mono text-slate-400">&lt; 0.00001 XLM (~$0.000001)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          {success ? (
            <div className="flex items-center justify-center space-x-2 rounded-xl bg-emerald-500/20 py-3 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold text-sm">Prediction Recorded on Soroban!</span>
            </div>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={loading || numericAmount <= 0}
              className={`w-full rounded-xl py-3 text-sm font-semibold text-white transition-all ${
                outcome === 'YES'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-rose-600 hover:bg-rose-500'
              } disabled:opacity-50`}
            >
              {loading ? 'Submitting to Soroban...' : `Confirm Prediction (${outcome})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
