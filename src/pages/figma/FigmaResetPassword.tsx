import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  X,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { ClerkProvider, useClerk, useSignIn } from '@clerk/clerk-react';
import ImageSlot from '../../components/figma/ImageSlot';
import { img } from './images';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import {
  CLERK_PUBLISHABLE_KEY,
  clerkEnabled,
  clerkErrorCode,
  clerkSessionToken,
  describeClerkError,
  exchangeClerkSession,
} from '../../lib/clerk';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shown when clerk-js never finishes loading. Clerk's FAPI is a third-party
 * host, so a content blocker, a corporate proxy or a dropped connection is
 * enough to stall it — and a button that does nothing is worse than one that
 * explains itself.
 */
const NOT_READY =
  'We could not reach the sign-in service. Check your connection, turn off any content blocker for this site, then try again — or email support@coconoto.africa and we will reset it for you.';

/** Same metrics as FigmaLogin so the two screens read as one flow. */
const inputClass = (invalid: boolean) =>
  `h-[60px] w-full rounded-[8px] border bg-white pl-[52px] pr-4 font-lora text-[15px] text-black outline-none transition-colors placeholder:text-[#505050] lg:h-[clamp(46px,6.6vh,60px)] ${
    invalid ? 'border-[#D92D20] focus:border-[#D92D20]' : 'border-[#DCDCDC] focus:border-[#17AD10]'
  }`;

const iconClass =
  'pointer-events-none absolute left-4 top-1/2 h-[19px] w-[19px] -translate-y-1/2 text-[#505050]';

/**
 * Forgotten-password flow, headless against Clerk.
 *
 * Two steps, because Clerk's `reset_password_email_code` strategy is a
 * two-request state machine:
 *   1. `signIn.create` mails a code to the address.
 *   2. `attemptFirstFactor` swaps that code + a new password for a live session.
 *
 * The session is then bridged into the marketplace cookie exactly like a normal
 * sign-in, so the buyer lands on the marketplace already logged in — a reset
 * that dumps them back on a login form is a worse experience than no reset.
 *
 * Only Clerk accounts are covered. Vendors still keep bcrypt passwords on the
 * `vendors` table, so the "no account" message points them at support.
 */
export default function FigmaResetPassword() {
  if (!clerkEnabled) return <Unavailable />;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ResetInner />
    </ClerkProvider>
  );
}

/* ── Shell ───────────────────────────────────────────────────────────────── */

function Shell({ children }: { children: React.ReactNode }) {
  const hasPanelImage = Boolean(img('login-panel'));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white lg:flex-row">
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

      <div className="relative flex flex-1 items-center justify-center px-6 py-16 sm:px-10 lg:py-[clamp(16px,5vh,64px)]">
        <Link
          to="/buyer-login"
          aria-label="Close"
          className="absolute right-8 top-6 text-[#101010] transition-opacity hover:opacity-60"
        >
          <X className="h-[26px] w-[26px]" strokeWidth={1.6} />
        </Link>
        <div className="w-full max-w-[620px]">{children}</div>
      </div>
    </div>
  );
}

function Unavailable() {
  return (
    <Shell>
      <h1 className="pr-12 font-montserrat text-[32px] font-semibold leading-[1.22] text-black sm:text-[40px]">
        Reset Your Password
      </h1>
      <p className="mt-4 font-lora text-[20px] leading-[1.4] text-black sm:text-[24px]">
        Password reset is not available right now. Please contact{' '}
        <a href="mailto:support@coconoto.africa" className="text-[#17AD10] hover:underline">
          support@coconoto.africa
        </a>{' '}
        and we will help you back in.
      </p>
      <Link
        to="/buyer-login"
        className="mt-8 inline-flex items-center gap-2 font-lora text-[16px] text-[#17AD10] hover:underline"
      >
        <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        Back to sign in
      </Link>
    </Shell>
  );
}

/* ── Flow ────────────────────────────────────────────────────────────────── */

