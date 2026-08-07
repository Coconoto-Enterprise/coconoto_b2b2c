import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShoppingBag, Sparkles, ShieldCheck, Loader2, BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';
import { vendorLogin } from '../../services/vendorService';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';

export function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshSession } = useMarketplaceAuth();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= 6;

  useEffect(() => {
    const remembered = localStorage.getItem('vendorEmailRemember');
    if (remembered) setEmail(remembered);
    setTimeout(() => emailRef.current?.focus(), 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError('');

    if (!emailValid) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    if (!passwordValid) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const result = await vendorLogin({ email, password });

    if (result.success && result.vendor) {
      if (rememberMe) localStorage.setItem('vendorEmailRemember', result.vendor.email);
      else localStorage.removeItem('vendorEmailRemember');

      await refreshSession();
      const returnTo = searchParams.get('returnTo');
      navigate(returnTo?.startsWith('/') ? returnTo : '/vendor-dashboard');
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/60 to-green-100 flex flex-col">
      {/* Top brand bar */}
      <header className="w-full bg-white/70 backdrop-blur-md border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-green-700 leading-none tracking-tight">
                C<img src="/favicon.png" alt="o" className="h-5 inline-block mx-[1px] mb-1" />co-connect
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
              <div className="absolute -bottom-16 -left-16 h-64 w-64 bg-amber-200/30 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <ShoppingBag className="h-3.5 w-3.5" />
                Vendor Access
              </div>
              <h2 className="mt-5 text-4xl font-black leading-tight">
                Grow your <span className="text-amber-200">coconut business</span>.
              </h2>
              <p className="mt-3 text-white/85 text-base leading-relaxed max-w-md">
                Manage products, fulfill orders, and reach verified buyers across the Coconoto network.
              </p>
            </div>

            <ul className="relative space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <BarChart3 className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">Sales analytics</p>
                  <p className="text-white/70">Track orders, revenue, and top products.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">Verified seller badge</p>
                  <p className="text-white/70">Stand out with the Coconoto verified mark.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">Direct buyer inquiries</p>
                  <p className="text-white/70">Real leads from buyers actively shopping.</p>
                </div>
              </li>
            </ul>

            <div className="relative pt-6 mt-6 border-t border-white/15 text-xs text-white/70">
              Secured by Coconoto Vendor Portal
            </div>
          </div>

          {/* Login form */}
          <div>
            <div className="text-center mb-6 lg:hidden">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-800">
                <ShoppingBag className="h-3.5 w-3.5" />
                Vendor Access
              </div>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Seller sign in</h2>
              <p className="text-gray-600 mt-1">Manage your storefront and orders.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-green-100/50 p-6 sm:p-8">
              <h2 className="hidden lg:block text-2xl font-bold text-gray-900 mb-1">Seller sign in</h2>
              <p className="hidden lg:block text-sm text-gray-500 mb-6">
                Welcome back. Sign in to manage your storefront.
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
                  <label htmlFor="vendor-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="vendor-email"
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      aria-invalid={submitAttempted && !emailValid ? 'true' : 'false'}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                        submitAttempted && !emailValid
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                          : 'border-gray-300 focus:ring-green-300 focus:border-green-500'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {submitAttempted && !emailValid && email.length > 0 && (
                    <p className="mt-1 text-xs text-red-600">Enter a valid email address.</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="vendor-password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <Link
                      to="/vendor-login?forgot=1"
                      className="text-xs font-medium text-green-700 hover:text-green-800"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="vendor-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  {submitAttempted && password.length > 0 && !passwordValid && (
                    <div className="mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CheckCircle2 className={`h-3 w-3 ${passwordValid ? 'text-green-600' : 'text-gray-300'}`} />
                        <span>At least 6 characters</span>
                      </div>
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
                    'Sign In to Dashboard'
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-gray-400">Or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                <Link
                  to="/marketplace"
                  className="block w-full text-center rounded-xl border border-gray-200 text-gray-700 py-2.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back to Marketplace
                </Link>
              </form>

              {/* Sign up link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have a storefront yet?{' '}
                <Link to="/vendor-signup" className="text-green-700 font-semibold hover:text-green-800">
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Buyer login link below the card */}
            <div className="mt-5 text-center">
              <p className="text-sm text-gray-600">
                Just shopping?{' '}
                <Link to="/buyer-login" className="text-green-700 font-semibold hover:text-green-800">
                  Buyer Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
