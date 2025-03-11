import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palmtree, ShoppingBag } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');
  const { user, logout } = useAuth();

  const openAuthModal = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Palmtree className="h-8 w-8 text-green-700" />
              <span className="text-2xl font-bold text-green-900">Coconoto</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/marketplace" className="flex items-center text-gray-600 hover:text-green-700">
                <ShoppingBag className="h-5 w-5 mr-1" />
                Marketplace
              </Link>
              <Link to="/services" className="text-gray-600 hover:text-green-700">
                Our Services
              </Link>
              {user ? (
                <Link to="/dashboard" className="text-gray-600 hover:text-green-700">
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-600 hover:text-green-700"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}