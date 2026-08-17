import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { ShoppingBag, User, Store, LogOut, Menu, Pencil, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react';

export function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'sell'>('orders');
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const { session, logout, refreshSession } = useMarketplaceAuth();
  const buyerId = session?.role === 'buyer' ? session.id : localStorage.getItem('buyerId');
  const buyerName =
    session?.role === 'buyer' ? session.name : localStorage.getItem('buyerName') || 'Buyer';

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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/buyer-login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Failed to load buyer data</p>
      </div>
    );
  }

  const navItems = [
    { key: 'orders' as const, label: 'My Orders', icon: ShoppingBag },
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'sell' as const, label: 'Sell on Coconoto', icon: Store }
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{buyerName}</p>
              <p className="text-xs text-muted-foreground">Buyer Account</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map(({ key, label, icon: Icon }) => (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton isActive={activeTab === key} onClick={() => setActiveTab(key)}>
                  <Icon className="h-4 w-4" />
                  {label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
          <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
            <Link to="/marketplace">Browse Marketplace</Link>
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <span className="font-semibold">{buyerName}</span>
        </div>
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(true)}>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {buyer.first_name}!
            </h1>
            <p className="mt-1 text-muted-foreground">Manage your orders and account settings.</p>
          </div>

          {activeTab === 'orders' && <OrdersTab orders={orders} getStatusColor={getStatusColor} />}
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

// Orders Tab
function OrdersTab({
  orders,
  getStatusColor
}: {
  orders: BuyerOrder[];
  getStatusColor: (status: string) => string;
}) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="text-6xl">🛒</div>
          <h3 className="text-xl font-semibold text-foreground">No orders yet</h3>
          <p className="text-muted-foreground">Start shopping in our marketplace to see your orders here.</p>
          <Button asChild>
            <Link to="/marketplace">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="truncate text-lg font-bold text-foreground">
                    {order.product_name || 'Product'}
                  </h3>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Order ID: {order.id.substring(0, 8)}…</p>
                <p className="text-sm text-muted-foreground">
                  Ordered: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              {order.product_image_url && (
                <img
                  src={order.product_image_url}
                  alt={order.product_name}
                  className="h-20 w-20 rounded-md object-cover"
                />
              )}
            </div>

            <div className="mt-4 space-y-2 border-t pt-4 text-sm">
              <Row label="Vendor" value={order.vendor_business_name} />
              <Row label="Quantity" value={String(order.quantity)} />
              <Row label="Total" value={`₦${(order.total_price ?? 0).toFixed(2)}`} highlight />
              {order.delivery_address && <Row label="Delivery Address" value={order.delivery_address} />}
              {order.notes && (
                <div>
                  <span className="text-muted-foreground">Notes: </span>
                  <p className="mt-1 text-foreground">{order.notes}</p>
                </div>
              )}
            </div>

            {(order.vendor_email || order.vendor_phone) && (
              <div className="mt-4 border-t pt-4">
                <p className="mb-2 text-xs text-muted-foreground">Vendor Contact:</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {order.vendor_email && (
                    <a href={`mailto:${order.vendor_email}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                      <Mail className="h-4 w-4" /> {order.vendor_email}
                    </a>
                  )}
                  {order.vendor_phone && (
                    <a href={`tel:${order.vendor_phone}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80">
                      <Phone className="h-4 w-4" /> {order.vendor_phone}
                    </a>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}:</span>
      <span className={highlight ? 'text-lg font-bold text-primary' : 'font-medium text-foreground'}>{value}</span>
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
    return (
      <Card className="max-w-2xl">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal and contact details.</CardDescription>
          </div>
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ProfileRow label="First Name" value={buyer.first_name} />
          <ProfileRow label="Last Name" value={buyer.last_name} />
          <ProfileRow label="Email" value={buyer.email} />
          <ProfileRow label="Phone" value={buyer.phone} />
          <div className="sm:col-span-2">
            <ProfileRow label="Address" value={buyer.address} />
          </div>
          <ProfileRow label="City" value={buyer.city} />
          <ProfileRow label="State" value={buyer.state} />
          <ProfileRow label="Country" value={buyer.country} />
          <ProfileRow label="Postal Code" value={buyer.postal_code} />
          <div className="sm:col-span-2 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Account created: {new Date(buyer.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.includes('success')
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}>
            {message}
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

function ProfileRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-lg text-foreground">{value || 'Not provided'}</p>
    </div>
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
      setMessage('You are now a seller on Coconoto. You can add and manage your products from the marketplace.');
      setForm({ password: '', business_name: '', contact_name: '', phone: '', address: '', description: '' });
    } else {
      setError(result.error || 'Failed to create your seller account.');
    }
  };

  if (isSeller) {
    return (
      <Card className="max-w-2xl">
        <CardContent className="py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success/15">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">You're a seller on Coconoto</h3>
              <p className="text-sm text-muted-foreground">Add and manage the products you want to sell.</p>
            </div>
          </div>
          <Button asChild>
            <Link to="/marketplace">Go to Marketplace to manage products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Become a Seller</CardTitle>
        <CardDescription>
          Want to sell on Coconoto? Set up your seller account using your login password so everything stays under one account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div className="mb-6 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{message}</div>
        )}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
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
            <Textarea value={form.description} onChange={(e) => setField('description', e.target.value)} placeholder="Tell buyers about your business" />
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
