import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  X, Menu, Store, Package, User, LogOut, ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import Logo from '../assets/Logo_1.png';
import { useMarketplaceAuth } from '../context/MarketplaceAuthContext';

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, session } = useMarketplaceAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const buyerName =
    session?.role === 'buyer' ? session.name : localStorage.getItem('buyerName') || 'Buyer';
  const initials = buyerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'B';

  const isSeller = !!session?.isSeller;

  // Close user menu on outside click / Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    navigate('/buyer-login');
  };

  const linkClass = (to: string) =>
    location.pathname === to
      ? 'text-emerald-700 font-semibold'
      : 'text-gray-700 hover:text-emerald-700 font-medium';

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/70 bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Coconoto" className="h-8 md:h-8" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-emerald-700" />
            ) : (
              <Menu className="h-6 w-6 text-emerald-700" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/marketplace"
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${linkClass('/marketplace')}`}
            >
              <Store className="h-4 w-4" />
              Marketplace
            </Link>

            {/* User dropdown */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="hidden xl:inline max-w-[140px] truncate text-sm">{buyerName}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-xl animate-fade-in"
                >
                  {/* User card */}
                  <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 to-white px-4 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{buyerName}</p>
                      <p className="truncate text-xs text-gray-500">{session?.email || 'Buyer account'}</p>
                    </div>
                  </div>

                  <div className="py-1">
                    <MenuLink
                      icon={Package}
                      label="My Orders"
                      description="Track your purchases"
                      onClick={() => { setUserMenuOpen(false); navigate('/buyer-dashboard'); }}
                    />
                    <MenuLink
                      icon={User}
                      label="Profile"
                      description="Personal details"
                      onClick={() => { setUserMenuOpen(false); navigate('/buyer-dashboard'); }}
                    />
                    {isSeller && (
                      <>
                        <div className="my-1 mx-3 border-t border-gray-100" />
                        <div className="px-4 pb-1 pt-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                            Selling on Coconoto
                          </p>
                        </div>
                        <MenuLink
                          icon={LayoutDashboard}
                          label="Seller Dashboard"
                          description="Manage your products"
                          onClick={() => { setUserMenuOpen(false); navigate('/seller-dashboard'); }}
                        />
                      </>
                    )}
                    <div className="my-1 mx-3 border-t border-gray-100" />
                    <MenuLink
                      icon={LogOut}
                      label="Sign out"
                      danger
                      onClick={handleLogout}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{buyerName}</p>
              <p className="truncate text-xs text-gray-500">{session?.email || 'Buyer account'}</p>
            </div>
          </div>

          <nav className="mt-3 space-y-1">
            <MobileLink
              to="/marketplace"
              icon={Store}
              label="Marketplace"
              active={location.pathname === '/marketplace'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileLink
              to="/buyer-dashboard"
              icon={Package}
              label="My Orders"
              active={location.pathname === '/buyer-dashboard'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <MobileLink
              to="/buyer-dashboard"
              icon={User}
              label="Profile"
              active={location.pathname === '/buyer-dashboard'}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {isSeller && (
              <MobileLink
                to="/seller-dashboard"
                icon={LayoutDashboard}
                label="Seller Dashboard"
                active={location.pathname === '/seller-dashboard'}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}
            <div className="my-2 border-t border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </div>
      )}
    </nav>
  );
}

function MenuLink({
  icon: Icon, label, description, danger, onClick
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
        danger
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-gray-700 hover:bg-emerald-50/60'
      }`}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${
        danger ? 'bg-rose-100/80 text-rose-600' : 'bg-emerald-100/80 text-emerald-700'
      }`}>
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1">
        <span className="block font-medium">{label}</span>
        {description && (
          <span className="block text-[11px] text-gray-500">{description}</span>
        )}
      </span>
    </button>
  );
}

function MobileLink({
  to, icon: Icon, label, active, onClick
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
        active
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
