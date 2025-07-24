import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MarketplaceBanner() {
  return (
    <div>
      {/* <div className="bg-gradient-to-r from-green-700 to-green-600 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Wallet className="h-8 w-8 mr-3" />
              <div>
                <h3 className="text-xl font-bold">CoconotoPay</h3>
                <p className="text-green-100">Secure payments for coconut traders worldwide</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-green-100">Save up to 80% on transaction fees</span>
              <Link 
                to="/#coconoto-pay"
                className="flex items-center bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-50 transition"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}