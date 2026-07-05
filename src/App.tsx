import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Hero } from './components/Hero';
import { CocotechRD } from './components/CocotechRD';
import { CococycleHub } from './components/CococycleHub';
import { CocoConnect } from './components/CocoConnect';
import { CocoDrinkEat } from './components/CocoDrinkEat';
import { Features } from './components/Features';
import { CTA } from './components/CTA';
import Footer from './components/Footer';
import { About } from './components/About';
import { ServicesLayout } from './pages/services/ServicesLayout';
import { ProductLayout } from './pages/product/ProductLayout';
import PrivacyPolicy from './pages/policies/PrivacyPolicy';
import TermsOfService from './pages/policies/TermsOfService';
import CookiePolicy from './pages/policies/CookiePolicy';
import { HelpCenter } from './pages/support/HelpCenter';
import { Contact } from './pages/support/Contact';
import ProfilePage from './pages/Profile';
import ProfileLinksPage from './pages/ProfileLinks';
import ProfileDetailPage from './pages/ProfileDetail';
import VintageLogin from './pages/VintageLogin';
import VintageDashboard from './pages/VintageDashboard';
import TweetitLogin from './pages/TweetitLogin';
import TweetitDashboard from './pages/TweetitDashboard';
import FloatingChatIcon from './components/FloatingChatIcon';
import BlogHome from './pages/blog/BlogHome';
import BlogDetail from './pages/blog/BlogDetail';
import BlogEditor from './components/blog/BlogEditor';
import { Marketplace } from './pages/vendor/Marketplace';
import { VendorLogin } from './pages/vendor/VendorLogin';
import { VendorSignup } from './pages/vendor/VendorSignup';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { BuyerLogin } from './pages/buyer/BuyerLogin';
import { BuyerSignup } from './pages/buyer/BuyerSignup';
import { BuyerDashboard } from './pages/buyer/BuyerDashboard';
import { NotFound } from './pages/errors/NotFound';
import { ServerError } from './pages/errors/ServerError';

function App() {
  return (
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
              <FloatingChatIcon />
            </>
          } />
          <Route path="/services/*" element={<ServicesLayout />} />
          <Route path="/product/*" element={<ProductLayout />} />
          <Route path="/blog" element={<BlogHome />} />
          <Route path="/blog/:blogId" element={<BlogDetail />} />
          <Route path="/blog-editor/:blogId" element={<BlogEditor />} />
          <Route path="/about" element={
            <>
              <Navbar />
              <About />
              <Footer />
            </>
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/links" element={<ProfileLinksPage />} />
          <Route path="/profile/:profileId" element={<ProfileDetailPage />} />
          <Route path="/vintage" element={<VintageLogin />} />
          <Route path="/vintage-dashboard" element={<VintageDashboard />} />
          <Route path="/tweetit" element={<TweetitLogin />} />
          <Route path="/tweetit-dashboard" element={<TweetitDashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/vendor-signup" element={<VendorSignup />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/buyer-signup" element={<BuyerSignup />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/500" element={<ServerError />} />
          {/* Catch-all route for 404 - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;