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

  // Keep the legacy localStorage keys (buyerId / vendorId / name / email) in
  // sync with the authoritative cookie-based session. This is what the
  // dashboards and the marketplace order flow read, so logging in must
  // populate them — otherwise a logged-in buyer is treated as a guest.
  const clearLocalStorage = () => {
    ['buyerId', 'buyerEmail', 'buyerName', 'vendorId', 'vendorEmail', 'vendorBusinessName'].forEach((key) =>
      localStorage.removeItem(key)
    );
  };

  const syncLocalStorage = (s: MarketplaceSession | null) => {
    clearLocalStorage();
    if (!s) return;
    if (s.role === 'buyer') {
      localStorage.setItem('buyerId', s.id);
      if (s.email) localStorage.setItem('buyerEmail', s.email);
      if (s.name) localStorage.setItem('buyerName', s.name);
    } else if (s.role === 'vendor') {
      localStorage.setItem('vendorId', s.id);
      if (s.email) localStorage.setItem('vendorEmail', s.email);
      if (s.name) localStorage.setItem('vendorBusinessName', s.name);
    }
  };

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'marketplace-session' }),
      });
      const result = await response.json();
      const nextSession = result.success ? ((result.session as MarketplaceSession | null) ?? null) : null;
      setSession(nextSession);
      syncLocalStorage(nextSession);
      return nextSession;
    } catch {
      setSession(null);
      syncLocalStorage(null);
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
      clearLocalStorage();
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
