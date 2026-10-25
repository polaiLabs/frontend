'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Market, INITIAL_MARKETS } from '@/lib/types';
import { MarketCard } from '@/components/MarketCard';
import { TradeModal } from '@/components/TradeModal';
import { WalletModal } from '@/components/WalletModal';
import { fetchStellarBalances, StellarBalance } from '@/lib/stellar-balance';
import {
  Wallet,
  Zap,
  Search,
  LogOut,
  RefreshCw,
} from 'lucide-react';

const WALLET_STORAGE_KEY = 'polai_connected_wallet';

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [isTradeOpen, setIsTradeOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<StellarBalance[]>([]);
  const [loadingBalances, setLoadingBalances] = useState<boolean>(false);

  const categories = ['All', 'Crypto', 'AI/Tech', 'Gaming', 'Governance'];

  // Balance fetching logic
  const loadBalances = useCallback(async (address: string) => {
    setLoadingBalances(true);
    try {
      const bList = await fetchStellarBalances(address);
      setBalances(bList);
    } finally {
      setLoadingBalances(false);
    }
  }, []);

  // Restore wallet connection on client mount
  useEffect(() => {
    let active = true;
    try {
      const saved = localStorage.getItem(WALLET_STORAGE_KEY);
      if (saved && active) {
        // Asynchronous restore prevents synchronous cascading renders in React 19
        queueMicrotask(() => {
          if (active) {
            setWalletAddress(saved);
            loadBalances(saved);
          }
        });
      }
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
    return () => {
      active = false;
    };
  }, [loadBalances]);

  // Handle wallet connected
  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    try {
      localStorage.setItem(WALLET_STORAGE_KEY, address);
    } catch (e) {
      console.warn('Failed to persist wallet', e);
    }
    loadBalances(address);
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    setWalletAddress(null);
    setBalances([]);
    try {
      localStorage.removeItem(WALLET_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear wallet', e);
    }
  };

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
    if (walletAddress) {
      loadBalances(walletAddress);
    }
  };

  // Preferred displayed balance: USDC if user holds USDC, otherwise native XLM
  const primaryBalance = balances.find((b) => b.asset === 'USDC') || balances[0] || { asset: 'XLM', balance: '0.00' };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* NVIDIA Style Global Header */}
      <header className="sticky top-0 z-40 border-b border-[#262626] bg-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-7 w-7 items-center justify-center bg-[#76b900] text-black">
              <Zap className="h-4 w-4 fill-black text-black" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-extrabold tracking-wider uppercase text-white">POLAI</span>
              <span className="text-[10px] font-mono tracking-widest text-[#76b900]">/ PREDICTION ENGINE</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {walletAddress ? (
              <div className="flex items-center space-x-2 border border-[#262626] bg-[#0d0d0d] px-3.5 py-1.5 font-mono text-xs" style={{ borderRadius: '2px' }}>
                <span className="h-1.5 w-1.5 bg-[#76b900] animate-pulse" />
                <span className="text-[#a7a7a7]">
                  {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </span>
                <span className="text-[#333333]">|</span>
                <span className="text-white font-bold flex items-center space-x-1">
                  <span>{primaryBalance.balance} {primaryBalance.asset}</span>
                  {loadingBalances && (
                    <RefreshCw className="h-2.5 w-2.5 animate-spin text-[#76b900]" />
                  )}
                </span>
                <button
                  onClick={handleDisconnect}
                  title="Disconnect wallet"
                  className="ml-2 text-[#757575] hover:text-[#e52020] transition-colors"
                >
                  <LogOut className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsWalletOpen(true)}
                className="nv-btn-primary flex items-center space-x-2 px-4 py-2 text-xs tracking-wider uppercase"
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* NVIDIA Dark Hero Chapter */}
      <section className="relative border-b border-[#262626] bg-[#050505] py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-[#76b900]">
              <span>STELLAR SOROBAN PROTOCOL</span>
              <span>•</span>
              <span>HIGH-THROUGHPUT EXECUTION</span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl text-white uppercase">
              Decentralized <span className="text-[#76b900]">Intelligence</span> & Probability Markets
            </h1>
            <p className="mt-4 text-sm text-[#898989] leading-relaxed max-w-2xl">
              Engineering-grade binary prediction markets settled by Soroban smart contracts on the Stellar ledger.
              Real-time odds calculation, deterministic escrow pools, and sub-second transaction finality.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl flex-1 px-6 py-10 w-full">
        {/* Section Headline & Category Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#1a1a1a]">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-black'
                    : 'bg-transparent text-[#898989] hover:text-white'
                }`}
                style={{ borderRadius: '2px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5e5e5e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter markets by keyword..."
              className="w-full border border-[#262626] bg-[#0d0d0d] py-2 pl-9 pr-3 text-xs text-white placeholder-[#5e5e5e] focus:border-[#76b900] focus:outline-none font-mono"
              style={{ borderRadius: '2px' }}
            />
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredMarkets.map((market) => (
            <MarketCard
              key={market.id}
              market={market}
              onSelect={handleOpenTrade}
            />
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-20 text-[#5e5e5e] text-xs font-mono uppercase tracking-widest">
            No active prediction streams found for the current query.
          </div>
        )}
      </main>

      {/* NVIDIA Dark Multi-Column Global Footer */}
      <footer className="border-t border-[#262626] bg-[#000000] py-12 text-xs text-[#757575]">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-[#1a1a1a]">
          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3">Protocol</div>
            <ul className="space-y-2 text-[#898989]">
              <li><a href="#" className="hover:text-white">Smart Contracts</a></li>
              <li><a href="#" className="hover:text-white">Soroban RPC</a></li>
              <li><a href="#" className="hover:text-white">Parimutuel Pools</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3">Ecosystem</div>
            <ul className="space-y-2 text-[#898989]">
              <li><a href="https://stellar.org" className="hover:text-white">Stellar Network</a></li>
              <li><a href="https://drips.network/wave" className="hover:text-white">Drips Wave Program</a></li>
              <li><a href="#" className="hover:text-white">Open Source Grants</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3">Developers</div>
            <ul className="space-y-2 text-[#898989]">
              <li><a href="https://github.com/polaiLabs" className="hover:text-white">GitHub Repositories</a></li>
              <li><a href="#" className="hover:text-white">API Specifications</a></li>
              <li><a href="#" className="hover:text-white">Bug Bounty</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold text-white uppercase tracking-wider mb-3">Architecture</div>
            <p className="text-[11px] leading-relaxed text-[#757575]">
              Engineered according to the NVIDIA Design System. Built with 2px precision radius, high-contrast monospace typography, and live on-chain balances.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5e5e5e] font-mono">
          <div>© 2026 POLAI LABS. ALL RIGHTS RESERVED.</div>
          <div className="mt-2 sm:mt-0">OPEN SOURCE MIT LICENSE • STELLAR DEVELOPMENT FOUNDATION</div>
        </div>
      </footer>

      {/* Modals */}
      <TradeModal
        market={selectedMarket}
        isOpen={isTradeOpen}
        onClose={() => setIsTradeOpen(false)}
        walletAddress={walletAddress}
        userBalance={primaryBalance}
        onTradeSuccess={handleTradeSuccess}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}
