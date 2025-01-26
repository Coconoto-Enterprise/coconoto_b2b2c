import React from 'react';

export function About() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Coconoto</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Coconoto is the premier B2B marketplace dedicated to the coconut value chain,
            connecting suppliers, buyers, and service providers worldwide.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To revolutionize the coconut trade industry by providing a secure,
                efficient, and transparent platform for businesses to connect and trade globally.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To become the world's leading digital ecosystem for the coconut industry,
                driving innovation and sustainable growth across the value chain.
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">•</span>
                <span>Specialized focus on the coconut industry</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">•</span>
                <span>Integrated financial and escrow services</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">•</span>
                <span>Verified business network</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">•</span>
                <span>End-to-end trade solutions</span>
              </li>
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
                <p className="text-gray-600">
                  Connect with verified buyers and suppliers across the coconut value chain.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">CoconotoPay</h3>
                <p className="text-gray-600">
                  Secure payment solutions designed for international trade.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Escrow Service</h3>
                <p className="text-gray-600">
                  Protected transactions for peace of mind in every trade.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Network</h2>
            <p className="text-gray-600 mb-6">
              Whether you're a supplier, buyer, or service provider in the coconut industry,
              Coconoto provides the tools and network you need to grow your business.
            </p>
            <button className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}