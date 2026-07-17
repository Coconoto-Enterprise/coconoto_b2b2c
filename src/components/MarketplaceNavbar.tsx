import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, LogIn, Store } from 'lucide-react';
import Logo from '../assets/Logo_1.png';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/services', label: 'Coco-Tech' },
  { to: '/product', label: 'Cococycle Hub' },
  { to: '/about', label: 'About' },
];

export default function MarketplaceNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const linkClass = (to: string) =>
    location.pathname === to
      ? 'text-green-700 font-semibold'
      : 'text-gray-600 hover:text-green-700';

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-2 lg:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
            <img src={Logo} alt="Coconoto" className="h-8 md:h-8" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden focus:outline-none py-2"
            onClick={toggleMobileMenu}
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => window.scrollTo(0, 0)}
                className={linkClass(link.to)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center space-x-3">
              <Link
                to="/buyer-login"
                className="flex items-center text-green-700 hover:text-green-800 font-medium"
              >
                <LogIn className="h-4 w-4 mr-1.5" />
                Buyer Login
              </Link>
              <Link
                to="/vendor-signup"
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Store className="h-4 w-4 mr-2" />
                Sell on Coconoto
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block py-2 ${linkClass(link.to)}`}
              onClick={() => { window.scrollTo(0, 0); setIsMobileMenuOpen(false); }}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-2">
            <Link
              to="/buyer-login"
              className="flex items-center w-full text-left border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Buyer Login
            </Link>
            <Link
              to="/vendor-login"
              className="flex items-center w-full text-left border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Vendor Login
            </Link>
            <Link
              to="/vendor-signup"
              className="flex items-center w-full text-left bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Store className="h-4 w-4 mr-2" />
              Sell on Coconoto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
