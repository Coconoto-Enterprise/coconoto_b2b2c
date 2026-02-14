import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Menu, LogOut, Store } from 'lucide-react';
import Logo from '../assets/Logo_1.png';

interface VendorNavbarProps {
  vendorBusinessName?: string;
  onLogout: () => void;
}

export default function VendorNavbar({ vendorBusinessName, onLogout }: VendorNavbarProps) {
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
            {vendorBusinessName && (
              <span className="text-gray-700 font-medium">{vendorBusinessName}</span>
            )}
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-gray-600 hover:text-green-700">
              Home
            </Link>
            <Link 
              to="/marketplace" 
              onClick={() => window.scrollTo(0, 0)} 
              className="flex items-center text-gray-600 hover:text-green-700"
            >
              <Store className="h-5 w-5 mr-1" />
              Marketplace
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
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          {vendorBusinessName && (
            <div className="pb-3 mb-3 border-b border-gray-200">
              <span className="text-gray-700 font-medium">{vendorBusinessName}</span>
            </div>
          )}
          <Link 
            to="/" 
            className="block py-2 text-gray-600 hover:text-green-700"
            onClick={() => { window.scrollTo(0, 0); setIsMobileMenuOpen(false); }}
          >
            Home
          </Link>
          <Link 
            to="/marketplace" 
            className="flex items-center py-2 text-gray-600 hover:text-green-700"
            onClick={() => { window.scrollTo(0, 0); setIsMobileMenuOpen(false); }}
          >
            <Store className="h-5 w-5 mr-1" />
            Marketplace
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
          <button
            onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
            className="flex items-center w-full text-left bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-2"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
