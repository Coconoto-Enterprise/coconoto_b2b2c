import React, { Suspense } from 'react';
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
import FloatingChatIcon from './components/FloatingChatIcon';
import {
  ServicesLayout,
  ProductLayout,
  PrivacyPolicy,
  TermsOfService,
  CookiePolicy,
  HelpCenter,
  Contact,
  ProfilePage,
  ProfileLinksPage,
  ProfileDetailPage,
  VintageLogin,
  VintageDashboard,
  TweetitLogin,
  TweetitDashboard,
  BlogHome,
  BlogDetail,
  BlogEditor,
  Marketplace,
  VendorLogin,
  VendorSignup,
  VendorDashboard,
  SellerDashboard,
  BuyerLogin,
  BuyerSignup,
  BuyerDashboard,
  NotFound,
  ServerError,
  RouteFallback,
} from './lazyComponents';
import { MarketplaceAuthProvider } from './context/MarketplaceAuthContext';
import { MarketplaceProtectedRoute } from './components/auth/MarketplaceProtectedRoute';
import { ToastProvider } from './components/ui/toast';

function App() {
  return (
    <BrowserRouter>
      <MarketplaceAuthProvider>
      <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<RouteFallback />}>
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
          <Route path="/vendor-dashboard" element={<MarketplaceProtectedRoute role="vendor"><VendorDashboard /></MarketplaceProtectedRoute>} />
          <Route path="/buyer-login" element={<BuyerLogin />} />
          <Route path="/buyer-signup" element={<BuyerSignup />} />
          <Route path="/buyer-dashboard" element={<MarketplaceProtectedRoute role="buyer"><BuyerDashboard /></MarketplaceProtectedRoute>} />
          {/* Seller dashboard for buyers who have also opted in to sell (single unified login) */}
          <Route path="/seller-dashboard" element={<MarketplaceProtectedRoute role="buyer"><SellerDashboard /></MarketplaceProtectedRoute>} />
          <Route path="/500" element={<ServerError />} />
          {/* Catch-all route for 404 - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </div>
      </ToastProvider>
      </MarketplaceAuthProvider>
    </BrowserRouter>
  );
}

export default App;