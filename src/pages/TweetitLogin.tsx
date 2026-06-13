import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TweetitLogin: React.FC = () => {
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
        body: JSON.stringify({ action: 'admin-login', password }),
      });

      const data = await response.json();
      if (data.success) {
        // If server returned a mapped mail user, store it for later (id, login_email, role, sender_email)
        if (data.user) {
          localStorage.setItem('currentMailUser', JSON.stringify(data.user));
        }
        localStorage.setItem('adminLoggedIn', 'true');
        navigate('/tweetit-dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-3xl font-bold text-white">✉️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tweetit Access</h1>
          <p className="text-sm text-gray-600">Email management portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-8 border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Admin Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Enter Tweetit'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-gray-600 underline">Return to Main Site</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetitLogin;
