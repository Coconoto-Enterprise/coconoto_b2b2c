import React, { useState } from 'react';
import { WaitlistModal } from './WaitlistModal';

export function CTA() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  return (
    <section className="py-20 bg-green-700">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">
          Ready to Transform Your Coconut Experience?
        </h2>
        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
          Empower your coconut business with Coconoto machines, products, and access to help you grow Globally.
        </p>
        <button 
          className="bg-white text-green-700 px-8 py-2 rounded-full text-lg font-semibold hover:bg-green-50 transition"
          onClick={() => setIsWaitlistModalOpen(true)}
        >
          Join Waitlist
        </button>
      </div>
      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} />
    </section>
  );
}