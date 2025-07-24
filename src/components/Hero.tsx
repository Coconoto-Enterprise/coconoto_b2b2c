import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Coconoto B2B2C Marketplace Experience
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The one stop marketplace for suppliers and buyers within the coconut value chain. 
            Take advantage of Coconoto's innovative approach streamlined to grow your business.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/marketplace"
              className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition"
            >
              Get Started
            </Link>
            <Link 
              to="/about"
              className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}