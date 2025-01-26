import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {user?.accountType === 'seller' ? 'Seller Dashboard' : 'Buyer Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="relative">
              <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                  <User className="h-5 w-5 text-green-700" />
                </div>
                <span className="font-medium">{user?.name}</span>
              </button>
            </div>
            
            <button
              onClick={logout}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}