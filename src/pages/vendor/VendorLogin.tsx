import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { vendorLogin } from '../../services/vendorService';

export function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await vendorLogin({ email, password });

    if (result.success && result.vendor) {
      // Store vendor info in localStorage
      localStorage.setItem('vendorId', result.vendor.id);
      localStorage.setItem('vendorEmail', result.vendor.email);
      localStorage.setItem('vendorBusinessName', result.vendor.business_name);
      navigate('/vendor-dashboard');
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-green-700">
              C<img src="/favicon.png" alt="o" className="h-6 inline-block mx-[-6px] mb-1" />co-connect
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vendor Login
          </h2>
          <p className="text-gray-600">
            Sign in to manage your products and orders
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/vendor-signup" className="text-green-700 font-semibold hover:text-green-800">
                Sign Up
              </Link>
            </p>
          </div>

          {/* Back to Marketplace */}
          <div className="mt-4 text-center">
            <Link to="/marketplace" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
