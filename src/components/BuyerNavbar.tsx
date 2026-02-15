import { Link, useNavigate } from 'react-router-dom';
import { Palmtree } from 'lucide-react';

export default function BuyerNavbar() {
  const navigate = useNavigate();
  const buyerName = localStorage.getItem('buyerName') || 'Buyer';

  const handleLogout = () => {
    localStorage.removeItem('buyerId');
    localStorage.removeItem('buyerEmail');
    localStorage.removeItem('buyerName');
    navigate('/buyer-login');
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Palmtree className="h-8 w-8 text-green-700" />
            <span className="text-xl font-bold text-gray-900">COCONOTO</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <Link 
              to="/marketplace" 
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              Marketplace
            </Link>
            <Link 
              to="/buyer-dashboard" 
              className="text-gray-700 hover:text-green-700 font-medium"
            >
              My Orders
            </Link>
            
            {/* User Dropdown */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Hello, <span className="font-semibold">{buyerName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
