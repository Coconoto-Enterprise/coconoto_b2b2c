import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VintageLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store login status and navigate to dashboard
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/vintage-dashboard');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Vintage Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl font-bold text-white">🥥</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
            Vintage Access
          </h1>
          <p className="text-lg text-amber-700 font-medium">
            Coconoto Heritage Portal
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}



            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-amber-50/30"
                placeholder="Enter admin password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Enter Vintage Portal'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-amber-100 text-center">
            <p className="text-sm text-amber-600 font-medium">
              Established Heritage • Sustainable Future
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-amber-700 hover:text-amber-900 text-sm underline"
            >
              Return to Main Site
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="text-center">
          <div className="flex justify-center space-x-2 text-amber-400">
            <span className="text-2xl">🌴</span>
            <span className="text-2xl">🥥</span>
            <span className="text-2xl">🌴</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VintageLogin;