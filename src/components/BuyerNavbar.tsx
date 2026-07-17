import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { X, Menu, LogOut, Store, Package } from 'lucide-react';
import Logo from '../assets/Logo_1.png';

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const buyerName = localStorage.getItem('buyerName') || 'Buyer';
  const initial = buyerName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('buyerId');
    localStorage.removeItem('buyerEmail');
    localStorage.removeItem('buyerName');
    navigate('/buyer-login');
  };

  const linkClass = (to: string) =>
    location.pathname === to
      ? 'text-green-700 font-semibold'
      : 'text-gray-700 hover:text-green-700 font-medium';

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Coconoto" className="h-8 md:h-8" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden focus:outline-none py-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-green-700" />
            ) : (
              <Menu className="h-6 w-6 text-green-700" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/marketplace" className={`flex items-center gap-1.5 ${linkClass('/marketplace')}`}>
              <Store className="h-4 w-4" />
              Marketplace
            </Link>
            <Link to="/buyer-dashboard" className={`flex items-center gap-1.5 ${linkClass('/buyer-dashboard')}`}>
              <Package className="h-4 w-4" />
              My Orders
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white font-bold">
                  {initial}
                </span>
                <span className="text-gray-700 font-medium max-w-[140px] truncate">{buyerName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-gray-300 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-300 transition-colors text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white shadow-md py-4 px-6">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white font-bold">
              {initial}
            </span>
            <span className="text-gray-900 font-semibold truncate">{buyerName}</span>
          </div>
          <Link
            to="/marketplace"
            className={`flex items-center gap-2 py-3 ${linkClass('/marketplace')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Store className="h-4 w-4" />
            Marketplace
          </Link>
          <Link
            to="/buyer-dashboard"
            className={`flex items-center gap-2 py-3 ${linkClass('/buyer-dashboard')}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Package className="h-4 w-4" />
            My Orders
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 mt-2 font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
