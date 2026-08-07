import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useMarketplaceAuth, MarketplaceRole } from '../../context/MarketplaceAuthContext';

export function MarketplaceProtectedRoute({ role, children }: { role: MarketplaceRole; children: React.ReactNode }) {
  const { session, loading } = useMarketplaceAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50/40 flex items-center justify-center">
        <div className="rounded-2xl bg-white border border-emerald-100 p-6 shadow-sm text-center">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-700 mx-auto" />
          <p className="mt-3 text-sm text-gray-600">Restoring your secure session...</p>
        </div>
      </div>
    );
  }

  if (!session || session.role !== role) {
    const loginPath = role === 'buyer' ? '/buyer-login' : '/vendor-login';
    return <Navigate to={`${loginPath}?returnTo=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return <>{children}</>;
}
