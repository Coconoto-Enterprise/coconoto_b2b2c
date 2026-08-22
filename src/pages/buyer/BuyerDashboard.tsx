import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getBuyerProfile, getBuyerOrders, updateBuyerProfile, buyerBecomeSeller } from '../../services/buyerService';
import type { Buyer, BuyerOrder, BuyerUpdateInput } from '../../types/buyer';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter
} from '@/components/ui/sidebar-lite';
import { Sheet, SheetHeader, SheetClose, SheetTitle } from '@/components/ui/sheet';
import {
  ShoppingBag, User, Store, LogOut, Menu, Pencil, Mail, Phone, Loader2, CheckCircle2,
  LayoutDashboard, ChevronRight, MapPin, CalendarDays, Package, ArrowRight, Star
} from 'lucide-react';

type Tab = 'orders' | 'profile' | 'sell';

const TAB_LABELS: Record<Tab, string> = {
  orders: 'My Orders',
  profile: 'Profile',
  sell: 'Sell on Coconoto',
};

export function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { session, logout, refreshSession } = useMarketplaceAuth();
  const buyerId = session?.role === 'buyer' ? session.id : localStorage.getItem('buyerId');
  const buyerName =
    session?.role === 'buyer' ? session.name : localStorage.getItem('buyerName') || 'Buyer';
  const initials = buyerName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'B';

  // Honor the optional `state.tab` hint from link navigations (e.g. the user
  // dropdown's "Profile" link). Keeps everything on a single URL.
  useEffect(() => {
    const state = (location.state as { tab?: Tab } | null);
    if (state?.tab && (state.tab === 'orders' || state.tab === 'profile' || state.tab === 'sell')) {
      setActiveTab(state.tab);
      // Clear the state so subsequent back/forward doesn't keep snapping to it.
      navigate(location.pathname, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!buyerId) {
      navigate('/buyer-login');
      return;
    }
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerId, navigate]);

  const loadDashboardData = async () => {
    if (!buyerId) return;
    setIsLoading(true);
    const [buyerData, ordersData] = await Promise.all([
      getBuyerProfile(buyerId),
      getBuyerOrders(buyerId)
    ]);
    setBuyer(buyerData);
    setOrders(ordersData);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 ring-1 ring-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 ring-1 ring-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-800 ring-1 ring-purple-200';
      case 'shipped': return 'bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 ring-1 ring-rose-200';
      default: return 'bg-gray-100 text-gray-800 ring-1 ring-gray-200';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/buyer-login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50/40 via-white to-white">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-emerald-100 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-700 mx-auto" />
          <p className="mt-3 text-sm text-gray-600">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50/40 via-white to-white">
        <p className="text-muted-foreground">Failed to load buyer data</p>
      </div>
    );
  }

  const navItems = [
    { key: 'orders' as const, label: 'My Orders', icon: ShoppingBag, description: 'Track your purchases' },
    { key: 'profile' as const, label: 'Profile', icon: User, description: 'Personal & contact details' },
    { key: 'sell' as const, label: 'Sell on Coconoto', icon: Store, description: 'Manage products you sell' }
  ];

  const stats = {
    totalOrders: orders.length,
    pending: orders.filter((o) => o.status === 'pending' || o.status === 'processing').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    spent: orders.reduce((sum, o) => sum + (o.total_price ?? 0), 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-gray-50/60">
      {/* Desktop sidebar */}
      <Sidebar className="bg-gradient-to-b from-white via-emerald-50/40 to-white">
        <SidebarHeader className="border-b border-gray-200/60 px-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold shadow-md shadow-emerald-500/20">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">{buyerName}</p>
              <p className="truncate text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                {session?.isSeller ? 'Buyer · Seller' : 'Buyer account'}
              </p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-5 space-y-5">
          <NavGroup label="Account">
            {navItems.map(({ key, label, icon: Icon, description }) => (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  isActive={activeTab === key}
                  onClick={() => setActiveTab(key)}
                  className={`relative rounded-xl px-3 py-2.5 text-sm transition-all ${
                    activeTab === key
                      ? 'bg-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-100 text-emerald-800'
                      : 'text-gray-700 hover:bg-white/70'
                  }`}
                >
                  {activeTab === key && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500" />
                  )}
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      activeTab === key
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-semibold">{label}</span>
                    <span className="block truncate text-[11px] font-normal text-gray-500">
                      {description}
                    </span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </NavGroup>

          {session?.isSeller && (
            <NavGroup label="Selling">
              <SidebarMenuItem>
                <a
                  href="/seller-dashboard"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-white/70 transition-all"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <LayoutDashboard className="h-4 w-4" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-semibold">Seller Dashboard</span>
                    <span className="block truncate text-[11px] font-normal text-gray-500">
                      Manage your products
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
              </SidebarMenuItem>
            </NavGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-200/60 bg-white/50 p-3 space-y-2">
          <Button variant="outline" className="w-full justify-center" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full justify-center text-emerald-700 hover:text-emerald-800">
            <Link to="/marketplace">Browse Marketplace</Link>
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-xs font-bold">
            {initials}
          </span>
          <span className="font-semibold text-gray-900">{buyerName}</span>
        </div>
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile navigation sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetClose onClose={() => setMobileOpen(false)} />
        </SheetHeader>
        <div className="mt-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <SidebarMenuButton
              key={key}
              isActive={activeTab === key}
              onClick={() => {
                setActiveTab(key);
                setMobileOpen(false);
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </SidebarMenuButton>
          ))}
        </div>
      </Sheet>

      <main className="md:ml-64 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
              {TAB_LABELS[activeTab]}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {greeting()}, {buyer.first_name}!
            </h1>
            <p className="text-sm text-gray-600">
              {activeTab === 'orders' && 'Here are your recent purchases and their statuses.'}
              {activeTab === 'profile' && 'Manage your personal and contact details.'}
              {activeTab === 'sell' && (session?.isSeller ? 'Manage your seller account and products.' : 'Set up a seller account using your login.')}
            </p>
          </div>

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              stats={stats}
              getStatusColor={getStatusColor}
            />
          )}
          {activeTab === 'profile' && (
            <ProfileTab
              buyer={buyer}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onUpdate={loadDashboardData}
            />
          )}
          {activeTab === 'sell' && (
            <BecomeSellerTab
              isSeller={!!session?.isSeller}
              onBecameSeller={async () => { await refreshSession(); }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </p>
      <SidebarMenu>{children}</SidebarMenu>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

// Orders Tab
function OrdersTab({
  orders,
  stats,
  getStatusColor
}: {
  orders: BuyerOrder[];
  stats: { totalOrders: number; pending: number; delivered: number; spent: number };
  getStatusColor: (status: string) => string;
}) {
  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="space-y-6">
      {/* Stat strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Package} label="Total orders" value={stats.totalOrders} />
        <Stat icon={Loader2} label="In progress" value={stats.pending} tone="amber" />
        <Stat icon={CheckCircle2} label="Delivered" value={stats.delivered} tone="emerald" />
        <Stat
          icon={Star}
          label="Total spent"
          value={`₦${stats.spent.toLocaleString('en-NG', { maximumFractionDigits: 2 })}`}
          tone="sky"
        />
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden border-gray-200/70 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  {order.product_image_url ? (
                    <img
                      src={order.product_image_url}
                      alt={order.product_name || 'Product'}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-gray-200"
                    />
                  ) : (
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                      🥥
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-bold text-gray-900">
                        {order.product_name || 'Product'}
                      </h3>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <p className="font-mono text-[11px] text-gray-500">#{order.id.substring(0, 8)}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
                <DetailRow label="Vendor" value={order.vendor_business_name} />
                <DetailRow label="Quantity" value={String(order.quantity)} />
                <DetailRow label="Total" value={`₦${(order.total_price ?? 0).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`} highlight />
                {order.delivery_address && (
                  <DetailRow label="Delivery Address" value={order.delivery_address} />
                )}
              </div>

              {order.notes && (
                <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  <span className="text-xs font-semibold text-gray-500">Notes: </span>
                  <span className="text-gray-700">{order.notes}</span>
                </div>
              )}

              {(order.vendor_email || order.vendor_phone) && (
                <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                  {order.vendor_email && (
                    <a
                      href={`mailto:${order.vendor_email}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {order.vendor_email}
                    </a>
                  )}
                  {order.vendor_phone && (
                    <a
                      href={`tel:${order.vendor_phone}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {order.vendor_phone}
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <span className="text-3xl">🛒</span>
        </span>
        <div>
          <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
          <p className="mt-1 text-sm text-gray-600">
            Start shopping in our marketplace to see your orders here.
          </p>
        </div>
        <Button asChild>
          <Link to="/marketplace">
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function Stat({
  icon: Icon, label, value, tone = 'default'
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'emerald' | 'amber' | 'sky';
}) {
  const toneClass: Record<string, string> = {
    default: 'bg-gray-100 text-gray-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    sky: 'bg-sky-100 text-sky-700',
  };
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="truncate text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-lg bg-gray-50/60 px-3 py-2">
      <span className="shrink-0 text-xs font-medium text-gray-500">{label}</span>
      <span
        className={`text-right text-sm ${
          highlight ? 'text-lg font-bold text-emerald-700' : 'font-semibold text-gray-900'
        }`}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}:</span>
      <span className={highlight ? 'text-lg font-bold text-emerald-700' : 'font-medium text-gray-900'}>
        {value}
      </span>
    </div>
  );
}

// Profile Tab
function ProfileTab({
  buyer,
  isEditing,
  setIsEditing,
  onUpdate
}: {
  buyer: Buyer;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onUpdate: () => void;
}) {
  const [formData, setFormData] = useState<BuyerUpdateInput>({
    first_name: buyer.first_name,
    last_name: buyer.last_name,
    phone: buyer.phone || '',
    address: buyer.address || '',
    city: buyer.city || '',
    state: buyer.state || '',
    country: buyer.country || '',
    postal_code: buyer.postal_code || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    const result = await updateBuyerProfile(buyer.id, formData);
    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      onUpdate();
      localStorage.setItem('buyerName', `${formData.first_name} ${formData.last_name}`);
    } else {
      setMessage(result.error || 'Failed to update profile');
    }
    setIsSaving(false);
  };

  if (!isEditing) {
    const fields: { label: string; value?: string | null; icon: React.ComponentType<{ className?: string }> }[] = [
      { label: 'Email', value: buyer.email, icon: Mail },
      { label: 'Phone', value: buyer.phone, icon: Phone },
      { label: 'Address', value: buyer.address, icon: MapPin },
      { label: 'City', value: buyer.city, icon: MapPin },
      { label: 'State', value: buyer.state, icon: MapPin },
      { label: 'Country', value: buyer.country, icon: MapPin },
      { label: 'Postal Code', value: buyer.postal_code, icon: MapPin },
    ];

    return (
      <div className="space-y-6">
        {/* Header card */}
        <Card className="overflow-hidden border-gray-200/70 shadow-sm">
          <div className="h-24 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700" />
          <CardContent className="-mt-10 px-6 pb-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl font-bold text-white shadow-lg">
                  {(buyer.first_name?.[0] || 'B').toUpperCase()}{(buyer.last_name?.[0] || '').toUpperCase()}
                </span>
                <div className="pb-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {buyer.first_name} {buyer.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">{buyer.email}</p>
                </div>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Detail card */}
        <Card className="border-gray-200/70 shadow-sm">
          <CardHeader>
            <CardTitle>Personal & contact details</CardTitle>
            <CardDescription>How your information appears on orders and invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {fields.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm ring-1 ring-gray-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                      {label}
                    </p>
                    <p className="truncate text-sm font-medium text-gray-900">
                      {value || 'Not provided'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
              <CalendarDays className="h-3.5 w-3.5" />
              Account created{' '}
              <span className="font-semibold text-gray-700">
                {new Date(buyer.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="border-gray-200/70 shadow-sm">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal and contact details.</CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div className={`mb-6 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
            message.includes('success')
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-rose-200 bg-rose-50 text-rose-800'
          }`}>
            {message.includes('success') ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : null}
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First Name" value={formData.first_name} onChange={(v) => setFormData({ ...formData, first_name: v })} />
          <Field label="Last Name" value={formData.last_name} onChange={(v) => setFormData({ ...formData, last_name: v })} />
          <Field label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} />
          <div className="sm:col-span-2">
            <Field label="Address" value={formData.address} onChange={(v) => setFormData({ ...formData, address: v })} />
          </div>
          <Field label="City" value={formData.city} onChange={(v) => setFormData({ ...formData, city: v })} />
          <Field label="State" value={formData.state} onChange={(v) => setFormData({ ...formData, state: v })} />
          <Field label="Country" value={formData.country} onChange={(v) => setFormData({ ...formData, country: v })} />
          <Field label="Postal Code" value={formData.postal_code} onChange={(v) => setFormData({ ...formData, postal_code: v })} />
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setMessage('');
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

// "Become a Seller" — reachable from the buyer dashboard once logged in.
// Upgrades the single buyer account to also sell (handled by the backend, which
// keeps one login and flags the session as a seller).
function BecomeSellerTab({
  isSeller,
  onBecameSeller
}: {
  isSeller: boolean;
  onBecameSeller: () => void | Promise<void>;
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: '',
    business_name: '',
    contact_name: '',
    phone: '',
    address: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const setField = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (form.password.length < 6) {
      setError('Your login password must be at least 6 characters.');
      return;
    }
    if (!form.business_name.trim() || !form.contact_name.trim()) {
      setError('Business name and contact name are required.');
      return;
    }

    setIsSaving(true);
    const result = await buyerBecomeSeller({
      password: form.password,
      business_name: form.business_name,
      contact_name: form.contact_name,
      phone: form.phone,
      address: form.address,
      description: form.description
    });
    setIsSaving(false);

    if (result.success) {
      await onBecameSeller();
      setMessage('You are now a seller on Coconoto. You can add and manage your products from your seller dashboard.');
      setForm({ password: '', business_name: '', contact_name: '', phone: '', address: '', description: '' });
    } else {
      setError(result.error || 'Failed to create your seller account.');
    }
  };

  if (isSeller) {
    return (
      <Card className="overflow-hidden border-emerald-200 shadow-sm">
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
        <CardContent className="py-8">
          <div className="mb-6 flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-gray-900">You're a seller on Coconoto</h3>
              <p className="mt-1 text-sm text-gray-600">
                Add and manage the products you sell, then watch the orders roll in.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/seller-dashboard">
                <LayoutDashboard className="h-4 w-4" />
                Go to Seller Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/marketplace">
                Browse Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200/70 shadow-sm">
      <CardHeader>
        <CardTitle>Become a Seller</CardTitle>
        <CardDescription>
          Want to sell on Coconoto? Set up your seller account using your login password so everything stays under one account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Login password *</Label>
            <Input type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} placeholder="Your account password" />
          </div>
          <div className="sm:col-span-2">
            <Label>Business name *</Label>
            <Input value={form.business_name} onChange={(e) => setField('business_name', e.target.value)} placeholder="e.g. Green Coconut Farms" />
          </div>
          <div>
            <Label>Contact name *</Label>
            <Input value={form.contact_name} onChange={(e) => setField('contact_name', e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setField('phone', e.target.value)} placeholder="+234..." />
          </div>
          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Input value={form.address} onChange={(e) => setField('address', e.target.value)} placeholder="Business address" />
          </div>
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Tell buyers about your business" rows={3} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Setting up...' : 'Become a Seller'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
