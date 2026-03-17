import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buyerLogin } from '../../services/buyerService';
import type { BuyerLoginInput } from '../../types/buyer';

export function BuyerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BuyerLoginInput>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await buyerLogin(formData);

    if (result.success && result.buyer) {
      // Store buyer info in localStorage
      localStorage.setItem('buyerId', result.buyer.id);
      localStorage.setItem('buyerEmail', result.buyer.email);
      localStorage.setItem('buyerName', `${result.buyer.first_name} ${result.buyer.last_name}`);

      // Redirect to buyer dashboard
      navigate('/buyer-dashboard');
    } else {
      setError(result.error || 'Login failed');
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <nav className="mb-6 bg-white/70 backdrop-blur-sm border border-white/70 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <h1 className="text-4xl font-bold text-green-700 leading-none">
                C<img src="/favicon.png" alt="o" className="h-6 inline-block mx-[1px] mb-0.5" />co-connect
              </h1>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center rounded-lg bg-green-700 text-white px-4 py-2 text-sm font-semibold hover:bg-green-800 transition-colors"
            >
              Home
            </Link>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Buyer Sign In
          </h2>
          <p className="text-gray-600">
            Access your account and manage your orders
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/buyer-signup" className="text-green-700 font-semibold hover:text-green-800">
                Create Account
              </Link>
            </p>
          </div>

          {/* Marketplace Link */}
          <div className="mt-4 text-center">
            <Link to="/marketplace" className="text-sm text-gray-500 hover:text-gray-700">
              Continue as Guest →
            </Link>
          </div>
        </div>

        {/* Vendor Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Are you a vendor?{' '}
            <Link to="/vendor-login" className="text-green-700 font-semibold hover:text-green-800">
              Vendor Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
