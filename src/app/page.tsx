'use client';

import React, { useState } from 'react';
import { Market, INITIAL_MARKETS } from '@/lib/types';
import { MarketCard } from '@/components/MarketCard';
import { TradeModal } from '@/components/TradeModal';
import { WalletModal } from '@/components/WalletModal';
import {
  TrendingUp,
  Wallet,
  Compass,
  Award,
  Zap,
  Search,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const categories = ['All', 'Crypto', 'AI/Tech', 'Gaming', 'Governance'];

  const filteredMarkets = markets.filter((m) => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenTrade = (market: Market) => {
    setSelectedMarket(market);
    setIsTradeOpen(true);
  };

  const handleTradeSuccess = (marketId: number, outcome: 'YES' | 'NO', amount: number) => {
    setMarkets((prev) =>
      prev.map((m) => {
        if (m.id === marketId) {
          const addedStroops = amount * 10000000;
          return {
            ...m,
            total_yes_amount: outcome === 'YES' ? m.total_yes_amount + addedStroops : m.total_yes_amount,
            total_no_amount: outcome === 'NO' ? m.total_no_amount + addedStroops : m.total_no_amount,
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-md shadow-sky-500/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">POLAI</span>
              <span className="ml-2 rounded-md border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-mono text-sky-400">
                Stellar Soroban
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {walletAddress ? (
              <div className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-300">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </span>
                <span className="text-slate-500">|</span>
                <span className="font-mono text-sky-400">250.00 USDC</span>
              </div>
            ) : (
              <button
                onClick={() => setIsWalletOpen(true)}
                className="flex items-center space-x-2 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20"
              >
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-transparent py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Predict the future on <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">Stellar</span>
            </h1>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Decentralized, non-custodial binary prediction markets powered by Soroban smart contracts.
              Sub-second finality, micro-penny transaction fees, and transparent payouts.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl flex-1 px-4 py-8 sm:px-6 w-full">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-slate-950 font-semibold shadow-md shadow-sky-500/20'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search markets or topics..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onSelect={handleOpenTrade}
            />
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-sm">
            No prediction markets found matching your filters.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Polai. Open-source prediction market protocol for Stellar Wave.</p>
      </footer>

      {/* Modals */}
      <TradeModal
        market={selectedMarket}
        isOpen={isTradeOpen}
        onClose={() => setIsTradeOpen(false)}
        walletAddress={walletAddress}
        onTradeSuccess={handleTradeSuccess}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onConnect={(addr) => setWalletAddress(addr)}
      />
    </div>
  );
}
