import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, AlertCircle } from 'lucide-react';

const buyerRequests = [
  {
    id: 1,
    product: 'Coconut Oil',
    quantity: '50,000',
    unit: 'litres',
    price: 100,
    location: 'Dubai, UAE',
    urgent: true,
    deadline: '2023-12-15'
  },
  {
    id: 2,
    product: 'Raw Coconuts',
    quantity: '100',
    unit: '40ft containers',
    price: 25000,
    location: 'Mumbai, India',
    urgent: true,
    deadline: '2023-12-20'
  },
  {
    id: 3,
    product: 'Cocopeat',
    quantity: '1,000',
    unit: 'tons',
    price: 4000,
    location: 'Mombasa, Kenya',
    urgent: false,
    deadline: '2023-12-30'
  },
  {
    id: 4,
    product: 'Virgin Coconut Oil',
    quantity: '20,000',
    unit: 'litres',
    price: 150,
    location: 'Rotterdam, Netherlands',
    urgent: true,
    deadline: '2023-12-25'
  },
  {
    id: 5,
    product: 'Coconut Shell Charcoal',
    quantity: '500',
    unit: 'tons',
    price: 800,
    location: 'Shanghai, China',
    urgent: false,
    deadline: '2024-01-05'
  }
];

export function ProBuyerRequests() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-6 w-6 text-green-700" />
              <h2 className="text-3xl font-bold text-gray-900">Coconoto Pro</h2>
            </div>
            <p className="text-gray-600">Hot buyer requests from verified businesses</p>
          </div>
          <Link
            to="/marketplace"
            className="hidden md:block text-green-700 font-semibold hover:text-green-800"
          >
            View All Requests →
          </Link>
        </div>

        <div className="grid gap-6">
          {buyerRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg shadow-md p-6 transition hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">{request.product}</h3>
                    {request.urgent && (
                      <span className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                    <div>
                      <span className="font-medium">Quantity: </span>
                      {request.quantity} {request.unit}
                    </div>
                    <div>
                      <span className="font-medium">Price: </span>
                      ${request.price} per {request.unit.replace(/s$/, '')}
                    </div>
                    <div>
                      <span className="font-medium">Location: </span>
                      {request.location}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    <span className="block">Deadline</span>
                    <span className="font-medium">{new Date(request.deadline).toLocaleDateString()}</span>
                  </div>
                  <Link
                    to="/marketplace"
                    className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition whitespace-nowrap"
                  >
                    Supply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/marketplace"
            className="text-green-700 font-semibold hover:text-green-800"
          >
            View All Requests →
          </Link>
        </div>
      </div>
    </section>
  );
}