import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "../auth/AuthModal";  // Import AuthModal

export function MarketplaceNavbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');

  const openAuthModal = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      {/* Primary Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-900">
                Coconoto Marketplace
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/marketplace" className="flex items-center text-gray-600 hover:text-green-700">
                <ShoppingBag className="h-5 w-5 mr-1" />
                Products
              </Link>
              <Link to="/marketplace/rfq" className="text-gray-600 hover:text-green-700">
                RFQ
              </Link>
              <Link to="/marketplace/suppliers" className="text-gray-600 hover:text-green-700">
                Suppliers
              </Link>
              {user ? (
                <Link to="/dashboard" className="text-gray-600 hover:text-green-700">
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <button onClick={() => openAuthModal('login')} className="text-gray-600 hover:text-green-700">
                    Sign In
                  </button>
                  <button onClick={() => openAuthModal('signup')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Secondary Navbar (Chat With Us) */}
      <div className="bg-green-50 py-2">
        <div className="container mx-auto px-6 flex justify-center">
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer"
            className="flex items-center space-x-2 text-green-700 hover:text-green-800">
            <FaWhatsapp className="h-5 w-5" />
            <span>Chat with us</span>
          </a>
        </div>
      </div>

      {/* Tertiary Navbar (Search Bar) */}
      <div className="bg-white py-3 shadow-sm">
        <div className="container mx-auto px-6 flex justify-center">
          <div className="relative w-full md:w-3/4 flex">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-6 w-6" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 border-2 border-green-600 rounded-l-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-green-700"
            />
            <button className="bg-green-600 text-white px-6 py-3 rounded-r-lg hover:bg-green-700 transition">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md py-4 px-6">
          <Link to="/marketplace" className="block py-2 text-gray-600 hover:text-green-700">
            Products
          </Link>
          <Link to="/marketplace/rfq" className="block py-2 text-gray-600 hover:text-green-700">
            RFQ
          </Link>
          <Link to="/marketplace/suppliers" className="block py-2 text-gray-600 hover:text-green-700">
            Suppliers
          </Link>
          {user ? (
            <Link to="/dashboard" className="block py-2 text-gray-600 hover:text-green-700">
              Dashboard
            </Link>
          ) : (
            <>
              <button onClick={() => openAuthModal('login')} className="block py-2 text-gray-600 hover:text-green-700 w-full text-left">
                Sign In
              </button>
              <button onClick={() => openAuthModal('signup')} className="block w-full text-left bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-2">
                Sign Up
              </button>
            </>
          )}
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authMode} />
    </>
  );
}

