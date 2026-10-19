import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, X, Loader2, AlertCircle } from 'lucide-react';
import { ClerkProvider, useClerk, useSignIn } from '@clerk/clerk-react';
import ImageSlot from '../../components/figma/ImageSlot';
import { GoogleMark } from '../../components/figma/BrandMarks';
import { img } from './images';
import { buyerLogin } from '../../services/buyerService';
import { vendorLogin } from '../../services/vendorService';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import {
  CLERK_PUBLISHABLE_KEY,
  clerkEnabled,
  clerkSessionToken,
  describeClerkError,
  exchangeClerkSession,
} from '../../lib/clerk';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Height-fluid: at 919px tall every `clamp()` below sits at the Figma value, so
 * the page is the design; on a shorter window the rhythm compresses instead of
 * pushing a scrollbar. Apple sign-in was removed by request — Google only.
 */
const inputClass = (invalid: boolean) =>
  `h-[60px] w-full rounded-[8px] border bg-white pl-[52px] pr-4 font-lora text-[15px] text-black outline-none transition-colors placeholder:text-[#505050] lg:h-[clamp(46px,6.6vh,60px)] ${
    invalid ? 'border-[#D92D20] focus:border-[#D92D20]' : 'border-[#DCDCDC] focus:border-[#17AD10]'
  }`;

/**
 * Desktop 20 — "Welcome Back" login. Split layout: photo panel on the left,
 * credentials on the right. No navbar in the design.
 *
 * Two backends, one design:
 *   • Clerk configured (`VITE_CLERK_PUBLISHABLE_KEY`) → Clerk verifies the
 *     password / Google account, then the JWT is traded for the marketplace
 *     cookie via `/api/auth`.
 *   • No key → the original `/api/auth` password flow, unchanged.
 *
 * Either way the user ends up with the same signed cookie, so the dashboards
 * and every `/api/marketplace` call are untouched.
 */
export default function FigmaLogin() {
  if (!clerkEnabled) return <PasswordLogin />;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/cococonnect">
      <ClerkLogin />
    </ClerkProvider>
  );
}

/* ── Shared view ─────────────────────────────────────────────────────────── */

type LoginScreenProps = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  remember: boolean;
  setRemember: (value: boolean) => void;
  isLoading: boolean;
  googleLoading: boolean;
  error: string;
  submitAttempted: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onGoogle: () => void;
};

