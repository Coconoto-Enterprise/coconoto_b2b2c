import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store, Package, Plus, Pencil, Trash2, Loader2, AlertCircle, ArrowLeft,
  ShoppingBag, Tag, Box, ImageIcon, FileEdit, Save, X,
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import {
  getVendorDashboard, createProduct, updateProduct, deleteProduct, uploadProductImage
} from '../../services/vendorService';
import type { VendorProduct, VendorProductInput } from '../../types/vendor';
import { PRODUCT_CATEGORIES, UNITS } from '../../types/vendor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';

/**
 * Dedicated seller dashboard, reached from the user dropdown.
 *
 * Buyers can opt to also sell (single unified login); instead of leaking the
 * "Your Seller Dashboard" card into the live public marketplace, we keep it
 * here as its own page. Tabs along the left cover product list + inventory,
 * and adding/editing happens inline at the top of the page.
 */
export function SellerDashboard() {
  const { session } = useMarketplaceAuth();
  const vendorId = session?.vendorId ?? null;
  const isSeller = !!session?.isSeller;

  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [error, setError] = useState('');

  // Live stats for the hero strip
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock_quantity > 0).length,
    outOfStock: products.filter((p) => p.stock_quantity === 0).length,
    lowStock: products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 5).length,
  };

  useEffect(() => {
    if (!vendorId) return;
    const load = async () => {
      setLoading(true);
      const data = await getVendorDashboard();
      setProducts(data?.products || []);
      setLoading(false);
    };
    load();
  }, [vendorId]);

  const onSaved = async () => {
    setLoading(true);
    const data = await getVendorDashboard();
    setProducts(data?.products || []);
    setLoading(false);
    setShowForm(false);
    setEditingId(null);
    setView('list');
  };

  if (!isSeller) {
    return <NotSeller />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Store className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700/80">
                Seller Dashboard
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Your products
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Add, edit, and remove the products you sell on Coconoto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/marketplace">
                <ArrowLeft className="h-4 w-4" />
                View Marketplace
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (showForm) {
                  setShowForm(false);
                  setEditingId(null);
                } else {
                  setShowForm(true);
                  setEditingId(null);
                }
              }}
              aria-expanded={showForm}
            >
              {showForm ? (
                <>
                  <X className="h-4 w-4" />
                  Close form
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add product
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatCard icon={Package} label="Total products" value={stats.total} />
          <StatCard icon={Box} label="In stock" value={stats.inStock} tone="success" />
          <StatCard icon={AlertTriangle} label="Low stock" value={stats.lowStock} tone="warning" />
          <StatCard icon={X} label="Out of stock" value={stats.outOfStock} tone="danger" />
        </div>

        {/* Form */}
        {showForm && vendorId && (
          <ProductForm
            vendorId={vendorId}
            editingId={editingId}
            onCancel={() => { setShowForm(false); setEditingId(null); }}
            onSaved={onSaved}
          />
        )}

        {/* Product list */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              {loading ? 'Loading products…' : `Your inventory (${products.length})`}
            </h2>
          </div>

          {loading ? (
            <ProductListSkeleton />
          ) : products.length === 0 ? (
            <EmptyState onAdd={() => setShowForm(true)} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onEdit={() => { setEditingId(p.id); setShowForm(true); }}
                  onDelete={async () => {
                    if (!window.confirm('Delete this product?')) return;
                    const ok = await deleteProduct(p.id, vendorId!);
                    if (ok) onSaved();
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, tone = 'default'
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone?: 'default' | 'success' | 'warning' | 'danger';
}) {
  const toneClass: Record<string, string> = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Package className="h-7 w-7" />
        </span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">No products yet</h3>
          <p className="mt-1 max-w-sm text-sm text-gray-600">
            Add your first product to start selling on the Coconoto marketplace.
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add your first product
        </Button>
      </CardContent>
    </Card>
  );
}

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 animate-pulse">
          <div className="mb-3 h-32 w-full rounded-xl bg-gray-100" />
          <div className="mb-2 h-3 w-3/4 rounded bg-gray-100" />
          <div className="h-3 w-1/2 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function ProductCard({
  product, onEdit, onDelete
}: {
  product: VendorProduct;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  return (
    <Card className="overflow-hidden border-gray-200/70 bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100">
        {product.image_url ? (
          <img src={product.image_url} alt={product.product_name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">🥥</div>
        )}
        <Badge variant="secondary" className="absolute left-2 top-2 bg-white text-emerald-800 shadow-sm">
          {product.category}
        </Badge>
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-rose-600">Out of stock</span>
          </div>
        )}
      </div>
      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-bold text-gray-900">{product.product_name}</h3>
          <p className="line-clamp-2 text-xs text-gray-600">{product.description}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-primary">
            ₦{Number(product.price).toLocaleString()}
            <span className="text-xs font-normal text-gray-500">/{product.unit}</span>
          </span>
          {product.stock_quantity === 0 ? (
            <Badge variant="destructive" className="text-[10px]">Out</Badge>
          ) : lowStock ? (
            <Badge variant="outline" className="border-amber-300 text-amber-700 text-[10px]">
              {product.stock_quantity} left
            </Badge>
          ) : (
            <Badge variant="success" className="text-[10px]">{product.stock_quantity} in stock</Badge>
          )}
        </div>
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductForm({
  vendorId, editingId, onCancel, onSaved
}: {
  vendorId: string;
  editingId: string | null;
  onCancel: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<Partial<VendorProductInput>>({
    product_name: '', description: '',
    category: PRODUCT_CATEGORIES[0], price: 0,
    unit: UNITS[0], stock_quantity: 0, image_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  // If we are editing, prefill
  useEffect(() => {
    const init = async () => {
      if (!editingId) { setHydrated(true); return; }
      const data = await getVendorDashboard();
      const found = data?.products?.find((p: VendorProduct) => p.id === editingId);
      if (found) {
        setForm({
          product_name: found.product_name,
          description: found.description,
          category: found.category,
          price: found.price,
          unit: found.unit,
          stock_quantity: found.stock_quantity,
          image_url: found.image_url
        });
      }
      setHydrated(true);
    };
    init();
  }, [editingId]);

  const handleImage = async (file: File | null) => {
    if (!file) return;
    setError('');
    const res = await uploadProductImage(vendorId, file);
    if (res.success && res.imageUrl) {
      setForm((f) => ({ ...f, image_url: res.imageUrl }));
    } else {
      setError(res.error || 'Image upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.product_name?.trim() || !form.description?.trim() || !(Number(form.price) > 0)) {
      setError('Product name, description and a valid price are required.');
      return;
    }

    const payload: VendorProductInput = {
      product_name: form.product_name!,
      description: form.description!,
      category: form.category!,
      price: Number(form.price),
      unit: form.unit!,
      stock_quantity: Number(form.stock_quantity),
      image_url: form.image_url
    };

    setIsSaving(true);
    let ok = false;
    let errMsg = '';
    if (editingId) {
      ok = await updateProduct(editingId, vendorId, payload);
      if (!ok) errMsg = 'Failed to update product';
    } else {
      const result = await createProduct(vendorId, payload);
      ok = !!result.success;
      errMsg = result.error || 'Failed to add product';
    }
    setIsSaving(false);

    if (ok) {
      toast({
        title: editingId ? 'Product updated' : 'Product added',
        variant: 'success'
      });
      await onSaved();
    } else {
      setError(errMsg);
    }
  };

  if (!hydrated) {
    return (
      <Card className="mb-8">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border-emerald-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {editingId ? <FileEdit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          {editingId ? 'Edit product' : 'New product'}
        </CardTitle>
        <CardDescription>
          {editingId ? 'Update the details of your product below.' : 'Fill the form to list a new product in the marketplace.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Product name *</Label>
            <Input
              value={form.product_name || ''}
              onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))}
              placeholder="e.g. Cold-pressed coconut oil"
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Description *</Label>
            <Textarea
              value={form.description || ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Tell buyers what's special about your product"
              rows={4}
            />
          </div>
          <div>
            <Label>Category</Label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Unit</Label>
            <select
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <Label>Price (₦) *</Label>
            <Input
              type="number" min={0} step="0.01"
              value={form.price ?? 0}
              onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
            />
          </div>
          <div>
            <Label>Stock quantity</Label>
            <Input
              type="number" min={0}
              value={form.stock_quantity ?? 0}
              onChange={(e) => setForm((f) => ({ ...f, stock_quantity: Number(e.target.value) }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Product image</Label>
            <div className="flex items-start gap-4">
              <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 hover:border-primary/50 hover:bg-gray-100">
                <ImageIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Click to upload an image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImage(e.target.files?.[0] || null)}
                />
              </label>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="preview"
                  className="h-16 w-16 shrink-0 rounded-lg object-cover ring-2 ring-white shadow"
                />
              )}
            </div>
          </div>

          <div className="flex gap-3 sm:col-span-2">
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving…' : editingId ? 'Update product' : 'Add product'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function NotSeller() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-emerald-50/60 to-white p-6">
      <Card className="max-w-md text-center">
        <CardContent className="space-y-4 py-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h2 className="text-xl font-bold text-gray-900">Become a seller on Coconoto</h2>
          <p className="text-sm text-gray-600">
            Use the "Sell on Coconoto" option in your buyer dashboard to upgrade your account,
            then come back here to manage your products.
          </p>
          <div className="flex justify-center gap-2">
            <Button asChild>
              <Link to="/buyer-dashboard" state={{ tab: 'sell' }}>
                <ShoppingBag className="h-4 w-4" />
                Open buyer dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
