import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarketplaceNavbar from '../../components/MarketplaceNavbar';
import BuyerNavbar from '../../components/BuyerNavbar';
import Footer from '../../components/Footer';
import { SlidersHorizontal, X, Search, BadgeCheck, Minus, Plus, PackageOpen, Check, Info, Store } from 'lucide-react';
import { getAllMarketplaceProducts, createOrder, getVendorDashboard, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../../services/vendorService';
import { createOrderWithBuyer, getBuyerProfile } from '../../services/buyerService';
import { useMarketplaceAuth } from '../../context/MarketplaceAuthContext';
import type { VendorProduct, VendorOrderInput, VendorProductInput } from '../../types/vendor';
import { PRODUCT_CATEGORIES, UNITS } from '../../types/vendor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';

const formatPrice = (amount: number) =>
  amount.toLocaleString('en-NG', { maximumFractionDigits: 2 });

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

export function Marketplace() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<VendorProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Buyer identity is derived from the authoritative cookie-based session so it
  // stays reactive (re-renders once the async session resolves). Fall back to
  // localStorage for resilience across reloads.
  const { session } = useMarketplaceAuth();
  const isSeller = !!session?.isSeller;
  const vendorId = session?.vendorId || null;
  const buyerId =
    session?.role === 'buyer' ? session.id : localStorage.getItem('buyerId');
  const buyerName =
    session?.role === 'buyer' ? session.name : localStorage.getItem('buyerName') || '';
  const buyerEmail =
    session?.role === 'buyer' ? session.email : localStorage.getItem('buyerEmail') || '';
  const isBuyerLoggedIn = !!buyerId;

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, sortBy, products]);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getAllMarketplaceProducts();
    setProducts(data);
    setFilteredProducts(data);
    setIsLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vendor?.business_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProducts(filtered);
  };

  const countForCategory = (category: string) =>
    category === 'all' ? products.length : products.filter(p => p.category === category).length;

  const handleProductClick = (product: VendorProduct) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-white lg:bg-[radial-gradient(circle_at_top,_#e9fff2,_#f5f8f6_38%,_#edf3ef_100%)] relative overflow-x-hidden">
      {/* Decorative blur orbs - desktop only. On mobile these overlap the
          product card area and create a "fading" wash that makes the card
          look faded in. */}
      <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl hidden lg:block"></div>
      <div className="pointer-events-none absolute top-80 -left-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl hidden lg:block"></div>

      {/* Navbar */}
      {isBuyerLoggedIn ? <BuyerNavbar /> : <MarketplaceNavbar />}

      {/* Hero Section */}
      <div className="hidden lg:block mt-20 px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-7xl mx-auto rounded-3xl border border-white/40 bg-white/65 backdrop-blur-xl shadow-[0_10px_50px_rgba(12,64,39,0.12)] p-6 sm:p-8 lg:p-10">
          <div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] uppercase text-green-700/80">Marketplace</p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
                Discover Quality Coconut Products
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-2xl">
                Direct from verified farmers and processors across the value chain.
              </p>
            </div>
          </div>

          <div className="mt-6 max-w-3xl relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, category, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 rounded-2xl border border-white/70 bg-white/90 text-gray-900 placeholder:text-gray-500 shadow-[0_6px_22px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-10 pb-10 lg:pb-10">
        {isSeller && <SellerTools vendorId={vendorId} />}

        <div className="lg:hidden mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Categories
            </button>
            <button
              type="button"
              aria-label="Toggle search"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-800 shadow-sm"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className={`overflow-hidden transition-all duration-300 ${isMobileSearchOpen ? 'max-h-24 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
            <input
              type="text"
              placeholder="Search products or vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/70 bg-white/90 text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-6 lg:gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.07)]">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => selectCategory('all')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-green-700 text-white shadow'
                      : 'text-gray-700 bg-white/70 hover:bg-white'
                  }`}
                >
                  <span>All Products</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {countForCategory('all')}
                  </span>
                </button>
                {PRODUCT_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => selectCategory(category)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-green-700 text-white shadow'
                        : 'text-gray-700 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <span className="text-left">{category}</span>
                    <span className={`text-xs rounded-full px-2 py-0.5 ${selectedCategory === category ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {countForCategory(category)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section>
            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/60 bg-white/75 backdrop-blur-lg overflow-hidden animate-pulse">
                    <div className="w-full h-36 sm:h-52 bg-gray-200/80"></div>
                    <div className="p-3 sm:p-5 space-y-3">
                      <div className="h-4 bg-gray-200/80 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200/80 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200/80 rounded w-full"></div>
                      <div className="flex justify-between pt-1">
                        <div className="h-4 bg-gray-200/80 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200/80 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-white/60 bg-white/75 backdrop-blur-xl shadow p-12 text-center">
                <PackageOpen className="h-12 w-12 text-green-700/40 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? `Nothing matches "${searchQuery}"${selectedCategory !== 'all' ? ` in ${selectedCategory}` : ''}.`
                    : 'There are no products in this category yet.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                  <p className="text-gray-700 font-medium">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    {selectedCategory !== 'all' && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1">
                        {selectedCategory}
                        <button
                          type="button"
                          aria-label="Clear category filter"
                          onClick={() => setSelectedCategory('all')}
                          className="hover:text-green-950"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </p>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    Sort by
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="rounded-xl border border-white/70 bg-white/90 px-3 py-2 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name">Name A–Z</option>
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => handleProductClick(product)}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Mobile Sliding Category Drawer */}
        <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${isCategoryDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <button
            type="button"
            aria-label="Close category drawer"
            onClick={() => setIsCategoryDrawerOpen(false)}
            className="absolute inset-0 bg-black/35"
          />

          <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white/90 backdrop-blur-xl border-l border-white/50 shadow-2xl p-5 transition-transform duration-300 ${isCategoryDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              <button
                type="button"
                aria-label="Close categories"
                title="Close categories"
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="rounded-full p-2 hover:bg-white text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => selectCategory('all')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-green-700 text-white shadow'
                    : 'text-gray-700 bg-white/80 hover:bg-white'
                }`}
              >
                <span>All Products</span>
                <span className={`text-xs rounded-full px-2 py-0.5 ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {countForCategory('all')}
                </span>
              </button>
              {PRODUCT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => selectCategory(category)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-green-700 text-white shadow'
                      : 'text-gray-700 bg-white/80 hover:bg-white'
                  }`}
                >
                  <span className="text-left">{category}</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${selectedCategory === category ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {countForCategory(category)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedProduct && (
        <OrderModal
          product={selectedProduct}
          buyerId={buyerId}
          buyerName={buyerName}
          buyerEmail={buyerEmail}
          onClose={() => {
            setShowOrderModal(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            setShowOrderModal(false);
            setSelectedProduct(null);
            loadProducts();
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onClick
}: {
  product: VendorProduct;
  onClick: () => void;
}) {
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            loading="lazy"
            className="h-40 w-full object-cover sm:h-52"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 sm:h-52">
            <span className="text-5xl sm:text-6xl">🥥</span>
          </div>
        )}
        <Badge
          variant="secondary"
          className="absolute left-2 top-2 bg-white text-emerald-800 shadow-sm border border-emerald-100"
        >
          {product.category}
        </Badge>
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-red-600">Out of Stock</span>
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-5">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold leading-tight text-foreground sm:text-lg">
          {product.product_name}
        </h3>
        <p className="mb-3 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
          {product.description}
        </p>
        <div className="mb-3 flex items-center gap-1">
          <p className="line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">
            By {product.vendor?.business_name}
          </p>
          {product.vendor?.is_verified && (
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-label="Verified Vendor" />
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary sm:text-xl">
            ₦{formatPrice(product.price)}
            <span className="text-[10px] text-muted-foreground sm:text-sm">/{product.unit}</span>
          </span>
          {product.stock_quantity === 0 ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : lowStock ? (
            <Badge variant="outline" className="border-amber-300 text-amber-700">
              Only {product.stock_quantity} left
            </Badge>
          ) : (
            <Badge variant="success">In Stock</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Order Modal Component
function OrderModal({
  product,
  onClose,
  onSuccess,
  buyerId,
  buyerName,
  buyerEmail
}: {
  product: VendorProduct;
  onClose: () => void;
  onSuccess: () => void;
  buyerId: string | null;
  buyerName: string;
  buyerEmail: string;
}) {

  const [orderData, setOrderData] = useState<VendorOrderInput>({
    product_id: product.id,
    customer_name: buyerName,
    customer_email: buyerEmail,
    customer_phone: '',
    quantity: 1,
    delivery_address: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  // Load buyer profile if logged in
  useEffect(() => {
    const loadBuyerProfile = async () => {
      if (buyerId) {
        const buyerProfile = await getBuyerProfile(buyerId);
        if (buyerProfile) {
          setOrderData(prev => ({
            ...prev,
            customer_name: `${buyerProfile.first_name} ${buyerProfile.last_name}`,
            customer_email: buyerProfile.email,
            customer_phone: buyerProfile.phone || '',
            delivery_address: buyerProfile.address || ''
          }));
        }
      }
    };
    loadBuyerProfile();
  }, [buyerId]);

  const totalPrice = product.price * orderData.quantity;

  const setQuantity = (quantity: number) => {
    const clamped = Math.max(1, Math.min(quantity, Math.max(product.stock_quantity, 1)));
    setOrderData(prev => ({ ...prev, quantity: clamped }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (orderData.quantity > product.stock_quantity) {
      setError(`Only ${product.stock_quantity} units available`);
      setIsLoading(false);
      return;
    }

    let result;
    
    // Use buyer-specific order creation if logged in
    if (buyerId) {
      result = await createOrderWithBuyer(
        product.vendor_id,
        product.id,
        buyerId,
        {
          quantity: orderData.quantity,
          delivery_address: orderData.delivery_address,
          notes: orderData.notes
        }
      );
    } else {
      // Guest checkout
      result = await createOrder(product.vendor_id, orderData);
    }

    if (result.success) {
      toast({
        title: 'Order placed!',
        description: 'The vendor will contact you shortly to confirm.',
        variant: 'success'
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(result.error || 'Failed to place order');
    }

    setIsLoading(false);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      {success ? (
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <Check className="h-8 w-8 text-success" />
          </div>
          <DialogTitle>Order Placed!</DialogTitle>
          <DialogDescription className="mt-2">
            The vendor will contact you shortly to confirm your order.
          </DialogDescription>
        </div>
      ) : (
        <>
          <DialogHeader>
            <DialogTitle>Place Order</DialogTitle>
            <DialogDescription>
              Review the details below and submit your request to the vendor.
            </DialogDescription>
          </DialogHeader>
          <DialogClose />

          {/* Product summary */}
          <div className="flex gap-4 rounded-lg border bg-muted/40 p-4">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.product_name}
                className="h-20 w-20 rounded-md object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{product.product_name}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
              {product.vendor?.business_name && (
                <p className="text-sm text-muted-foreground">Vendor: {product.vendor.business_name}</p>
              )}
              <p className="mt-1 text-lg font-bold text-primary">
                ₦{formatPrice(product.price)}/{product.unit}
              </p>
            </div>
          </div>

          {/* Guest prompt */}
          {!buyerId && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Save time on future orders!</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create an account to save your details, track orders, and checkout faster.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button asChild size="sm">
                      <Link to="/buyer-login">Login</Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/buyer-signup">Create Account</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order-customer-name">Your Name *</Label>
                <Input
                  id="order-customer-name"
                  value={orderData.customer_name}
                  onChange={(e) => setOrderData({ ...orderData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-customer-email">Email *</Label>
                <Input
                  id="order-customer-email"
                  type="email"
                  value={orderData.customer_email}
                  onChange={(e) => setOrderData({ ...orderData, customer_email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-customer-phone">Phone</Label>
              <Input
                id="order-customer-phone"
                type="tel"
                value={orderData.customer_phone}
                onChange={(e) => setOrderData({ ...orderData, customer_phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-quantity">Quantity * (Available: {product.stock_quantity})</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(orderData.quantity - 1)}
                  disabled={orderData.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="order-quantity"
                  type="number"
                  min={1}
                  max={product.stock_quantity}
                  value={orderData.quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                  className="w-24 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(orderData.quantity + 1)}
                  disabled={orderData.quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="ml-2 text-sm text-muted-foreground">
                  × ₦{formatPrice(product.price)}/{product.unit}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-delivery-address">Delivery Address</Label>
              <Textarea
                id="order-delivery-address"
                value={orderData.delivery_address}
                onChange={(e) => setOrderData({ ...orderData, delivery_address: e.target.value })}
                placeholder="Enter your delivery address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-notes">Additional Notes</Label>
              <Textarea
                id="order-notes"
                value={orderData.notes}
                onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                placeholder="Any special requests or notes..."
              />
            </div>

            <div className="space-y-1 rounded-lg border bg-muted/40 p-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{orderData.quantity} × ₦{formatPrice(product.price)}/{product.unit}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">₦{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading || product.stock_quantity === 0}>
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              By placing this order, the vendor will be notified and will contact you to confirm details and payment.
            </p>
          </form>
        </>
      )}
    </Dialog>
  );
}

// Seller tools shown on the marketplace for a buyer who has also become a seller
// (single unified login). Lets them view, add, edit and remove their own products.
function SellerTools({ vendorId }: { vendorId: string | null }) {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<VendorProductInput>>({
    product_name: '',
    description: '',
    category: PRODUCT_CATEGORIES[0],
    price: 0,
    unit: UNITS[0],
    stock_quantity: 0,
    image_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const load = async () => {
    if (!vendorId) return;
    setLoading(true);
    const data = await getVendorDashboard();
    setProducts(data?.products || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId]);

  const handleImage = async (file: File | null) => {
    if (!file || !vendorId) return;
    const res = await uploadProductImage(vendorId, file);
    if (res.success && res.imageUrl) {
      setForm((f) => ({ ...f, image_url: res.imageUrl }));
    } else {
      setError(res.error || 'Image upload failed');
    }
  };

  const startEdit = (p: VendorProduct) => {
    setEditingId(p.id);
    setForm({
      product_name: p.product_name,
      description: p.description,
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock_quantity: p.stock_quantity,
      image_url: p.image_url
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.product_name?.trim() || !form.description?.trim() || !(Number(form.price) > 0)) {
      setError('Product name, description and a valid price are required.');
      return;
    }
    if (!vendorId) return;

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
      toast({ title: editingId ? 'Product updated' : 'Product added', variant: 'success' });
      setShowForm(false);
      setEditingId(null);
      setForm({ product_name: '', description: '', category: PRODUCT_CATEGORIES[0], price: 0, unit: UNITS[0], stock_quantity: 0, image_url: '' });
      load();
    } else {
      setError(errMsg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!vendorId) return;
    if (!window.confirm('Delete this product?')) return;
    const ok = await deleteProduct(id, vendorId);
    if (ok) {
      toast({ title: 'Product deleted', variant: 'success' });
      load();
    } else {
      setError('Failed to delete product');
    }
  };

  return (
    <div className="mb-8 rounded-3xl border border-green-200 bg-white/85 backdrop-blur p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Store className="h-5 w-5 text-green-700" /> Your Seller Dashboard
          </h3>
          <p className="text-sm text-gray-600">Manage the products you sell on Coconoto.</p>
        </div>
        <Button onClick={() => { setShowForm((s) => !s); setEditingId(null); }}>
          {showForm ? 'Cancel' : 'Add Product'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {error && (
            <div className="sm:col-span-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="sm:col-span-2">
            <Label>Product name *</Label>
            <Input value={form.product_name || ''} onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))} />
          </div>
          <div className="sm:col-span-2">
            <Label>Description *</Label>
            <Textarea value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div>
            <Label>Category</Label>
            <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm">
              {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label>Unit</Label>
            <select value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm">
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <Label>Price (₦)</Label>
            <Input type="number" min={0} value={form.price ?? 0} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Stock quantity</Label>
            <Input type="number" min={0} value={form.stock_quantity ?? 0} onChange={(e) => setForm((f) => ({ ...f, stock_quantity: Number(e.target.value) }))} />
          </div>
          <div className="sm:col-span-2">
            <Label>Product image</Label>
            <Input type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0] || null)} />
            {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-24 w-24 rounded-lg object-cover" />}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      )}

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-gray-500">Loading your products…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't added any products yet.</p>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.product_name} className="h-14 w-14 rounded-md object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-md bg-emerald-100 text-2xl">🥥</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-900">{p.product_name}</p>
                  <p className="text-xs text-gray-500">₦{Number(p.price).toLocaleString()} / {p.unit} · {p.stock_quantity} in stock</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => startEdit(p)}>Edit</Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(p.id)}>Delete</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
