/**
 * Clerk configuration for the CoCo-Connect marketplace.
 *
 * Clerk owns the *credential*; our own `buyers` table still owns the profile
 * and every downstream endpoint keeps reading the same signed cookie. The
 * bridge is `exchangeClerkSession` below: the browser hands the Clerk session
 * JWT to `/api/auth`, the server verifies it and mints the marketplace cookie.
 *
 * The integration is opt-in. With no `VITE_CLERK_PUBLISHABLE_KEY` the auth
 * screens fall back to the original email+password flow, so the site keeps
 * working until the keys exist.
 */
export const CLERK_PUBLISHABLE_KEY = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '').trim();

export const clerkEnabled = CLERK_PUBLISHABLE_KEY.startsWith('pk_');

export type ClerkExchangeResult = {
  success: boolean;
  error?: string;
  needsSignup?: boolean;
  buyer?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

/**
 * Trades a Clerk session JWT for the marketplace session cookie. `first_name` /
 * `last_name` are only sent on sign-up — that is what tells the server to create
 * the `buyers` row rather than just look one up.
 */
export async function exchangeClerkSession(input: {
  token: string;
  first_name?: string;
  last_name?: string;
}): Promise<ClerkExchangeResult> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action: 'clerk-session', ...input }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.success) {
      return {
        success: false,
        error: data?.error || 'Could not start your session. Please try again.',
        needsSignup: !!data?.needsSignup,
      };
    }

    return { success: true, buyer: data.buyer };
  } catch {
    return { success: false, error: 'Could not reach the server. Please try again.' };
  }
}

type TokenSource = { getToken: () => Promise<string | null> } | null | undefined;

/**
 * `setActive()` updates Clerk's client state asynchronously, so reading the
 * session straight after awaiting it can return null. Poll briefly instead of
 * guessing a delay.
 */
export async function clerkSessionToken(clerk: {
  session?: TokenSource;
  client?: { sessions?: TokenSource[] } | null;
}): Promise<string | null> {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const session = clerk.session ?? clerk.client?.sessions?.[0] ?? null;
    const token = await session?.getToken();
    if (token) return token;
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  return null;
}

/** Clerk error → something a buyer can act on. */
export function describeClerkError(error: unknown): string {
  const err = error as { errors?: Array<{ code?: string; message?: string }>; message?: string };
  const first = err?.errors?.[0];

  switch (first?.code) {
    case 'form_identifier_not_found':
    case 'form_password_incorrect':
      return 'Invalid email or password. Please try again.';
    case 'form_identifier_exists':
      return 'An account with this email already exists. Try logging in instead.';
    case 'form_password_length_too_short':
      return 'Password must be at least 8 characters.';
    case 'form_password_pwned':
      return 'That password has appeared in a data breach. Please choose another.';
    case 'form_code_incorrect':
      return 'That code did not work. Check your email and try again.';
    case 'verification_expired':
      return 'That code has expired. Send a new one.';
    default:
      return first?.message || err?.message || 'Something went wrong. Please try again.';
  }
}