function ResetInner() {
  const navigate = useNavigate();
  const { isLoaded, signIn, setActive } = useSignIn();
  const clerk = useClerk();
  const { login, refreshSession } = useMarketplaceAuth();

  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);

  const emailValid = EMAIL_RE.test(email.trim());
  const codeValid = code.trim().length >= 4;
  const passwordValid = password.length >= 8;
  const confirmValid = confirmPassword === password;

  /**
   * Clerk has just given us a live session — trade it for the marketplace
   * cookie so the buyer is actually signed in, not just "reset".
   */
  const finishSignIn = async () => {
    const token = await clerkSessionToken(clerk);
    if (!token) {
      setPasswordChanged(true);
      setError('Your password has been changed. Please sign in with your new password.');
      return;
    }

    const result = await exchangeClerkSession({ token });
    if (!result.success || !result.buyer) {
      setPasswordChanged(true);
      setError(
        result.error || 'Your password has been changed. Please sign in with your new password.',
      );
      return;
    }

    localStorage.setItem('buyerEmailRemember', result.buyer.email);
    login({
      id: result.buyer.id,
      role: 'buyer',
      email: result.buyer.email,
      name: `${result.buyer.first_name} ${result.buyer.last_name}`.trim(),
    });

    await refreshSession();
    navigate('/cococonnect', { replace: true });
  };

  const handleSendCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setError('');

    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isLoaded) {
      setError(NOT_READY);
      return;
    }

    setIsLoading(true);

    const identifier = email.trim();

    try {
      try {
        await signIn.create({ strategy: 'reset_password_email_code', identifier });
      } catch (createError) {
        // A stale Clerk session blocks the new sign-in attempt. Clear it and
        // try once — the buyer asked for a reset, so that is the intent.
        if (clerkErrorCode(createError) !== 'session_exists') throw createError;
        await clerk.signOut();
        await signIn.create({ strategy: 'reset_password_email_code', identifier });
      }

      setStep('reset');
      setSubmitAttempted(false);
    } catch (clerkError) {
      setError(
        clerkErrorCode(clerkError) === 'form_identifier_not_found'
          ? 'We could not find a Coconoto account with that email. Check the spelling, or create an account. Selling on Coconoto? Email support@coconoto.africa to reset your seller password.'
          : describeClerkError(clerkError),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setError('');

    if (!codeValid) {
      setError('Enter the code from your email.');
      return;
    }
    if (!passwordValid) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!confirmValid) {
      setError('Passwords do not match.');
      return;
    }
    if (!isLoaded) {
      setError(NOT_READY);
      return;
    }

    setIsLoading(true);

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password,
      });

      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        setError('That code did not work. Check your email and try again.');
        return;
      }

      await setActive({ session: attempt.createdSessionId });
      await finishSignIn();
    } catch (clerkError) {
      setError(describeClerkError(clerkError));
    } finally {
      setIsLoading(false);
    }
  };

  const backToEmail = () => {
    setStep('email');
    setCode('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSubmitAttempted(false);
    setTimeout(() => emailRef.current?.focus(), 50);
  };

  return (
    <Shell>
      <h1 className="pr-12 font-montserrat text-[32px] font-semibold leading-[1.22] text-black sm:text-[40px] lg:text-[clamp(28px,2.78vw,40px)]">
        {step === 'email' ? 'Reset Your Password' : 'Check Your Email'}
      </h1>
      <p className="mt-4 font-lora text-[20px] leading-[1.4] text-black sm:text-[24px] lg:mt-[clamp(8px,1.8vh,16px)]">
        {step === 'email'
          ? 'Enter your email and we will send you a code'
          : `Enter the code we sent to ${email.trim()}`}
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

      {step === 'email' ? (
        <form
          className={error ? 'mt-6 lg:mt-[clamp(10px,2.6vh,24px)]' : 'mt-9 lg:mt-[clamp(14px,4vh,36px)]'}
          onSubmit={handleSendCode}
          noValidate
        >
          <div className="relative">
            <Mail className={iconClass} strokeWidth={1.6} aria-hidden="true" />
            <input
              ref={emailRef}
              type="email"
              name="email"
              id="reset-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              aria-label="Email address"
              autoComplete="email"
              autoFocus
              aria-invalid={submitAttempted && !emailValid ? 'true' : 'false'}
              className={inputClass(submitAttempted && !emailValid)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 inline-flex h-[60px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#1AC212] font-lora text-[16px] font-medium text-white transition-colors hover:bg-[#17ad10] disabled:cursor-not-allowed disabled:opacity-60 lg:mt-[clamp(14px,3.5vh,32px)] lg:h-[clamp(46px,6.6vh,60px)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-[19px] w-[19px] animate-spin" aria-hidden="true" />
                Sending code...
              </>
            ) : (
              'Send Code'
            )}
          </button>
        </form>
      ) : (
        <form
          className={error ? 'mt-6 lg:mt-[clamp(10px,2.6vh,24px)]' : 'mt-9 lg:mt-[clamp(14px,4vh,36px)]'}
          onSubmit={handleReset}
          noValidate
        >
          <div className="relative">
            <ShieldCheck className={iconClass} strokeWidth={1.6} aria-hidden="true" />
            <input
              type="text"
              name="code"
              id="reset-code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 8))}
              placeholder="Verification code"
              aria-label="Verification code"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              aria-invalid={submitAttempted && !codeValid ? 'true' : 'false'}
              className={inputClass(submitAttempted && !codeValid)}
            />
          </div>

          <div className="relative mt-6 lg:mt-[clamp(10px,2.6vh,24px)]">
            <Lock className={iconClass} strokeWidth={1.6} aria-hidden="true" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="new-password"
              id="reset-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              aria-label="New password"
              autoComplete="new-password"
              aria-invalid={submitAttempted && !passwordValid ? 'true' : 'false'}
              className={`${inputClass(submitAttempted && !passwordValid)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
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

          <div className="relative mt-6 lg:mt-[clamp(10px,2.6vh,24px)]">
            <Lock className={iconClass} strokeWidth={1.6} aria-hidden="true" />
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirm-password"
              id="reset-confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              aria-label="Confirm new password"
              autoComplete="new-password"
              aria-invalid={submitAttempted && !confirmValid ? 'true' : 'false'}
              className={`${inputClass(submitAttempted && !confirmValid)} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#505050] hover:text-black"
            >
              {showConfirm ? (
                <EyeOff className="h-[19px] w-[19px]" strokeWidth={1.6} />
              ) : (
                <Eye className="h-[19px] w-[19px]" strokeWidth={1.6} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 inline-flex h-[60px] w-full items-center justify-center gap-3 rounded-[8px] bg-[#1AC212] font-lora text-[16px] font-medium text-white transition-colors hover:bg-[#17ad10] disabled:cursor-not-allowed disabled:opacity-60 lg:mt-[clamp(14px,3.5vh,32px)] lg:h-[clamp(46px,6.6vh,60px)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-[19px] w-[19px] animate-spin" aria-hidden="true" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <button
            type="button"
            onClick={backToEmail}
            className="mt-5 w-full text-center font-lora text-[15px] text-[#17AD10] hover:underline"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-9 text-center font-lora text-[16px] text-black lg:mt-[clamp(12px,3.9vh,36px)]">
        {passwordChanged ? (
          <Link to="/buyer-login" className="text-[#17AD10] hover:underline">
            Sign in with your new password
          </Link>
        ) : (
          <>
            Remembered it?{' '}
            <Link to="/buyer-login" className="text-[#17AD10] hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </Shell>
  );
}
