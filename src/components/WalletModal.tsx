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
      const mockAddr = 'GBJ66K3G44YF5YF5Z2KFXOYYPQQ4NGB5K7D2HQZ4DLY3O5ZJRPWZPO3V';
      onConnect(mockAddr);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md border border-[#262626] bg-[#0d0d0d] p-6 text-white shadow-2xl" style={{ borderRadius: '2px' }}>
        {/* NVIDIA Corner Square */}
        <div className="nv-corner-square" />

        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-[#76b900]" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">Stellar Wallet Gateway</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#757575] hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        <p className="mt-3 text-xs text-[#a7a7a7] leading-relaxed">
          Select an authorized Stellar hardware, browser, or vault wallet interface to sign Soroban smart contract transactions.
        </p>

        <div className="mt-5 space-y-2">
          {[
            { id: 'freighter', name: 'Freighter Wallet', desc: 'Hardware & Browser extension signer' },
            { id: 'lobstr', name: 'Lobstr Vault', desc: 'Enterprise multi-sig & mobile signer' },
            { id: 'xbull', name: 'xBull Wallet', desc: 'Secure desktop & web gateway' },
            { id: 'albedo', name: 'Albedo', desc: 'Web-based zero-install signer' },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => handleSelect(w.name)}
              className="flex w-full items-center justify-between border border-[#262626] bg-black p-3.5 text-left transition-colors hover:border-[#76b900]"
              style={{ borderRadius: '2px' }}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">{w.name}</div>
                <div className="text-[11px] text-[#757575] mt-0.5">{w.desc}</div>
              </div>
              {selectedWallet === w.name ? (
                <div className="h-3.5 w-3.5 animate-spin border-2 border-[#76b900] border-t-transparent" />
              ) : (
                <span className="font-mono text-xs text-[#76b900]">CONNECT →</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
