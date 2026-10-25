'use client';

import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelect = (walletName: string) => {
    setSelectedWallet(walletName);
    setTimeout(() => {
      // Simulate connected Freighter testnet address
      const mockAddr = 'GBJ66K3G44YF5YF5Z2KFXOYYPQQ4NGB5K7D2HQZ4DLY3O5ZJRPWZPO3V';
      onConnect(mockAddr);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-sky-400" />
            <h3 className="text-lg font-semibold text-slate-100">Connect Stellar Wallet</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-400">
          Connect your favorite Stellar wallet to place decentralized predictions on Polai.
        </p>

        <div className="mt-6 space-y-3">
          {[
            { id: 'freighter', name: 'Freighter Wallet', desc: 'Recommended Stellar browser extension' },
            { id: 'lobstr', name: 'Lobstr Vault', desc: 'Mobile & desktop signer' },
            { id: 'xbull', name: 'xBull Wallet', desc: 'Multi-platform secure Stellar wallet' },
            { id: 'albedo', name: 'Albedo', desc: 'Web-based keyless signer' },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => handleSelect(w.name)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-left transition-all hover:border-sky-500/50 hover:bg-slate-800/50"
            >
              <div>
                <div className="font-medium text-slate-200">{w.name}</div>
                <div className="text-xs text-slate-500">{w.desc}</div>
              </div>
              {selectedWallet === w.name ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
              ) : (
                <span className="text-xs font-mono text-sky-400">Connect →</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
