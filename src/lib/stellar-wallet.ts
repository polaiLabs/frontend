import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from '@stellar/freighter-api';

export interface WalletConnection {
  address: string;
  network?: string;
  walletName: string;
}

export async function connectFreighter(): Promise<WalletConnection> {
  if (typeof window === 'undefined') {
    throw new Error('Wallet connection is only available in the browser.');
  }

  const connectedResult = await isConnected();
  if (connectedResult.error || !connectedResult.isConnected) {
    throw new Error(
      'Freighter wallet extension was not detected. Please install Freighter from https://www.freighter.app/'
    );
  }

  const accessResult = await requestAccess();
  if (accessResult.error) {
    throw new Error(accessResult.error || 'Access request rejected by user in Freighter.');
  }

  const addressResult = await getAddress();
  if (addressResult.error || !addressResult.address) {
    throw new Error(addressResult.error || 'Failed to retrieve public address from Freighter.');
  }

  const networkResult = await getNetwork();

  return {
    address: addressResult.address,
    network: networkResult.network,
    walletName: 'Freighter',
  };
}

export async function connectAlbedo(): Promise<WalletConnection> {
  if (typeof window === 'undefined') {
    throw new Error('Albedo is only available in the browser.');
  }

  // Albedo web-intent authentication
  // https://albedo.link/
  const albedoModule = await import('@albedo-link/intent').catch(() => null);
  if (!albedoModule) {
    // Direct URL intent fallback
    const width = 450;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    return new Promise((resolve, reject) => {
      const intentUrl = 'https://albedo.link/intent/public_key';
      const popup = window.open(
        intentUrl,
        'albedo_login',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      const messageListener = (event: MessageEvent) => {
        if (event.origin !== 'https://albedo.link') return;
        window.removeEventListener('message', messageListener);
        if (event.data?.pubkey) {
          resolve({
            address: event.data.pubkey,
            walletName: 'Albedo',
          });
        } else {
          reject(new Error(event.data?.error || 'Albedo signature canceled.'));
        }
      };

      window.addEventListener('message', messageListener);

      const timer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(timer);
          window.removeEventListener('message', messageListener);
          reject(new Error('Albedo login window closed by user.'));
        }
      }, 500);
    });
  }

  const albedo = (albedoModule as { default?: { publicKey: (opts: Record<string, unknown>) => Promise<{ pubkey: string }> }; publicKey?: (opts: Record<string, unknown>) => Promise<{ pubkey: string }> });
  const fn = albedo.default?.publicKey || albedo.publicKey;
  if (!fn) {
    throw new Error('Albedo client failed to initialize');
  }
  const res = await fn({});
  return {
    address: res.pubkey,
    network: 'testnet',
    walletName: 'Albedo',
  };
}

export { signTransaction };
