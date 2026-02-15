import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Menu, LogIn } from 'lucide-react';
import Logo from '../assets/Logo_1.png';

export default function MarketplaceNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
            <img src={Logo} alt="Coconoto" className="h-8 md:h-8" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden focus:outline-none py-2"
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
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-green-700">
              Home
            </Link>
            <Link to="/services" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-green-700">
              Coco-Tech
            </Link>
            <Link to="/product" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-green-700">
              Cococycle Hub
            </Link>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-green-700">
              About
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to="/buyer-login"
                className="text-green-700 hover:text-green-800 font-medium"
              >
                Buyer Login
              </Link>
              <Link
                to="/vendor-login"
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Vendor Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <Link 
            to="/" 
            className="block py-2 text-gray-600 hover:text-green-700"
            onClick={() => { window.scrollTo(0, 0); setIsMobileMenuOpen(false); }}
          >
            Home
          </Link>
          <Link 
            to="/services" 
            className="block py-2 text-gray-600 hover:text-green-700"
            onClick={() => { window.scrollTo(0, 0); setIsMobileMenuOpen(false); }}
          >
            Coco Tech
          </Link>
          <Link 
            to="/product" 
            className="block py-2 text-gray-600 hover:text-green-700"
            onClick={() => { window.scrollTo(0, 0); setIsMobileMenuOpen(false); }}
          >
            Cococycle Hub
          </Link>
          <Link 
            to="/about" 
            className="block py-2 text-gray-600 hover:text-green-700"
            onClick={() => { window.scrollTo(0, 0); setIsMobileMenuOpen(false); }}
          >
            About
          </Link>
          <Link
            to="/buyer-login"
            className="flex items-center w-full text-left bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Buyer Login
          </Link>
          <Link
            to="/vendor-login"
            className="flex items-center w-full text-left bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Vendor Login
          </Link>
        </div>
      )}
    </nav>
  );
}