function LoginScreen({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  remember,
  setRemember,
  isLoading,
  googleLoading,
  error,
  submitAttempted,
  onSubmit,
  onGoogle,
}: LoginScreenProps) {
  const emailRef = useRef<HTMLInputElement>(null);

  // Prefill the last email this device signed in with, then focus the field.
  useEffect(() => {
    const remembered = localStorage.getItem('buyerEmailRemember');
    if (remembered) setEmail(remembered);
    const timer = setTimeout(() => emailRef.current?.focus(), 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= 6;
  const hasPanelImage = Boolean(img('login-panel'));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white lg:flex-row">
      {/* ── Left photo panel ───────────────────────────────────────────── */}
      <div className="relative min-h-[320px] w-full shrink-0 lg:min-h-0 lg:w-[612px]">
        <ImageSlot
          slot="login-panel"
          label="Palm trees and coconuts photo"
          hint="612 × 899"
          labelPosition="corner"
          className="absolute inset-0 h-full w-full"
          overlay={hasPanelImage ? undefined : 'bg-black/40'}
        />
        {!hasPanelImage && (
          <div className="relative flex h-full flex-col justify-center px-8 py-16 lg:px-[67px]">
            <h2 className="max-w-[290px] font-lora text-[34px] font-bold leading-[1.25] text-white lg:text-[46px]">
              Good People. Greater Tomorrows.
            </h2>
            <span className="mt-7 block h-[4px] w-[58px] bg-[#17AD10]" aria-hidden="true" />
            <p className="mt-7 max-w-[240px] font-lora text-[17px] leading-[1.6] text-white lg:text-[20px]">
              Join a growing community building a more sustainable coconut industry.
            </p>
          </div>
        )}
      </div>

      {/* ── Right form panel ───────────────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-16 sm:px-10 lg:py-[clamp(16px,5vh,64px)]">
        <Link
          to="/cococonnect"
          aria-label="Close"
          className="absolute right-8 top-6 text-[#101010] transition-opacity hover:opacity-60"
        >
          <X className="h-[26px] w-[26px]" strokeWidth={1.6} />
        </Link>

        <div className="w-full max-w-[620px]">
          <h1 className="font-montserrat text-[32px] font-semibold text-black sm:text-[40px]">
            Welcome Back
          </h1>
          <p className="mt-4 font-lora text-[20px] text-black sm:text-[24px] lg:mt-[clamp(8px,1.8vh,16px)]">
            Log in to your Coconoto account
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 flex items-start gap-3 rounded-[8px] border border-[#F3B5B5] bg-[#FEF3F2] px-4 py-3 lg:mt-[clamp(10px,2.6vh,24px)]"
            >
              <AlertCircle
                className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#B42318]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="font-lora text-[15px] leading-[1.4] text-[#B42318]">{error}</span>
            </div>
          )}

          <form
            className={error ? 'mt-6 lg:mt-[clamp(10px,2.6vh,24px)]' : 'mt-9 lg:mt-[clamp(14px,4vh,36px)]'}
            onSubmit={onSubmit}
            noValidate
          >
            {/* Email */}
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-[19px] w-[19px] -translate-y-1/2 text-[#505050]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <input
                ref={emailRef}
                type="email"
                name="email"
                id="buyer-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                aria-label="Email address"
                autoComplete="email"
                aria-invalid={submitAttempted && !emailValid ? 'true' : 'false'}
                className={inputClass(submitAttempted && !emailValid)}
              />
            </div>

            {/* Password */}
            <div className="relative mt-6 lg:mt-[clamp(10px,2.6vh,24px)]">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[19px] w-[19px] -translate-y-1/2 text-[#505050]"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="buyer-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
                aria-invalid={submitAttempted && !passwordValid ? 'true' : 'false'}
                className={`${inputClass(submitAttempted && !passwordValid)} pr-12`}
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505050] hover:text-black"
              >
                {showPassword ? (
                  <EyeOff className="h-[19px] w-[19px]" strokeWidth={1.6} />
                ) : (
                  <Eye className="h-[19px] w-[19px]" strokeWidth={1.6} />
                )}
              </button>
            </div>

            {/* Remember / forgot */}
            <div className="mt-5 flex items-center justify-between gap-4 lg:mt-[clamp(10px,2.2vh,20px)]">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-[18px] w-[18px] rounded-[4px] border border-[#C4C4C4] accent-[#1AC212]"
                />
                <span className="font-lora text-[16px] text-black">Remember me</span>
              </label>
              <Link to="/buyer-login?forgot=1" className="font-lora text-[16px] text-[#17AD10] hover:underline">
                Forget password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 inline-flex h-[60px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#1AC212] font-lora text-[16px] font-medium text-white transition-colors hover:bg-[#17ad10] disabled:cursor-not-allowed disabled:opacity-60 lg:mt-[clamp(14px,3.5vh,32px)] lg:h-[clamp(46px,6.6vh,60px)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-[19px] w-[19px] animate-spin" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4 lg:my-[clamp(12px,3.5vh,32px)]">
            <span className="h-px flex-1 bg-[#DCDCDC]" />
            <span className="font-lora text-[16px] text-black">Or continue with</span>
            <span className="h-px flex-1 bg-[#DCDCDC]" />
          </div>

          <button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading || isLoading}
            className="flex h-[60px] w-full items-center justify-center gap-4 rounded-[8px] border border-[#DCDCDC] bg-white font-lora text-[16px] font-medium text-black transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60 lg:h-[clamp(46px,6.6vh,60px)]"
          >
            {googleLoading ? (
              <Loader2 className="h-[19px] w-[19px] animate-spin" aria-hidden="true" />
            ) : (
              <GoogleMark />
            )}
            Continue with Google
          </button>

          <p className="mt-9 text-center font-lora text-[16px] text-black lg:mt-[clamp(12px,3.9vh,36px)]">
            Don&rsquo;t have an account?{' '}
            <Link to="/buyer-signup" className="text-[#17AD10] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Clerk-backed sign-in ────────────────────────────────────────────────── */

function ClerkLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, refreshSession } = useMarketplaceAuth();
  const { isLoaded, signIn, setActive } = useSignIn();
  const clerk = useClerk();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const returnTo = searchParams.get('returnTo');
  const exitTo = returnTo?.startsWith('/') ? returnTo : '/cococonnect';

  const completeSignIn = async () => {
    const token = await clerkSessionToken(clerk);
    if (!token) {
      setError('Your session could not be read. Please try again.');
      return;
    }

    const result = await exchangeClerkSession({ token });
    if (!result.success || !result.buyer) {
      setError(result.error || 'Could not start your session.');
      return;
    }

    if (remember) {
      localStorage.setItem('buyerEmailRemember', result.buyer.email);
    } else {
      localStorage.removeItem('buyerEmailRemember');
    }

    login({
      id: result.buyer.id,
      role: 'buyer',
      email: result.buyer.email,
      name: `${result.buyer.first_name} ${result.buyer.last_name}`.trim(),
    });

    await refreshSession();
    navigate(exitTo);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setError('');

    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const attempt = await signIn.create({ identifier: email.trim(), password });

      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        // MFA / new-device verification is enabled on the instance but has no
        // screen in this design yet.
        setError('This account needs extra verification. Please contact support.');
        return;
      }

      await setActive({ session: attempt.createdSessionId });
      await completeSignIn();
    } catch (clerkError) {
      // Unified login: a seller who never signed up with Clerk still has a
      // password on the legacy `vendors` table.
      const vendorResult = await vendorLogin({ email: email.trim(), password });
      if (vendorResult.success && vendorResult.vendor) {
        if (remember) {
          localStorage.setItem('buyerEmailRemember', vendorResult.vendor.email);
        } else {
          localStorage.removeItem('buyerEmailRemember');
        }
        login({
          id: vendorResult.vendor.id,
          role: 'vendor',
          email: vendorResult.vendor.email,
          name: vendorResult.vendor.business_name,
          isSeller: true,
          vendorId: vendorResult.vendor.id,
        });
        await refreshSession();
        navigate(exitTo);
        return;
      }

      setError(describeClerkError(clerkError));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    setError('');
    setGoogleLoading(true);

    try {
      // Full-page redirect (not a popup): works with blockers and does not
      // depend on the tab keeping state. /sso-callback finishes the handshake
      // and /auth-complete trades the session for the marketplace cookie.
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: `/auth-complete?returnTo=${encodeURIComponent(exitTo)}`,
      });
    } catch (clerkError) {
      setError(describeClerkError(clerkError));
      setGoogleLoading(false);
    }
  };

  return (
    <LoginScreen
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      toggleShowPassword={() => setShowPassword((v) => !v)}
      remember={remember}
      setRemember={setRemember}
      isLoading={isLoading}
      googleLoading={googleLoading}
      error={error}
      submitAttempted={submitAttempted}
      onSubmit={handleSubmit}
      onGoogle={handleGoogle}
    />
  );
}

/* ── Legacy password sign-in (no Clerk key configured) ───────────────────── */

function PasswordLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, refreshSession } = useMarketplaceAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const returnTo = searchParams.get('returnTo');
  const exitTo = returnTo?.startsWith('/') ? returnTo : '/cococonnect';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setError('');

    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const credentials = { email: email.trim(), password };

    const result = await buyerLogin(credentials);

    if (result.success && result.buyer) {
      if (remember) {
        localStorage.setItem('buyerEmailRemember', result.buyer.email);
      } else {
        localStorage.removeItem('buyerEmailRemember');
      }
      login({
        id: result.buyer.id,
        role: 'buyer',
        email: result.buyer.email,
        name: `${result.buyer.first_name} ${result.buyer.last_name}`.trim(),
      });
    } else {
      // Unified login: a registered seller can use the same form and lands on
      // the marketplace too, flagged as a seller.
      const vendorResult = await vendorLogin(credentials);
      if (vendorResult.success && vendorResult.vendor) {
        if (remember) {
          localStorage.setItem('buyerEmailRemember', vendorResult.vendor.email);
        } else {
          localStorage.removeItem('buyerEmailRemember');
        }
        login({
          id: vendorResult.vendor.id,
          role: 'vendor',
          email: vendorResult.vendor.email,
          name: vendorResult.vendor.business_name,
          isSeller: true,
          vendorId: vendorResult.vendor.id,
        });
      } else {
        setError(result.error || vendorResult.error || 'Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }
    }

    // Sync the seller flag (if any) from the authoritative session cookie, then
    // land on the marketplace.
    await refreshSession();
    navigate(exitTo);
    setIsLoading(false);
  };

  return (
    <LoginScreen
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      showPassword={showPassword}
      toggleShowPassword={() => setShowPassword((v) => !v)}
      remember={remember}
      setRemember={setRemember}
      isLoading={isLoading}
      googleLoading={false}
      error={error}
      submitAttempted={submitAttempted}
      onSubmit={handleSubmit}
      // Google needs Clerk. Without a key the button stays inert, as before.
      onGoogle={() => setError('Google sign-in is not available yet. Use your email and password.')}
    />
  );
}
