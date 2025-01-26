import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MarketplaceEscrow() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-green-600" />
                <h3 className="text-2xl font-bold">Trade with Confidence</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Use Coconoto's Escrow Service to ensure secure transactions. Your payment is protected
                until you receive and verify your products.
              </p>
              <ul className="space-y-3">
                {[
                  'Secure payment protection',
                  'Product verification period',
                  'Dispute resolution support',
                  'No hidden fees'
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 text-center">
              <div className="bg-green-50 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-green-800 mb-2">
                  Start Trading Securely Today
                </h4>
                <p className="text-green-600 mb-4">
                  Join thousands of satisfied traders using our escrow service
                </p>
                <Link 
                  to="/#escrow-service"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition"
                >
                  Get Started with Escrow
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}