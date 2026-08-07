import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type MarketplaceRole = 'buyer' | 'vendor';

export interface MarketplaceSession {
  id: string;
  role: MarketplaceRole;
  email: string;
  name: string;
}

interface MarketplaceAuthValue {
  session: MarketplaceSession | null;
  loading: boolean;
  refreshSession: () => Promise<MarketplaceSession | null>;
  logout: () => Promise<void>;
}

const MarketplaceAuthContext = createContext<MarketplaceAuthValue | null>(null);

export function MarketplaceAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<MarketplaceSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'marketplace-session' }),
      });
      const result = await response.json();
      const nextSession = result.success ? (result.session as MarketplaceSession | null) : null;
      setSession(nextSession);
      return nextSession;
    } catch {
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'marketplace-logout' }),
      });
    } finally {
      setSession(null);
      ['buyerId', 'buyerEmail', 'buyerName', 'vendorId', 'vendorEmail', 'vendorBusinessName'].forEach((key) => localStorage.removeItem(key));
    }
  }, []);

  const value = useMemo(() => ({ session, loading, refreshSession, logout }), [session, loading, refreshSession, logout]);
  return <MarketplaceAuthContext.Provider value={value}>{children}</MarketplaceAuthContext.Provider>;
}

export function useMarketplaceAuth() {
  const value = useContext(MarketplaceAuthContext);
  if (!value) throw new Error('useMarketplaceAuth must be used within MarketplaceAuthProvider');
  return value;
}
