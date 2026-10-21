import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { markSignedOut, signOutOfClerk } from '../lib/clerk';

export type MarketplaceRole = 'buyer' | 'vendor';

export interface MarketplaceSession {
  id: string;
  role: MarketplaceRole;
  email: string;
  name: string;
  // Present when a buyer has also registered as a seller (single unified login).
  isSeller?: boolean;
  vendorId?: string;
}

interface MarketplaceAuthValue {
  session: MarketplaceSession | null;
  loading: boolean;
  refreshSession: () => Promise<MarketplaceSession | null>;
  login: (session: MarketplaceSession) => void;
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

  // Establish the SPA session directly from a successful login response. This
  // avoids a second cookie round-trip that can return null (proxy/cookie
  // delivery, SameSite, transient API error) and bounce the user back to login
  // even though auth actually succeeded. The cookie is still set server-side
  // for API calls, and refreshSession() re-hydrates from it on full reloads.
  const login = useCallback((s: MarketplaceSession) => {
    setSession(s);
    syncLocalStorage(s);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const logout = useCallback(async () => {
    /**
     * Order matters. Local state is torn down FIRST and Clerk is never awaited
     * on the critical path: clerk-js can be mid-load or its FAPI unreachable,
     * and a `signOut()` that never settles used to strand the caller — the
     * session never cleared, so the Log out button looked dead and the
     * `await logout(); navigate(...)` call sites never navigated.
     *
     * The `signedOut` flag is what actually guarantees the previous account
     * does not come back: /login honours it by dropping any surviving Clerk
     * session instead of bridging it in. So Clerk's own sign-out is best-effort
     * and can fail without affecting the outcome.
     */
    markSignedOut();
    setSession(null);
    clearLocalStorage();

    void signOutOfClerk();

    // Best-effort cookie teardown, bounded so a hung request cannot block the
    // redirect. If it fails the cookie simply expires on its own.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try {
      await fetch('/api/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'marketplace-logout' }),
        signal: controller.signal,
      });
    } catch {
      /* offline or timed out — local state is already cleared */
    } finally {
      clearTimeout(timer);
    }
  }, []);

  const value = useMemo(() => ({ session, loading, refreshSession, login, logout }), [session, loading, refreshSession, login, logout]);
  return <MarketplaceAuthContext.Provider value={value}>{children}</MarketplaceAuthContext.Provider>;
}

export function useMarketplaceAuth() {
  const value = useContext(MarketplaceAuthContext);
  if (!value) throw new Error('useMarketplaceAuth must be used within MarketplaceAuthProvider');
  return value;
}
