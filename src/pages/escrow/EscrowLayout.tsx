import React from 'react';
import { EscrowNavbar } from './EscrowNavbar';
import { EscrowHero } from './EscrowHero';
import { EscrowFeatures } from './EscrowFeatures';
import { EscrowProcess } from './EscrowProcess';
import { EscrowPricing } from './EscrowPricing';
import { EscrowTestimonials } from './EscrowTestimonials';
import EscrowCTA from './EscrowCTA';
import EscrowFooter from './EscrowFooter';

export function EscrowLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EscrowNavbar />
      <main>
        <EscrowHero />
        <EscrowFeatures />
        <EscrowProcess />
        <EscrowPricing />
        <EscrowTestimonials />
        <EscrowCTA />
      </main>
      <EscrowFooter />
    </div>
  );
}