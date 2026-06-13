import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TweetitLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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
        navigate('/tweetit-dashboard');
      } else {
        setError(data.error || 'Invalid login credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl font-bold text-white">✉️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tweetit Email Portal</h1>
          <p className="text-sm text-gray-600">Login with your Coconoto email user account.</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="you@coconoto.africa"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-500">
            <p>First admin account: <strong>info@coconoto.africa</strong></p>
            <p>Password: <strong>COCONOTO</strong></p>
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-gray-600 underline">Return to Main Site</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetitLogin;
