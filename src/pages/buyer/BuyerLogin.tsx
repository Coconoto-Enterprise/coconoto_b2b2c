import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Store, Sparkles, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { buyerLogin } from '../../services/buyerService';
import type { BuyerLoginInput } from '../../types/buyer';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';

export function BuyerLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSession } = useMarketplaceAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<BuyerLoginInput>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const passwordValid = formData.password.length >= 6;

  // Auto-prefill remembered email
  useEffect(() => {
    const remembered = localStorage.getItem('buyerEmailRemember');
    if (remembered) {
      setFormData(prev => ({ ...prev, email: remembered }));
    }
    // Focus the email field on mount
    setTimeout(() => emailRef.current?.focus(), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError('');

    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!passwordValid) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    const result = await buyerLogin(formData);

    if (result.success && result.buyer) {
      if (rememberMe) {
        localStorage.setItem('buyerEmailRemember', result.buyer.email);
      } else {
        localStorage.removeItem('buyerEmailRemember');
      }

      await refreshSession();
      const returnTo = searchParams.get('returnTo');
      navigate(returnTo?.startsWith('/') ? returnTo : '/buyer-dashboard');
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const passwordChecklistItem = (label: string, passed: boolean) => (
    <div className={`flex items-center gap-1.5 text-xs ${passed ? 'text-green-700' : 'text-gray-500'}`}>
      <CheckCircle2 className={`h-3 w-3 ${passed ? 'text-green-600' : 'text-gray-300'}`} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/60 to-green-100 flex flex-col">
      {/* Top brand bar */}
      <header className="w-full bg-white/70 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-700 leading-none tracking-tight">
                C<img src="/favicon.png" alt="o" className="h-5 inline-block mx-[1px] mb-0.5" />co-connect
              </h1>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 text-white px-4 py-2 text-sm font-semibold hover:bg-green-800 transition-colors shadow-sm"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Visual / pitch panel */}
          <div className="hidden lg:flex relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-emerald-700 to-green-800 text-white p-10 flex-col justify-between shadow-2xl">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute -top-16 -right-16 h-64 w-64 bg-white/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-64 w-64 bg-emerald-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                Buyer Access
              </div>
              <h2 className="mt-5 text-4xl font-black leading-tight">
                Welcome back to <span className="text-amber-200">Coconoto</span>.
              </h2>
              <p className="mt-3 text-white/85 text-base leading-relaxed max-w-md">
                Track your orders, save favorites, and checkout faster across our verified coconut marketplace.
              </p>
            </div>

            <ul className="relative space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">Verified vendors only</p>
                  <p className="text-white/70">Every seller is vetted by Coconoto.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">Save your details</p>
                  <p className="text-white/70">One-click checkout on future orders.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Store className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">Growing catalog</p>
                  <p className="text-white/70">From coconut oil to cocopeat and more.</p>
                </div>
              </li>
            </ul>

            <div className="relative pt-6 mt-6 border-t border-white/15 text-xs text-white/70">
              Secured by Coconoto Buyer Portal
            </div>
          </div>

          {/* Login form */}
          <div>
            <div className="text-center mb-6 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
                <Sparkles className="h-3.5 w-3.5" />
                Buyer Access
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Sign in to your account</h2>
              <p className="text-gray-600 mt-1">Track your orders and save favorites.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-green-100/50 p-6 sm:p-8">
              <h2 className="hidden lg:block text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
              <p className="hidden lg:block text-sm text-gray-500 mb-6">
                Welcome back. Please enter your details.
              </p>

              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl"
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="buyer-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="buyer-email"
                      ref={emailRef}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      aria-invalid={submitAttempted && !emailValid ? 'true' : 'false'}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                        submitAttempted && !emailValid
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {submitAttempted && !emailValid && formData.email.length > 0 && (
                    <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="buyer-password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/buyer-login?forgot=1"
                      className="text-xs font-medium text-green-700 hover:text-green-800"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="buyer-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      aria-invalid={submitAttempted && !passwordValid ? 'true' : 'false'}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                        submitAttempted && !passwordValid
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(s => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {submitAttempted && formData.password.length > 0 && !passwordValid && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {passwordChecklistItem('At least 6 characters', passwordValid)}
                    </div>
                  )}
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 text-sm text-gray-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span>Remember me on this device</span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-700 text-white py-3 px-6 rounded-xl font-semibold text-base hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-gray-400">Or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Continue as guest */}
                <Link
                  to="/marketplace"
                  className="block w-full text-center rounded-xl border border-gray-200 text-gray-700 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Continue as Guest →
                </Link>
              </form>

              {/* Sign up link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/buyer-signup" className="text-green-700 font-semibold hover:text-green-800">
                  Create one
                </Link>
              </p>
            </div>

            {/* Vendor login link below the card */}
            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600">
                Selling on Coconoto?{' '}
                <Link to="/vendor-login" className="text-green-700 font-semibold hover:text-green-800 inline-flex items-center gap-1">
                  <Store className="h-3.5 w-3.5" />
                  Vendor Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
