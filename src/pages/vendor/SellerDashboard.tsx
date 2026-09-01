import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SellerProductsPanel } from '@/components/SellerProductsPanel';

/**
 * Dedicated seller dashboard, reached from the user dropdown or
 * legacy deep links. Buyers who have also opted in to sell (single
 * unified login) can also reach the same panel via the "Seller
 * Dashboard" tab inside `/buyer-dashboard` so the sidebar stays visible.
 */
export function SellerDashboard() {
  const { session } = useMarketplaceAuth();
  const isSeller = !!session?.isSeller;

  if (!isSeller) {
    return <NotSeller />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="text-emerald-700">
            <Link to="/buyer-dashboard" state={{ tab: 'seller-dashboard' }}>
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
        <SellerProductsPanel />
      </main>
    </div>
  );
}

function NotSeller() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-emerald-50/60 to-white p-6">
      <Card className="max-w-md text-center">
        <CardContent className="space-y-4 py-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h2 className="text-xl font-bold text-gray-900">Become a seller on Coconoto</h2>
          <p className="text-sm text-gray-600">
            Open the buyer dashboard and use the "Sell on Coconoto" tab to upgrade your account,
            then come back here to manage your products.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link to="/buyer-dashboard" state={{ tab: 'sell' }}>
                Open buyer dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
