import React from 'react';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Overview() {
  const { user } = useAuth();
  const isSeller = user?.accountType === 'seller';

  const stats = isSeller ? [
    { label: 'Total Sales', value: '$12,345', icon: DollarSign, trend: '+12%' },
    { label: 'Active Products', value: '24', icon: Package, trend: '+3' },
    { label: 'Pending Orders', value: '8', icon: ShoppingCart, trend: '-2' },
    { label: 'Monthly Growth', value: '23%', icon: TrendingUp, trend: '+5%' }
  ] : [
    { label: 'Total Spent', value: '$8,234', icon: DollarSign, trend: '+8%' },
    { label: 'Orders Placed', value: '12', icon: ShoppingCart, trend: '+2' },
    { label: 'Active Orders', value: '3', icon: Package, trend: '0' },
    { label: 'Saved Items', value: '15', icon: TrendingUp, trend: '+3' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icon className="h-6 w-6 text-green-600" />
                </div>
                <span className={`text-sm ${
                  stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium">
                  {isSeller ? 'New order received' : 'Order placed'} #{1000 + index}
                </p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="text-green-600 font-medium">${(150 * (index + 1)).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}