import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  CreditCard, 
  Settings,
  Package,
  History,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function DashboardSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const buyerLinks = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: ShoppingBag, label: 'My Orders', path: '/dashboard/orders' },
    { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
  ];

  const sellerLinks = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: History, label: 'Orders History', path: '/dashboard/orders' },
    { icon: Users, label: 'Customers', path: '/dashboard/customers' },
    { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
  ];

  const merchantLinks = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: Package, label: 'Products', path: '/dashboard/products' },
    { icon: ShoppingBag, label: 'My Orders', path: '/dashboard/orders' },
    { icon: History, label: 'Order History', path: '/dashboard/order-history' },
    { icon: FileText, label: 'Invoices', path: '/dashboard/invoices' },
    { icon: CreditCard, label: 'Payments', path: '/dashboard/payments' },
    { icon: Users, label: 'Customers', path: '/dashboard/customers' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
  ];

  const getLinks = () => {
    switch (user?.accountType) {
      case 'buyer':
        return buyerLinks;
      case 'seller':
        return sellerLinks;
      case 'merchant':
        return merchantLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <div className="w-64 bg-white h-screen shadow-sm">
      <div className="p-4">
        <div className="px-4 py-2 mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase">Menu</h2>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}