import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { GiCoconuts } from 'react-icons/gi';
import { WaitlistModal } from '../../components/WaitlistModal';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/Logo_1.png';

export function ProductHeader() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();


  const openWaitlistModal = () => {
    setIsWaitlistModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'machines', label: 'Machines' },
    { id: 'building', label: 'Building' },
    { id: 'production', label: 'Production' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center"
              onClick={closeMobileMenu}
            >
              <img src={Logo} alt="Coconoto" className="h-8 md:h-8" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden focus:outline-none"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-green-700" />
              ) : (
                <GiCoconuts className="h-6 w-6 text-green-700" />
              )}
            </button>

            {/* Desktop Navigation - Updated to match original Navbar link styles */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-gray-600 hover:text-green-700" // Removed extra classes to match original
                >
                  {item.label}
                </a>
              ))}
              {user ? (
                <Link to="/dashboard" className="text-gray-600 hover:text-green-700">
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={openWaitlistModal}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Join Waitlist
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Menu - Updated to match original Navbar link styles */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md py-4 px-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block py-2 text-gray-600 hover:text-green-700"
                onClick={closeMobileMenu}
              >
                {item.label}
              </a>
            ))}
            {user ? (
              <Link 
                to="/dashboard" 
                className="block py-2 text-gray-600 hover:text-green-700"
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
            ) : (
              <button
                onClick={openWaitlistModal}
                className="block w-full text-left bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-2"
              >
                Join Waitlist
              </button>
            )}
          </div>
        )}
      </header>

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </>
  );
}