import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Process } from './components/Process';
import { ProBuyerRequests } from './components/ProBuyerRequests';
import { PriceExchange } from './components/PriceExchange';
import { CoconotoPay } from './components/CoconotoPay';
import { EscrowService } from './components/EscrowService';
import { CTA } from './components/CTA';
import Footer from './components/Footer';
import { Marketplace } from './components/marketplace/Marketplace';
import { ProductDetails } from './components/marketplace/ProductDetails';
import { RFQList } from './components/marketplace/RFQList';
import { About } from './components/About';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ServicesLayout } from './pages/services/ServicesLayout';
import { EscrowLayout } from './pages/escrow/EscrowLayout';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsOfService from './pages/policies/TermsOfService';
import CookiePolicy from './pages/policies/CookiePolicy';
import { HelpCenter } from './pages/support/HelpCenter';
import { Contact } from './pages/support/Contact';
import Careers from './pages/support/Careers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <main>
                  <Hero />
                  <Features />
                  <Process />
                  <ProBuyerRequests />
                  <PriceExchange />
                  <CoconotoPay />
                  <EscrowService />
                  <CTA />
                </main>
                <Footer />
              </>
            } />
            <Route path="/services/*" element={<ServicesLayout />} />
            <Route path="/escrow/*" element={<EscrowLayout />} />
            <Route path="/marketplace/*" element={<Marketplace />} />
            <Route path="/marketplace/rfqs" element={<RFQList />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            } />
            <Route path="/dashboard/*" element={<DashboardLayout />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;