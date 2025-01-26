import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

// Sample customer data - in a real app, this would come from your backend
const customers = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Global Foods Inc.',
    email: 'john@globalfoods.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    orders: 12,
    totalSpent: 15420
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Organic Imports Ltd.',
    email: 'sarah@organicimports.com',
    phone: '+1 345 678 9012',
    location: 'London, UK',
    orders: 8,
    totalSpent: 9840
  }
];

export function CustomerList() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search customers..."
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="all">All Customers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{customer.name}</h3>
                <p className="text-gray-600 mb-4">{customer.company}</p>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{customer.location}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                <div className="text-sm text-gray-500 mb-1">
                  Total Orders: <span className="font-medium text-gray-900">{customer.orders}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Total Spent: <span className="font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</span>
                </div>
                <button className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}