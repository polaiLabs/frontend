export interface Market {
  id: number;
  creator: string;
  resolver: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  total_yes_amount: number;
  total_no_amount: number;
  outcome: 'PENDING' | 'YES' | 'NO' | 'INVALID';
  created_at: string;
}

export interface UserPosition {
  id: string;
  market_id: number;
  user: string;
  outcome: 'YES' | 'NO';
  amount: number;
  tx_hash: string;
  claimed: boolean;
  created_at: string;
}

export const INITIAL_MARKETS: Market[] = [
  {
    id: 1,
    creator: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    resolver: 'GBJ66K3G44YF5YF5Z2KFXOYYPQQ4NGB5K7D2HQZ4DLY3O5ZJRPWZPO3V',
    title: 'Will Stellar Soroban reach 50M total contract transactions in Q4?',
    description: 'Resolves to YES if public ledger stats report 50,000,000+ contract invocations before Dec 31, 2026.',
    category: 'Crypto',
    deadline: '2026-11-15T00:00:00Z',
    total_yes_amount: 68000000000,
    total_no_amount: 32000000000,
    outcome: 'PENDING',
    created_at: '2026-10-20T10:00:00Z',
  },
  {
    id: 2,
    creator: 'GBJ66K3G44YF5YF5Z2KFXOYYPQQ4NGB5K7D2HQZ4DLY3O5ZJRPWZPO3V',
    resolver: 'GBJ66K3G44YF5YF5Z2KFXOYYPQQ4NGB5K7D2HQZ4DLY3O5ZJRPWZPO3V',
    title: 'Will OpenAI publicly release GPT-5 before end of 2026?',
    description: 'Resolves to YES upon public availability of OpenAI frontier model labeled GPT-5.',
    category: 'AI/Tech',
    deadline: '2026-12-31T23:59:59Z',
    total_yes_amount: 42000000000,
    total_no_amount: 58000000000,
    outcome: 'PENDING',
    created_at: '2026-10-22T14:30:00Z',
  },
  {
    id: 3,
    creator: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    resolver: 'GBJ66K3G44YF5YF5Z2KFXOYYPQQ4NGB5K7D2HQZ4DLY3O5ZJRPWZPO3V',
    title: 'Will Rockstar Games launch GTA VI on PC before 2027?',
    description: 'Resolves to YES if an official PC version is launched and playable before January 1, 2027.',
    category: 'Gaming',
    deadline: '2026-12-31T23:59:59Z',
    total_yes_amount: 78000000000,
    total_no_amount: 22000000000,
    outcome: 'PENDING',
    created_at: '2026-10-23T09:15:00Z',
  },
  {
    id: 4,
    creator: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN',
    resolver: 'GBJ66K3G44YF5YF5Z2KFXOYYPQQ4NGB5K7D2HQZ4DLY3O5ZJRPWZPO3V',
    title: 'Will Protocol 26 pass on Stellar Mainnet by December 2026?',
    description: 'Resolves to YES once validators officially vote and activate Protocol 26 on Stellar Mainnet.',
    category: 'Governance',
    deadline: '2026-12-15T18:00:00Z',
    total_yes_amount: 55000000000,
    total_no_amount: 45000000000,
    outcome: 'PENDING',
    created_at: '2026-10-24T11:00:00Z',
  },
];
