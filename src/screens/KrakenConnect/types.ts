export type KrakenConnectNavigationParams = {
  code?: string | null;
  state?: string | null;
  connectionError?: string | null;
  selectedAccountNumber?: number;
};

export type KarkenConnectScreenType = 'landing' | 'connected' | 'loading' | 'error';
