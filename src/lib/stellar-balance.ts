export interface StellarBalance {
  asset: string;
  balance: string;
}

export async function fetchStellarBalances(address: string, isTestnet = true): Promise<StellarBalance[]> {
  const horizonUrl = isTestnet
    ? 'https://horizon-testnet.stellar.org'
    : 'https://horizon.stellar.org';

  try {
    const res = await fetch(`${horizonUrl}/accounts/${address}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      if (res.status === 404) {
        // Unfunded account on testnet
        return [{ asset: 'XLM', balance: '0.00' }];
      }
      throw new Error(`Horizon error: ${res.statusText}`);
    }

    const data = await res.json();
    const balances: StellarBalance[] = (data.balances || []).map((b: { asset_type: string; asset_code?: string; balance: string }) => {
      const asset = b.asset_type === 'native' ? 'XLM' : (b.asset_code || 'TOKEN');
      return {
        asset,
        balance: parseFloat(b.balance).toFixed(2),
      };
    });

    return balances.length > 0 ? balances : [{ asset: 'XLM', balance: '0.00' }];
  } catch (err) {
    console.error('Failed to fetch Stellar balances:', err);
    return [{ asset: 'XLM', balance: '0.00' }];
  }
}
