import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Hero } from './components/Hero';
// The home page IS the Figma "Desktop 42" design now: its navbar, its content
// sections and its footer, wrapped around the site's existing hero. The old
// hand-built home chrome (Navbar / Footer) and topic sections (CocotechRD /
// CococycleHub / CocoConnect / CocoDrinkEat / Features / CTA) are kept on disk
// but are no longer routed.
import FigmaNav from './components/figma/FigmaNav';
import FigmaFooter from './components/figma/FigmaFooter';
import FigmaHomeSections from './components/figma/FigmaHomeSections';
import { navLogo } from './components/figma/homeSectionImages';
import FloatingChatIcon from './components/FloatingChatIcon';
import {
  PrivacyPolicy,
  TermsOfService,
  CookiePolicy,
  HelpCenter,
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
  FigmaAbout,
  FigmaEquipment,
  FigmaCococycleHub,
  FigmaLogin,
  FigmaSignup,
  FigmaContact,
  FigmaBanner,
} from './lazyComponents';
import { MarketplaceAuthProvider } from './context/MarketplaceAuthContext';
import { MarketplaceProtectedRoute } from './components/auth/MarketplaceProtectedRoute';
import { ToastProvider } from './components/ui/toast';

/**
 * React Router does not scroll to `#hash` targets. Several links point at a
 * section on *another* page — the nav's "Coco Drink & Eat" goes to
 * `/cococycle-hub#drink-eat` — so without this you land at the top of the page.
 *
 * The offset clears the 72px sticky header, and the retry loop covers the
 * target arriving with its lazily-loaded page. Instant, not smooth: on a fresh
 * navigation an animated scroll from the top just looks like a stall. A click
 * on a link that is *already* on the page is handled in `FigmaNav`, which can
 * scroll smoothly because nothing is loading.
 */
function HashScroller() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'auto',
        });
        return;
      }
      if (++tries < 12) timer = setTimeout(tick, 100);
    };

    timer = setTimeout(tick, 120);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

/**
 * Forwards an old URL onto its new home, keeping any tail path, query string and
 * hash. The pages were renamed from the generic noun they used to sit under to
 * the business unit they actually are — `/services` → `/cocotech`,
 * `/product` → `/cococycle-hub`, `/marketplace` → `/cococonnect` — so anything
 * still holding the old address (a bookmark, a Google result, an email already
 * delivered) has to land somewhere sensible instead of the 404 page.
 *
 * `replace` matters: without it the browser's Back button would bounce the
 * visitor straight back into the redirect and they could never leave.
 */
function LegacyRedirect({ to }: { to: string }) {
  const { pathname, search, hash } = useLocation();
  // Strip the leading segment (`/services`) and re-hang whatever followed it.
  const tail = pathname.replace(/^\/[^/]+/, '');
  return <Navigate to={`${to}${tail}${search}${hash}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <HashScroller />
      <MarketplaceAuthProvider>
      <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Home — the Figma "Desktop 42" page, with the site's own hero in
              place of the Figma hero. `withImages` is what separates this from
              `/figma/home`, which renders the same sections as placeholders. */}
          <Route path="/" element={
            <>
              <FigmaNav active="Home" logoSrc={navLogo} />
              <main>
                <Hero />
                <FigmaHomeSections withImages />
              </main>
              <FigmaFooter />
              <FloatingChatIcon />
            </>
          } />
          {/* ── Figma designs, promoted to the real URLs ─────────────────────
              The Figma frames are no longer a preview harness living under
              /figma/* — they ARE the site. /cocotech, /cococycle-hub,
              /cococonnect, /contact, /login and /signup render them directly,
              and the old /figma/* URLs redirect here so existing links keep
              working. The legacy hand-built pages (ServicesLayout,
              ProductLayout, support/Contact) are kept on disk but no longer
              routed.

              Each page sits under the name of the business unit it belongs to
              rather than the generic noun it happens to be — `/cocotech`, not
              `/services` — because the name is what people actually search for,
              and it is what the sitemap should advertise. */}
          <Route path="/cocotech/*" element={<FigmaEquipment />} />
          <Route path="/cococycle-hub/*" element={<FigmaCococycleHub />} />
          <Route path="/cococonnect" element={<Marketplace />} />
          <Route path="/contact" element={<FigmaContact />} />
          <Route path="/login" element={<FigmaLogin />} />
          <Route path="/signup" element={<FigmaSignup />} />

          <Route path="/blog" element={<BlogHome />} />
          <Route path="/blog/:blogParam" element={<BlogDetail />} />
          <Route path="/blog-editor/:blogId" element={<BlogEditor />} />

          {/* Main About page — the Figma design (FigmaAbout renders its own Navbar + AboutFooter). */}
          <Route path="/about" element={<FigmaAbout />} />

          {/* ── Redirects from the old Figma preview URLs ─────────────────── */}
          <Route path="/figma/about" element={<Navigate to="/about" replace />} />
          <Route path="/figma/home" element={<Navigate to="/" replace />} />
          <Route path="/figma/equipment" element={<Navigate to="/cocotech" replace />} />
          <Route path="/figma/cococycle-hub" element={<Navigate to="/cococycle-hub" replace />} />
          <Route path="/figma/contact" element={<Navigate to="/contact" replace />} />
          <Route path="/figma/login" element={<Navigate to="/login" replace />} />
          <Route path="/figma/signup" element={<Navigate to="/signup" replace />} />

          {/* ── Legacy slugs ────────────────────────────────────────────────
              The generic URLs the three business units used to live under.
              Kept as permanent forwarders rather than deleted: the old addresses
              are indexed by Google and printed in emails that have already gone
              out, so a 404 would cost real traffic. Listed after the real routes
              because React Router ranks by specificity, not source order. */}
          <Route path="/services/*" element={<LegacyRedirect to="/cocotech" />} />
          <Route path="/product/*" element={<LegacyRedirect to="/cococycle-hub" />} />
          <Route path="/marketplace/*" element={<LegacyRedirect to="/cococonnect" />} />

          {/* ── The decorative banner strip ────────────────────────────────
              The `/figma` frame index was a build artefact, not a site page, and
              has been removed — it now falls through to the 404 page. The
              flat-lay artwork frame below is still reachable directly. */}
          <Route path="/figma/banner" element={<FigmaBanner />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/links" element={<ProfileLinksPage />} />
          <Route path="/profile/:profileId" element={<ProfileDetailPage />} />
          <Route path="/vintage" element={<VintageLogin />} />
          <Route path="/vintage-dashboard" element={<VintageDashboard />} />
          <Route path="/tweetit" element={<TweetitLogin />} />
          <Route path="/tweetit-dashboard" element={<TweetitDashboard />} />
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