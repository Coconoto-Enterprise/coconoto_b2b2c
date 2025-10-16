import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, Menu } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';
import { WaitlistModal } from './WaitlistModal';
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Logo_1.png';

export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const openAuthModal = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when auth modal opens
  };

  const openWaitlistModal = () => {
    setIsWaitlistModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when waitlist modal opens
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="Coconoto" className="h-8 md:h-8" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden focus:outline-none py-2"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-green-700" />
              ) : (
                <Menu className="h-6 w-6 text-green-700" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* <Link to="/marketplace" className="flex items-center text-gray-600 hover:text-green-700">
                <ShoppingBag className="h-5 w-5 mr-1" />
                Marketplace
              </Link> */}
              <Link to="/" className="text-gray-600 hover:text-green-700">
                Home
              </Link>
              <Link to="/services" className="text-gray-600 hover:text-green-700">
                Our Services
              </Link>
              <Link to="/product" className="text-gray-600 hover:text-green-700">
                Our Product
              </Link>
              {user ? (
                <Link to="/dashboard" className="text-gray-600 hover:text-green-700">
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* <button
                    onClick={() => openAuthModal('login')}
                    className="text-gray-600 hover:text-green-700"
                  >
                    Sign In
                  </button> */}
                  <button
                    onClick={openWaitlistModal}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Join Waitlist
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md py-4 px-6">
            {/* <Link 
              to="/marketplace" 
              className="block py-2 text-gray-600 hover:text-green-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Marketplace
            </Link> */}
            <Link 
              to="/" 
              className="block py-2 text-gray-600 hover:text-green-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="block py-2 text-gray-600 hover:text-green-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Services
            </Link>
            <Link 
              to="/product" 
              className="block py-2 text-gray-600 hover:text-green-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Our Product
            </Link>
            {user ? (
              <Link 
                to="/dashboard" 
                className="block py-2 text-gray-600 hover:text-green-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                {/* <button
                  onClick={() => openAuthModal('login')}
                  className="block py-2 text-gray-600 hover:text-green-700 w-full text-left"
                >
                  Sign In
                </button> */}
                <button
                  onClick={openWaitlistModal}
                  className="block w-full text-left bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-2"
                >
                  Join Waitlist
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      /> */}

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </>
  );
}
