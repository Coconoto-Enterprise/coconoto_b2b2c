import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { ClerkProvider, useClerk, useSignUp } from '@clerk/clerk-react';
import ImageSlot from '../../components/figma/ImageSlot';
import { GoogleMark } from '../../components/figma/BrandMarks';
import { img } from './images';
import { buyerSignup } from '../../services/buyerService';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import {
  CLERK_PUBLISHABLE_KEY,
  clerkEnabled,
  clerkErrorCode,
  clerkSessionToken,
  describeClerkError,
  exchangeClerkSession,
} from '../../lib/clerk';
import { safeReturnTo } from '../../lib/safeReturnTo';

/* ───────────────────────────────────────────────────────────────────────────
 *  "S 19" — Create Your Account.  Every number below is lifted straight from
 *  the Figma node tree (node 164:3060) so the page lands on the design.
 *
 *    frame         1440 × 919, white
 *    left panel    612 × 899  — a SINGLE image fill, edge-to-edge and full
 *                  height (no frame padding, same as the sign-in screen). The
 *                  headline, green rule and paragraph are BAKED INTO that
 *                  photo, so we only draw our own copy while the slot is empty.
 *    right column  618 wide, content runs y=50 → 869 and is vertically centred.
 *
 *    H1         y=50    Montserrat 600 40px / lh 48.76
 *    subtitle   y=119   Lora 400 24px / lh 30.72
 *    fields     y=185   4 × 65px, 18px apart, r=15, border #B5B5B5
 *    sign up    y=530   618 × 65, r=15, #1AC212
 *    divider    y=625   line 235 · gap 10 · label 128 · gap 10 · line 235
 *    google     y=674   618 × 65, r=15, border #B5B5B5
 *    footer     y=849   Lora 500 16px
 *
 *  HEIGHT: the frame has to fit the window — no scrolling. So the frame is
 *  `min-h-[100dvh]` and the vertical rhythm (field height, gaps, margins,
 *  padding) is expressed in `clamp(min, vh, design)` units. At 919px tall
 *  every clamp sits at its design value, so the page is the Figma frame; on a
 *  shorter laptop it compresses instead of overflowing. Below `lg` the layout
 *  stacks and scrolls normally, which is unavoidable on a phone.
 *
 *  Apple sign-in was removed by request — Google only.
 *
 *  Two backends, one design: with `VITE_CLERK_PUBLISHABLE_KEY` set, Clerk
 *  creates the account (password or Google) and the session JWT is traded for
 *  the marketplace cookie; without it, the original `/api/auth` signup runs.
 * ─────────────────────────────────────────────────────────────────────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD = 'h-[65px] lg:h-[clamp(44px,7vh,65px)] w-full rounded-[15px] border bg-white';
const FIELD_INPUT = `${FIELD} pl-[75px] pr-[60px] font-lora text-[14px] text-black outline-none placeholder:text-[#505050]`;
const fieldBorder = (invalid: boolean) =>
  invalid ? 'border-[#D92D20]' : 'border-[#B5B5B5] focus:border-[#17AD10]';
const FIELD_ICON = 'pointer-events-none absolute left-[29px] top-1/2 h-[24px] w-[24px] -translate-y-1/2 text-[#3F3F3F]';
const EYE = 'absolute right-[29px] top-1/2 -translate-y-1/2 text-[#3F3F3F] hover:text-black';
const SOCIAL =
  'flex h-[65px] lg:h-[clamp(44px,7vh,65px)] w-full items-center justify-center gap-[20px] rounded-[15px] border border-[#B5B5B5] bg-white font-lora text-[16px] font-medium text-black transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60';

export default function FigmaSignup() {
  if (!clerkEnabled) return <PasswordSignup />;

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkSignup />
    </ClerkProvider>
  );
}

/* ── Shared view ─────────────────────────────────────────────────────────── */

