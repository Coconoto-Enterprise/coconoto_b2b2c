import React from 'react';

export function CTA() {
  return (
    <section className="py-20 bg-green-700">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses already trading on Coconoto. Start your journey today
          and discover new opportunities for growth.
        </p>
        <button className="bg-white text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition">
          Join Coconoto Now
        </button>
      </div>
    </section>
  );
}