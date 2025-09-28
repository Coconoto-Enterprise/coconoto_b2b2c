import React from 'react';
import { ProductHeader } from './ProductHeader';
import { ProductHero } from './ProductHero';
import { ProductsList } from './products/ProductsList';
import { BuildingSection } from './building/BuildingSection';
import { ProductionSection } from './production/ProductionSection';
import { InvestmentSection } from './investment/InvestmentSection';
import { CertificatesSection } from './certificates/CertificatesSection';
import { ProductContact } from './ProductContact';
import { ProductFooter } from './ProductFooter';

export function ProductLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProductHeader />
      <main>
        <ProductsList />
        <BuildingSection />
        <ProductionSection />
        <CertificatesSection />
        <ProductContact />
      </main>
      <ProductFooter />
    </div>
  );
}