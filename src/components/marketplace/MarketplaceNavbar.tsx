import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search, X, Menu } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { AuthModal } from "../auth/AuthModal";
import Logo from '../../assets/Logo_1.png';

export function MarketplaceNavbar() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('login');

  const openAuthModal = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Fixed Wrapper for all navbar sections */}
      <div className="fixed w-full top-0 z-50">
        {/* Primary Navbar */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
              <img src={Logo} alt="Coconoto" className="h-8 md:h-10" />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {/* <Link to="/marketplace" className="flex items-center text-gray-600 hover:text-green-700">
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
                    <button 
                      onClick={() => openAuthModal('login')} 
                      className="text-gray-600 hover:text-green-700"
                    >
                      Sign In
                    </button> */}
                    <button 
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Join Waitlist
                    </button>
                  {/* </div>
                )} */}
              </div>

              {/* Mobile Menu Toggle - Consistent with other navbars */}
              <button 
                className="md:hidden focus:outline-none"
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
            </div>
          </div>
        </nav>

        {/* Secondary Navbar (Chat With Us) */}
        {/* <div className="bg-green-50 py-2 border-t border-green-100">
          <div className="container mx-auto px-6 flex justify-center">
            <a 
              href="https://wa.me/+2348148609051" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-700 hover:text-green-800"
            >
              <FaWhatsapp className="h-5 w-5" />
              <span>Chat with us</span>
            </a>
          </div>
        </div> */}

        {/* Tertiary Navbar (Search Bar) */}
        {/* <div className="bg-white py-3 shadow-sm border-t border-gray-100">
          <div className="container mx-auto px-6 flex justify-center">
            <div className="relative w-full md:w-3/4 flex">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-2 border-2 border-green-600 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-green-700"
              />
              <button className="bg-green-600 text-white px-6 py-2 rounded-r-lg hover:bg-green-700 transition">
                Search
              </button>
            </div>
          </div>
        </div> */}

        {/* Mobile Menu - Consistent with other navbars */}
        {/* {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md py-4 px-6 border-t border-gray-100">
            <Link 
              to="/marketplace" 
              className="block py-2 text-gray-600 hover:text-green-700"
              onClick={toggleMobileMenu}
            >
              Products
            </Link>
            <Link 
              to="/marketplace/rfq" 
              className="block py-2 text-gray-600 hover:text-green-700"
              onClick={toggleMobileMenu}
            >
              RFQ
            </Link>
            <Link 
              to="/marketplace/suppliers" 
              className="block py-2 text-gray-600 hover:text-green-700"
              onClick={toggleMobileMenu}
            >
              Suppliers
            </Link>
            {user ? (
              <Link 
                to="/dashboard" 
                className="block py-2 text-gray-600 hover:text-green-700"
                onClick={toggleMobileMenu}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <button 
                  onClick={() => openAuthModal('login')}
                  className="block py-2 text-gray-600 hover:text-green-700 w-full text-left"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => openAuthModal('signup')}
                  className="block w-full text-left bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-2"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )} */}
      </div>

      {/* Add padding to the top of your main content to account for fixed navbar */}
      <div className="pt-20"></div> {/* Reduced padding since we removed sections */}

      {/* Auth Modal */}
      {/* <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      /> */}
    </>
  );
}
