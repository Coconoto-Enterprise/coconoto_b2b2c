import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { AuthenticateWithRedirectCallback, ClerkProvider, useClerk } from '@clerk/clerk-react';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import { safeReturnTo } from '../../lib/safeReturnTo';
import {
  CLERK_PUBLISHABLE_KEY,
  clerkEnabled,
  clerkSessionToken,
  clearSignedOut,
  exchangeClerkSession,
} from '../../lib/clerk';

/**
 * Two half-pages that exist only to finish a Google round-trip.
 *
 *   /sso-callback   Clerk completes the OAuth handshake, then sends the browser
 *                   on to /auth-complete.
 *   /auth-complete  Clerk now has a live session, so we trade its JWT for the
 *                   marketplace cookie and land the buyer where they started.
 *
 * Splitting them keeps each one doing exactly one thing: the callback component
 * always redirects, so it can't also do the cookie exchange.
 */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6 text-center">
      {children}
    </div>
  );
}

export function SsoCallback() {
  if (!clerkEnabled) return <Navigate to="/buyer-login" replace />;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Shell>
        <Loader2 className="h-8 w-8 animate-spin text-[#1AC212]" aria-hidden="true" />
        <p className="mt-5 font-lora text-[17px] text-[#505050]">Finishing sign-in…</p>
        <AuthenticateWithRedirectCallback
          signInForceRedirectUrl="/auth-complete"
          signUpForceRedirectUrl="/auth-complete"
          signInFallbackRedirectUrl="/auth-complete"
          signUpFallbackRedirectUrl="/auth-complete"
        />
      </Shell>
    </ClerkProvider>
  );
}

function CompleteInner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clerk = useClerk();
  const { login, refreshSession } = useMarketplaceAuth();
  const [error, setError] = useState('');

  const returnTo = searchParams.get('returnTo');
  const exitTo = safeReturnTo(returnTo, '/cococonnect');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = await clerkSessionToken(clerk);
      if (cancelled) return;

      if (!token) {
        setError('We could not read your session. Please sign in again.');
        return;
      }

      const result = await exchangeClerkSession({ token });
      if (cancelled) return;

      if (!result.success || !result.buyer) {
        setError(result.error || 'We could not finish signing you in.');
        return;
      }

      login({
        id: result.buyer.id,
        role: 'buyer',
        email: result.buyer.email,
        name: `${result.buyer.first_name} ${result.buyer.last_name}`.trim(),
      });
      // The Google round-trip succeeded, so any earlier logout is spent.
      clearSignedOut();
      await refreshSession();
      if (!cancelled) navigate(exitTo, { replace: true });
    })();

    return () => {
      cancelled = true;
    };
    // Runs once: the Clerk session is already live when this page mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <Shell>
        <AlertCircle className="h-8 w-8 text-[#B42318]" aria-hidden="true" />
        <p className="mt-5 max-w-[420px] font-lora text-[17px] text-[#B42318]">{error}</p>
        <Link
          to="/buyer-login"
          className="mt-6 rounded-[8px] bg-[#1AC212] px-6 py-3 font-lora text-[16px] font-medium text-white hover:bg-[#17ad10]"
        >
          Back to sign in
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <Loader2 className="h-8 w-8 animate-spin text-[#1AC212]" aria-hidden="true" />
      <p className="mt-5 font-lora text-[17px] text-[#505050]">Setting up your account…</p>
    </Shell>
  );
}

export function AuthComplete() {
  if (!clerkEnabled) return <Navigate to="/buyer-login" replace />;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <CompleteInner />
    </ClerkProvider>
  );
}
