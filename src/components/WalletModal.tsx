'use client';

import React, { useState } from 'react';
import { Wallet, AlertCircle, ExternalLink } from 'lucide-react';
import { connectFreighter, connectAlbedo } from '@/lib/stellar-wallet';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [installUrl, setInstallUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (walletId: string, walletName: string) => {
    setLoadingWallet(walletName);
    setErrorMessage(null);
    setInstallUrl(null);

    try {
      if (walletId === 'freighter') {
        const connection = await connectFreighter();
        onConnect(connection.address);
        onClose();
      } else if (walletId === 'albedo') {
        const connection = await connectAlbedo();
        onConnect(connection.address);
        onClose();
      } else if (walletId === 'xbull') {
        // xBull injected window.xBullSDK check
        const xbull = (window as unknown as { xBullSDK?: { connect: () => Promise<string> } }).xBullSDK;
        if (!xbull) {
          setInstallUrl('https://xbull.app/');
          throw new Error('xBull extension not detected. Click below to install xBull.');
        }
        const pubkey = await xbull.connect();
        onConnect(pubkey);
        onClose();
      } else {
        throw new Error('Wallet integration coming soon.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setErrorMessage(msg);
      if (msg.includes('freighter.app')) {
        setInstallUrl('https://www.freighter.app/');
      }
    } finally {
      setLoadingWallet(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-md border border-[#262626] bg-[#0d0d0d] p-6 text-white shadow-2xl"
        style={{ borderRadius: '2px' }}
      >
        <div className="nv-corner-square" />

        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-[#76b900]" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">
              Stellar Wallet Gateway
            </h3>
          </div>
          <button onClick={onClose} className="text-[#757575] hover:text-white text-sm">
            ✕
          </button>
        </div>

        {errorMessage && (
          <div
            className="mt-4 border border-[#e52020]/40 bg-[#e52020]/10 p-3 text-xs text-[#e52020]"
            style={{ borderRadius: '2px' }}
          >
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>
                <p>{errorMessage}</p>
                {installUrl && (
                  <a
                    href={installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center space-x-1 text-[#76b900] underline font-bold"
                  >
                    <span>Download / Install Extension</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="mt-3 text-xs text-[#a7a7a7] leading-relaxed">
          Connect your actual Stellar browser extension or hardware wallet to authenticate and sign Soroban smart contract transactions on Testnet / Mainnet.
        </p>

        <div className="mt-5 space-y-2">
          {[
            { id: 'freighter', name: 'Freighter Wallet', desc: 'Official Stellar Development Foundation browser signer' },
            { id: 'albedo', name: 'Albedo', desc: 'Zero-install web popup signer with hardware support' },
            { id: 'xbull', name: 'xBull Wallet', desc: 'Secure desktop & mobile browser extension' },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => handleConnect(w.id, w.name)}
              disabled={loadingWallet !== null}
              className="flex w-full items-center justify-between border border-[#262626] bg-black p-3.5 text-left transition-colors hover:border-[#76b900] disabled:opacity-50"
              style={{ borderRadius: '2px' }}
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  {w.name}
                </div>
                <div className="text-[11px] text-[#757575] mt-0.5">{w.desc}</div>
              </div>
              {loadingWallet === w.name ? (
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
