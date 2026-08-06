import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Loader2, Sparkles, ShieldCheck, Send, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Logo from '../assets/Logo_1.png';

const TweetitLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailPrefilled, setEmailPrefilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromUrl = params.get('email');
    const remembered = localStorage.getItem('tweetitEmailRemember');

    if (emailFromUrl) {
      setEmail(emailFromUrl.trim());
      setEmailPrefilled(true);
    } else if (remembered) {
      setEmail(remembered);
    } else {
      setEmail('');
      setEmailPrefilled(false);
    }

    setTimeout(() => emailRef.current?.focus(), 120);
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'email-user-login', email, password }),
      });

      const data = await response.json();
      if (data.success && (data.user || data.mailUser)) {
        const loggedUser = data.user || data.mailUser;
        localStorage.setItem('tweetitUser', JSON.stringify(loggedUser));
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('currentMailUser', JSON.stringify(loggedUser));
        if (rememberMe) localStorage.setItem('tweetitEmailRemember', loggedUser.email || email);
        else localStorage.removeItem('tweetitEmailRemember');

        // Forward reply deep-link params (compose/to/subject) to the dashboard
        const params = new URLSearchParams(location.search);
        params.delete('email');
        const forward = params.toString();
        navigate(`/tweetit-dashboard${forward ? `?${forward}` : ''}`);
      } else {
        setError(data.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-green-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* Slim header */}
      <header className="w-full bg-white/70 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Coconoto</span>
            <span className="sm:hidden">Back</span>
          </button>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <Send className="h-3.5 w-3.5" />
            Tweetit Email Portal
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-10 items-center">
          {/* Branding panel */}
          <div className="hidden lg:flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                Welcome back
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                Sign in to <span className="text-emerald-600">Tweetit</span>.
              </h1>
              <p className="mt-4 text-base text-gray-600 max-w-md leading-relaxed">
                Compose, track, and send branded emails from your Coconoto mailbox.
                One dashboard, every campaign.
              </p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-emerald-100 p-4 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Secure mailbox access</p>
                  <p className="text-gray-600">Encrypted sessions, scoped to Coconoto staff only.</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-emerald-100 p-4 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Send className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-gray-900">Branded templates</p>
                  <p className="text-gray-600">Customer and team templates ready in one click.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form panel */}
          <div className="w-full">
            <div className="bg-white/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-7 sm:p-10">
              {/* Logo */}
              <div className="flex flex-col items-center mb-7">
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-4 shadow-lg ring-4 ring-emerald-100">
                  <img src={Logo} alt="Tweetit Logo" className="h-14 w-14 object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Tweetit Email Portal</h2>
                <p className="text-sm text-gray-500 mt-1">Login with your Coconoto email user account.</p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl"
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                  <label htmlFor="tweetit-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="tweetit-email"
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      readOnly={emailPrefilled}
                      autoComplete="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors ${
                        emailPrefilled
                          ? 'bg-emerald-50/50 border-emerald-200 cursor-default'
                          : 'border-gray-300 focus:ring-emerald-300 focus:border-emerald-500'
                      }`}
                      placeholder="you@coconoto.africa"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="tweetit-password" className="block text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <a
                      href={`mailto:support@coconoto.africa?subject=Password%20reset%20for%20${encodeURIComponent(email || 'Tweetit account')}`}
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="tweetit-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 transition-colors"
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
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 text-sm text-gray-600 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Remember me on this device</span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold text-base hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 pt-6 border-t border-gray-100 flex flex-col gap-3 text-center">
                <p className="text-xs text-gray-500">
                  Need help accessing your account?{' '}
                  <a
                    href="mailto:support@coconoto.africa"
                    className="text-emerald-700 font-medium hover:underline"
                  >
                    Contact support
                  </a>
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Return to Main Site
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetitLogin;
