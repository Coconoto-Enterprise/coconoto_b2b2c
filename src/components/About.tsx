import React from 'react';

export function About() {
  return (
    <div className="py-20 bg-gray-50">
      {/* About Section - Fancy Green Background */}
      <div className="relative bg-green-700 text-white py-16 text-center rounded-xl shadow-lg mx-4 md:mx-auto max-w-5xl">
        <div className="absolute inset-0 bg-green-900 opacity-30 rounded-xl"></div>
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">About <span className="text-green-300">Coconoto</span></h1>
          <p className="text-xl max-w-2xl mx-auto text-green-100 leading-relaxed">
            Coconoto is the premier B2B marketplace dedicated to the coconut value chain, 
            connecting suppliers, buyers, and service providers worldwide.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-6 mt-16 grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">🌍 Our Mission</h2>
          <p className="text-gray-600">
            To revolutionize the coconut trade industry by providing a secure, 
            efficient, and transparent platform for businesses to connect and trade globally.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md transition duration-300 hover:shadow-lg">
          <h2 className="text-3xl font-semibold text-green-700 mb-4">🚀 Our Vision</h2>
          <p className="text-gray-600">
            To become the world's leading digital ecosystem for the coconut industry, 
            driving innovation and sustainable growth across the value chain.
          </p>
        </div>
      </div>

      {/* What Sets Us Apart */}
      <div className="bg-green-100 rounded-xl p-12 mt-16 container mx-auto px-6 shadow-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">✨ What Sets Us Apart</h2>
        <ul className="space-y-6 text-gray-700 max-w-2xl mx-auto">
          {[
            "Specialized focus on the coconut industry",
            "Integrated financial and escrow services",
            "Verified business network",
            "End-to-end trade solutions"
          ].map((item, index) => (
            <li key={index} className="flex items-center space-x-3">
              <span className="text-green-600 text-xl">✔</span>
              <span className="text-lg">{item}</span>
            </li>
          ))}
        </ul>
      </div>


      {/* Call to Action */}
      <div className="container mx-auto px-6 mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Network</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          Whether you're a supplier, buyer, or service provider in the coconut industry, 
          Coconoto provides the tools and network you need to grow your business.
        </p>
        <button className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-green-800 transition">
          Get Started Today
        </button>
      </div>
    </div>
  );
}
