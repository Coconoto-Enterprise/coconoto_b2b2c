import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const orders = [
  {
    id: 'ORD-001',
    product: 'Fresh Young Coconuts',
    quantity: 500,
    total: 750.00,
    status: 'Processing',
    date: '2023-12-01',
    seller: 'Kerala Coconut Farms'
  },
  {
    id: 'ORD-002',
    product: 'Virgin Coconut Oil',
    quantity: 200,
    total: 2598.00,
    status: 'Shipped',
    date: '2023-11-28',
    seller: 'Ceylon Organics'
  },
  {
    id: 'ORD-003',
    product: 'Coir Fiber',
    quantity: 1000,
    total: 2990.00,
    status: 'Delivered',
    date: '2023-11-25',
    seller: 'Tamil Coir Industries'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Processing':
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case 'Shipped':
      return <Truck className="h-5 w-5 text-blue-500" />;
    case 'Delivered':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />;
  }
};

export function MyOrders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Orders</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Track Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(order.status)}
                      <span className="ml-2 text-sm text-gray-500">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.seller}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-green-600 hover:text-green-700">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}