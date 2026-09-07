import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '../../assets/Logo_1.png';

interface NavItem {
  label: string;
  to: string;
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services', hasDropdown: true },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact us', to: '/contact' },
];

function navClass({ isActive }: { isActive: boolean }) {
  return [
    'flex items-center gap-1 pb-1 border-b-2 text-sm md:text-base transition-colors',
    isActive
      ? 'text-green-700 border-green-600'
      : 'text-gray-700 border-transparent hover:text-green-700 hover:border-green-600',
  ].join(' ');
}

export default function AboutNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Primary"
      className="bg-white fixed w-full top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-center shrink-0"
          >
            <img src={Logo} alt="Coconoto" className="h-8" />
          </Link>

          <button
            className="lg:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? (
              <X className="h-6 w-6 text-green-700" />
            ) : (
              <Menu className="h-6 w-6 text-green-700" />
            )}
          </button>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => window.scrollTo(0, 0)}
                className={navClass}
              >
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Link
              to="/buyer-login"
              onClick={() => window.scrollTo(0, 0)}
              className="text-sm md:text-base text-gray-700 hover:text-green-700"
            >
              Log in
            </Link>
            <Link
              to="/buyer-signup"
              onClick={() => window.scrollTo(0, 0)}
              className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base px-4 py-2 rounded-lg font-medium transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white shadow-md px-6 py-4 border-t border-gray-100">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => {
                setOpen(false);
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) =>
                `block py-2 ${
                  isActive ? 'text-green-700 font-semibold' : 'text-gray-700 hover:text-green-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/buyer-login"
            onClick={() => {
              setOpen(false);
              window.scrollTo(0, 0);
            }}
            className="block py-2 text-gray-700 hover:text-green-700"
          >
            Log in
          </Link>
          <Link
            to="/buyer-signup"
            onClick={() => {
              setOpen(false);
              window.scrollTo(0, 0);
            }}
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg mt-2 font-medium"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}