type SignupScreenProps = {
  step: 'form' | 'verify';
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  code: string;
  setCode: (value: string) => void;
  showPassword: boolean;
  toggleShowPassword: () => void;
  showConfirm: boolean;
  toggleShowConfirm: () => void;
  isLoading: boolean;
  googleLoading: boolean;
  error: string;
  submitAttempted: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onVerify: (event: React.FormEvent) => void;
  onBack: () => void;
  onGoogle: () => void;
};

function SignupScreen({
  step,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  code,
  setCode,
  showPassword,
  toggleShowPassword,
  showConfirm,
  toggleShowConfirm,
  isLoading,
  googleLoading,
  error,
  submitAttempted,
  onSubmit,
  onVerify,
  onBack,
  onGoogle,
}: SignupScreenProps) {
  const nameValid = fullName.trim().length >= 2;
  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= 6;
  const confirmValid = confirmPassword.length > 0 && confirmPassword === password;
  const codeValid = code.trim().length >= 4;

  const hasPanelImage = Boolean(img('signup-panel'));
  const verifying = step === 'verify';

  return (
    <div className="flex min-h-[100dvh] flex-col bg-white lg:flex-row">
      {/* ── Left photo panel ─────────────────────────────────────────────── */}
      {/* Full-bleed: no frame padding, so the photo runs edge-to-edge and full
          height exactly like the sign-in screen. The 10px white border the
          Figma frame drew around it was what left the gap on the left/top. */}
      <div className="relative min-h-[320px] w-full shrink-0 lg:min-h-0 lg:w-[612px]">
        <ImageSlot
          slot="signup-panel"
          label="Hands holding a coconut, palm trees behind"
          hint="612 × 899"
          labelPosition="corner"
          className="absolute inset-0 h-full w-full"
          imgClassName="object-left"
          overlay={hasPanelImage ? undefined : 'bg-black/55'}
        />

        {/* Placeholder-only copy — the real photo already contains this text. */}
        {!hasPanelImage && (
          <div className="relative flex h-full flex-col justify-center pl-8 pt-[25px] sm:pl-[69px]">
            <h2 className="font-lora text-[38px] font-bold leading-[1.16] text-white sm:text-[50px] sm:leading-[57.8px]">
              A<br />
              Greener
              <br />
              Brighter
              <br />
              Future.
            </h2>
            <span
              className="mt-[24px] block h-[9px] w-[74px] bg-[#17AD10]"
              aria-hidden="true"
            />
            <p className="mt-[19px] max-w-[235px] font-lora text-[19px] leading-[1.24] text-white sm:text-[24px] sm:leading-[29.6px]">
              Create an account and be part of the coconut value chain transformation.
            </p>
          </div>
        )}
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-14 sm:px-10 lg:px-[clamp(32px,7vw,100px)] lg:py-[clamp(12px,3.4vh,40px)]">
        <div className="relative w-full max-w-[618px]">
          <Link
            to="/cococonnect"
            aria-label="Close"
            className="absolute right-0 top-[7px] flex h-[35px] w-[35px] items-center justify-center text-[#101010] transition-opacity hover:opacity-60"
          >
            {/* Figma draws this at 27 × 27 inside the 35 px hit area — a plain
                lucide X is only half that at the same box size. */}
            <svg viewBox="0 0 27 27" className="h-[27px] w-[27px]" aria-hidden="true">
              <path
                d="M2 2 25 25M25 2 2 25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </Link>

          {/* `pr-12` keeps the headline clear of the absolutely-positioned close
              button. The lg size is vw-fluid: at 1440 it is the design's 40px,
              and below that it shrinks just enough to stay on ONE line — a
              wrapped headline costs 49px of height and is what used to push the
              page into a scrollbar at 1280-wide. */}
          <h1 className="pr-12 font-montserrat text-[32px] font-semibold leading-[1.22] text-black sm:text-[40px] sm:leading-[48.76px] lg:text-[clamp(28px,2.78vw,40px)] lg:leading-[1.22]">
            {verifying ? 'Check Your Email' : 'Create Your Account'}
          </h1>
          <p className="mt-[20px] font-lora text-[20px] leading-[1.28] text-black sm:text-[24px] sm:leading-[30.72px] lg:mt-[clamp(8px,2vh,20px)]">
            {verifying ? `Enter the code we sent to ${email.trim()}` : 'Join Coconoto today'}
          </p>

          {error && (
            <div
              role="alert"
              className="mt-[22px] flex items-start gap-3 rounded-[8px] border border-[#F3B5B5] bg-[#FEF3F2] px-4 py-2 lg:mt-[clamp(6px,1.6vh,18px)]"
            >
              <AlertCircle
                className="mt-[1px] h-[18px] w-[18px] shrink-0 text-[#B42318]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="font-lora text-[14px] leading-[1.35] text-[#B42318]">{error}</span>
            </div>
          )}

          {verifying ? (
            /* ── Email verification (Clerk only) ─────────────────────────── */
            <form
              className={error ? 'mt-[22px] lg:mt-[clamp(6px,1.6vh,18px)]' : 'mt-[35px] lg:mt-[clamp(14px,3.8vh,35px)]'}
              onSubmit={onVerify}
              noValidate
            >
              <div className="relative">
                <ShieldCheck className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                <input
                  type="text"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, '').slice(0, 8))}
                  placeholder="Verification code"
                  aria-label="Verification code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  aria-invalid={submitAttempted && !codeValid ? 'true' : 'false'}
                  className={`${FIELD_INPUT} ${fieldBorder(submitAttempted && !codeValid)}`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-[31px] inline-flex h-[65px] w-full items-center justify-center gap-3 rounded-[15px] bg-[#1AC212] font-lora text-[16px] font-medium leading-[20.48px] text-white transition-colors hover:bg-[#17ad10] disabled:cursor-not-allowed disabled:opacity-60 lg:mt-[clamp(12px,3.4vh,31px)] lg:h-[clamp(44px,7vh,65px)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-[19px] w-[19px] animate-spin" aria-hidden="true" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <button
                type="button"
                onClick={onBack}
                className="mt-[18px] w-full text-center font-lora text-[15px] text-[#17AD10] hover:underline"
              >
                Use a different email
              </button>
            </form>
          ) : (
            /* ── Sign-up form ────────────────────────────────────────────── */
            <form
              className={error ? 'mt-[22px] lg:mt-[clamp(6px,1.6vh,18px)]' : 'mt-[35px] lg:mt-[clamp(14px,3.8vh,35px)]'}
              onSubmit={onSubmit}
              noValidate
            >
              <div className="space-y-[18px] lg:space-y-[clamp(9px,1.9vh,18px)]">
                {/* Full name — split into first/last on submit */}
                <div className="relative">
                  <User className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    aria-label="Full name"
                    autoComplete="name"
                    aria-invalid={submitAttempted && !nameValid ? 'true' : 'false'}
                    className={`${FIELD_INPUT} ${fieldBorder(submitAttempted && !nameValid)}`}
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    aria-label="Email address"
                    autoComplete="email"
                    aria-invalid={submitAttempted && !emailValid ? 'true' : 'false'}
                    className={`${FIELD_INPUT} ${fieldBorder(submitAttempted && !emailValid)}`}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    autoComplete="new-password"
                    aria-invalid={submitAttempted && !passwordValid ? 'true' : 'false'}
                    className={`${FIELD_INPUT} ${fieldBorder(submitAttempted && !passwordValid)}`}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className={EYE}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[24px] w-[24px]" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-[24px] w-[24px]" strokeWidth={1.5} />
                    )}
                  </button>
                </div>

                {/* Confirm password */}
                <div className="relative">
                  <Lock className={FIELD_ICON} strokeWidth={1.6} aria-hidden="true" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    aria-label="Confirm password"
                    autoComplete="new-password"
                    aria-invalid={submitAttempted && !confirmValid ? 'true' : 'false'}
                    className={`${FIELD_INPUT} ${fieldBorder(submitAttempted && !confirmValid)}`}
                  />
                  <button
                    type="button"
                    onClick={toggleShowConfirm}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    className={EYE}
                  >
                    {showConfirm ? (
                      <EyeOff className="h-[24px] w-[24px]" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-[24px] w-[24px]" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-[31px] inline-flex h-[65px] w-full items-center justify-center gap-3 rounded-[15px] bg-[#1AC212] font-lora text-[16px] font-medium leading-[20.48px] text-white transition-colors hover:bg-[#17ad10] disabled:cursor-not-allowed disabled:opacity-60 lg:mt-[clamp(12px,3.4vh,31px)] lg:h-[clamp(44px,7vh,65px)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-[19px] w-[19px] animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          )}

          {!verifying && (
            <>
              {/* Divider — 235px rule, 10px gap, 128px label, 10px gap, 235px rule */}
              <div className="mt-[30px] flex h-[20px] items-center gap-[10px] lg:mt-[clamp(12px,3.3vh,30px)]">
                <span className="h-px flex-1 bg-[#D3D3D3]" />
                <span className="font-lora text-[16px] leading-[20.48px] text-black">
                  Or continue with
                </span>
                <span className="h-px flex-1 bg-[#D3D3D3]" />
              </div>

              <button
                type="button"
                onClick={onGoogle}
                disabled={googleLoading || isLoading}
                className={`mt-[29px] lg:mt-[clamp(12px,3.2vh,29px)] ${SOCIAL}`}
              >
                <span className="flex h-[46px] w-[46px] items-center justify-center">
                  {googleLoading ? (
                    <Loader2 className="h-[24px] w-[24px] animate-spin" aria-hidden="true" />
                  ) : (
                    <GoogleMark className="h-[30px] w-[30px]" />
                  )}
                </span>
                Continue with Google
              </button>
            </>
          )}

          <p className="mt-[30px] text-center font-lora text-[16px] font-medium leading-[20.48px] text-black lg:mt-[clamp(12px,3.3vh,30px)]">
            Already have an account?{' '}
            <Link to="/buyer-login" className="text-[#17AD10] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Clerk-backed sign-up ────────────────────────────────────────────────── */

function ClerkSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, refreshSession } = useMarketplaceAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const clerk = useClerk();

  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const returnTo = searchParams.get('returnTo');
  const exitTo = safeReturnTo(returnTo, '/buyer-dashboard');

  const splitName = () => {
    const parts = fullName.trim().split(/\s+/);
    return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
  };

  const completeSignUp = async () => {
    const { firstName, lastName } = splitName();

    const token = await clerkSessionToken(clerk);
    if (!token) {
      setError('Your session could not be read. Please try again.');
      return;
    }

    // `first_name` / `last_name` tell the server to create the buyers row.
    const result = await exchangeClerkSession({ token, first_name: firstName, last_name: lastName });
    if (!result.success || !result.buyer) {
      setError(result.error || 'Your account was created but the profile could not be linked.');
      return;
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

  const validate = () => {
    const { firstName } = splitName();
    if (firstName.length < 2) return 'Please enter your full name.';
    if (!EMAIL_RE.test(email.trim())) return 'Please enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (confirmPassword !== password) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setError('');

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const { firstName, lastName } = splitName();
      const payload = {
        emailAddress: email.trim(),
        password,
        firstName,
        lastName,
      };

      // Clerk refuses `signUp.create()` while it still holds a session from an
      // earlier attempt (`session_exists`). Clear that session and try once
      // more, so the account the buyer asked for is the one that gets created.
      let created;
      try {
        created = await signUp.create(payload);
      } catch (createError) {
        if (clerkErrorCode(createError) !== 'session_exists') throw createError;
        await clerk.signOut();
        created = await signUp.create(payload);
      }

      // If email verification is switched off on the Clerk instance the
      // sign-up is already complete; otherwise send the code.
      if (created.status === 'complete' && created.createdSessionId) {
        await setActive({ session: created.createdSessionId });
        await completeSignUp();
        return;
      }

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
      setSubmitAttempted(false);
    } catch (clerkError) {
      setError(describeClerkError(clerkError));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setError('');

    if (code.trim().length < 4) {
      setError('Enter the code from your email.');
      return;
    }
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (attempt.status !== 'complete' || !attempt.createdSessionId) {
        setError('That code did not work. Check your email and try again.');
        return;
      }

      await setActive({ session: attempt.createdSessionId });
      await completeSignUp();
    } catch (clerkError) {
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
      // Google carries the name and email, so the profile is created from the
      // Clerk user in the same exchange as the password path.
      const redirect = {
        strategy: 'oauth_google' as const,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: `/auth-complete?returnTo=${encodeURIComponent(exitTo)}`,
      };

      try {
        await signUp.authenticateWithRedirect(redirect);
      } catch (redirectError) {
        if (clerkErrorCode(redirectError) !== 'session_exists') throw redirectError;
        await clerk.signOut();
        await signUp.authenticateWithRedirect(redirect);
      }
    } catch (clerkError) {
      setError(describeClerkError(clerkError));
      setGoogleLoading(false);
    }
  };

  return (
    <SignupScreen
      step={step}
      fullName={fullName}
      setFullName={setFullName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      code={code}
      setCode={setCode}
      showPassword={showPassword}
      toggleShowPassword={() => setShowPassword((v) => !v)}
      showConfirm={showConfirm}
      toggleShowConfirm={() => setShowConfirm((v) => !v)}
      isLoading={isLoading}
      googleLoading={googleLoading}
      error={error}
      submitAttempted={submitAttempted}
      onSubmit={handleSubmit}
      onVerify={handleVerify}
      onBack={() => {
        setStep('form');
        setCode('');
        setError('');
      }}
      onGoogle={handleGoogle}
    />
  );
}

/* ── Legacy password sign-up (no Clerk key configured) ───────────────────── */

function PasswordSignup() {
  const navigate = useNavigate();
  const { login, refreshSession } = useMarketplaceAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);
    setError('');

    const parts = fullName.trim().split(/\s+/);
    const firstName = parts[0] ?? '';
    const lastName = parts.slice(1).join(' ');

    if (firstName.length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (confirmPassword !== password) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const result = await buyerSignup({
      email: email.trim(),
      password,
      first_name: firstName,
      last_name: lastName,
    });

    if (result.success && result.buyer) {
      // The signup endpoint already set the session cookie; mirror it into the
      // SPA context so the protected dashboard doesn't bounce us straight back
      // here on the very next render.
      login({
        id: result.buyer.id,
        role: 'buyer',
        email: result.buyer.email,
        name: `${firstName} ${lastName}`.trim(),
      });
      await refreshSession();
      navigate('/buyer-dashboard');
      setIsLoading(false);
      return;
    }

    setError(result.error || 'Could not create your account. Please try again.');
    setIsLoading(false);
  };

  return (
    <SignupScreen
      step="form"
      fullName={fullName}
      setFullName={setFullName}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      code=""
      setCode={() => undefined}
      showPassword={showPassword}
      toggleShowPassword={() => setShowPassword((v) => !v)}
      showConfirm={showConfirm}
      toggleShowConfirm={() => setShowConfirm((v) => !v)}
      isLoading={isLoading}
      googleLoading={false}
      error={error}
      submitAttempted={submitAttempted}
      onSubmit={handleSubmit}
      onVerify={() => undefined}
      onBack={() => undefined}
      // Google needs Clerk. Without a key the button stays inert, as before.
      onGoogle={() => setError('Google sign-up is not available yet. Use your email and password.')}
    />
  );
}
