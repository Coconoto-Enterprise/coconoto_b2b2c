import React from 'react';
import { ServicesHeader } from './ServicesHeader';
import { ServicesHero } from './ServicesHero';
import { MachinesList } from './machines/MachinesList';
import { ProductsList } from './products/ProductsList';
import { BuildingSection } from './building/BuildingSection';
import { ProductionSection } from './production/ProductionSection';
import { InvestmentSection } from './investment/InvestmentSection';
import { CertificatesSection } from './certificates/CertificatesSection';
import { ServicesContact } from './ServicesContact';
import { ServicesFooter } from './ServicesFooter';

export function ServicesLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ServicesHeader />
      <main>
        <MachinesList />
        <ProductsList />
        <BuildingSection />
        <ProductionSection />
        <CertificatesSection />
        <ServicesContact />
      </main>
      <ServicesFooter />
    </div>
  );
}