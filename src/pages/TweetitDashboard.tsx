import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, LogOut } from 'lucide-react';
import { SentEmailsList } from '../components/admin/SentEmailsList';
import { EmailConfigPanel } from '../components/admin/EmailConfigPanel';

const TweetitDashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleRefresh = () => setRefreshKey(k => k + 1);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/tweetit');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Tweetit — Email Center</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleRefresh} className="bg-green-600 text-white px-3 py-1 rounded-md inline-flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded-md inline-flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SentEmailsList refreshKey={refreshKey} />
        </div>
        <div>
          <EmailConfigPanel refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default TweetitDashboard;
