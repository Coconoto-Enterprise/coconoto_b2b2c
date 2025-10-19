import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Hero } from './components/Hero';
import { CocotechRD } from './components/CocotechRD';
import { CococycleHub } from './components/CococycleHub';
import { CocoConnect } from './components/CocoConnect';
import { CocoDrinkEat } from './components/CocoDrinkEat';
import { Features } from './components/Features';
import { CTA } from './components/CTA';
import Footer from './components/Footer';
import { Marketplace } from './components/marketplace/Marketplace';
import { ProductDetails } from './components/marketplace/ProductDetails';
import { RFQList } from './components/marketplace/RFQList';
import { About } from './components/About';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ServicesLayout } from './pages/services/ServicesLayout';
import { ProductLayout } from './pages/product/ProductLayout';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsOfService from './pages/policies/TermsOfService';
import CookiePolicy from './pages/policies/CookiePolicy';
import { HelpCenter } from './pages/support/HelpCenter';
import { Contact } from './pages/support/Contact';
import VintageLogin from './pages/VintageLogin';
import VintageDashboard from './pages/VintageDashboard';

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
                  <CocotechRD />
                  <CococycleHub />
                  <CocoConnect />
                  <CocoDrinkEat />
                  <Features />
                  <CTA />
                </main>
                <Footer />
              </>
            } />
            <Route path="/services/*" element={<ServicesLayout />} />
            <Route path="/product/*" element={<ProductLayout />} />
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
            <Route path="/vintage" element={<VintageLogin />} />
            <Route path="/vintage-dashboard" element={<VintageDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
