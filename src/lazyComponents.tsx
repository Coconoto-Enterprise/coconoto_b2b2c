import { lazy } from 'react';

/**
 * Route-level code splitting.
 *
 * Every page-level component used by <App/> is loaded lazily so Vite emits a
 * separate chunk per route instead of bundling the entire app into one blob.
 * This is what silences the ">500 kB chunk" warning and trims first-paint JS.
 *
 * React.lazy requires a *default* export, so:
 *  - default-export pages are lazy()'d directly
 *  - named-export pages remap via .then(m => ({ default: m.Name }))
 */

// --- Default-export pages (lazy directly) ---
export const PrivacyPolicy = lazy(() => import('./pages/policies/PrivacyPolicy'));
export const TermsOfService = lazy(() => import('./pages/policies/TermsOfService'));
export const CookiePolicy = lazy(() => import('./pages/policies/CookiePolicy'));
export const ProfilePage = lazy(() => import('./pages/Profile'));
export const ProfileLinksPage = lazy(() => import('./pages/ProfileLinks'));
export const ProfileDetailPage = lazy(() => import('./pages/ProfileDetail'));
export const VintageLogin = lazy(() => import('./pages/VintageLogin'));
export const VintageDashboard = lazy(() => import('./pages/VintageDashboard'));
export const TweetitLogin = lazy(() => import('./pages/TweetitLogin'));
export const TweetitDashboard = lazy(() => import('./pages/TweetitDashboard'));
export const NotFound = lazy(() => import('./pages/errors/NotFound'));
export const ServerError = lazy(() => import('./pages/errors/ServerError'));
export const BlogHome = lazy(() => import('./pages/blog/BlogHome'));
export const BlogDetail = lazy(() => import('./pages/blog/BlogDetail'));
export const BlogEditor = lazy(() => import('./components/blog/BlogEditor'));

// --- Named-export pages (remap to default for React.lazy) ---
export const ServicesLayout = lazy(() =>
  import('./pages/services/ServicesLayout').then((m) => ({ default: m.ServicesLayout })),
);
export const ProductLayout = lazy(() =>
  import('./pages/product/ProductLayout').then((m) => ({ default: m.ProductLayout })),
);
export const HelpCenter = lazy(() =>
  import('./pages/support/HelpCenter').then((m) => ({ default: m.HelpCenter })),
);
export const Contact = lazy(() =>
  import('./pages/support/Contact').then((m) => ({ default: m.Contact })),
);
export const Marketplace = lazy(() =>
  import('./pages/vendor/Marketplace').then((m) => ({ default: m.Marketplace })),
);
export const VendorLogin = lazy(() =>
  import('./pages/vendor/VendorLogin').then((m) => ({ default: m.VendorLogin })),
);
export const VendorSignup = lazy(() =>
  import('./pages/vendor/VendorSignup').then((m) => ({ default: m.VendorSignup })),
);
export const VendorDashboard = lazy(() =>
  import('./pages/vendor/VendorDashboard').then((m) => ({ default: m.VendorDashboard })),
);
export const SellerDashboard = lazy(() =>
  import('./pages/vendor/SellerDashboard').then((m) => ({ default: m.SellerDashboard })),
);
export const BuyerLogin = lazy(() =>
  import('./pages/buyer/BuyerLogin').then((m) => ({ default: m.BuyerLogin })),
);
export const BuyerSignup = lazy(() =>
  import('./pages/buyer/BuyerSignup').then((m) => ({ default: m.BuyerSignup })),
);
export const BuyerDashboard = lazy(() =>
  import('./pages/buyer/BuyerDashboard').then((m) => ({ default: m.BuyerDashboard })),
);

/** Lightweight spinner shown while a route chunk loads. */
export function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#8CC63F]" />
    </div>
  );
}
