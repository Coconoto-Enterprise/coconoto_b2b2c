import React from 'react';

export function ServicesHero() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Industrial Solutions for Coconut Processing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete end-to-end solutions for coconut processing, from machinery to facility construction
            and production optimization.
          </p>
          <a 
            href="#contact"
            className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}