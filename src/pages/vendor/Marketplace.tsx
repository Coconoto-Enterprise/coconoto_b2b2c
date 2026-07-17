import React, { useState, useEffect } from 'react';
import MarketplaceNavbar from '../../components/MarketplaceNavbar';
import BuyerNavbar from '../../components/BuyerNavbar';
import Footer from '../../components/Footer';
import { SlidersHorizontal, X, Search, BadgeCheck, Minus, Plus, PackageOpen } from 'lucide-react';
import { getAllMarketplaceProducts, createOrder } from '../../services/vendorService';
import { createOrderWithBuyer, getBuyerProfile } from '../../services/buyerService';
import type { VendorProduct, VendorOrderInput } from '../../types/vendor';
import { PRODUCT_CATEGORIES } from '../../types/vendor';

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
  
  // Check if buyer is logged in
  const buyerId = localStorage.getItem('buyerId');
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e9fff2,_#f5f8f6_38%,_#edf3ef_100%)] relative overflow-x-hidden">
      <div className="pointer-events-none absolute -top-28 -right-20 h-72 w-72 rounded-full bg-green-200/40 blur-3xl"></div>
      <div className="pointer-events-none absolute top-80 -left-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl"></div>

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-10 pb-8 lg:pb-10">
        <div className="lg:hidden mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-md"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Categories
            </button>
            <button
              type="button"
              aria-label="Toggle search"
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="inline-flex items-center justify-center rounded-xl border border-white/70 bg-white/80 p-2.5 text-gray-800 shadow-sm backdrop-blur-md"
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
    <div
      onClick={onClick}
      className="group rounded-2xl border border-white/60 bg-white/75 backdrop-blur-lg shadow-[0_10px_24px_rgba(0,0,0,0.08)] overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.product_name}
            loading="lazy"
            className="w-full h-36 sm:h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-36 sm:h-52 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <span className="text-4xl sm:text-6xl">🥥</span>
          </div>
        )}
        <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-green-800 shadow-sm">
          {product.category}
        </span>
        {product.stock_quantity === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="rounded-full bg-white px-3 py-1 text-xs sm:text-sm font-bold text-red-600">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-5">
        <h3 className="text-sm sm:text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-1">
          {product.product_name}
        </h3>
        <p className="text-gray-700 mb-3 line-clamp-2 text-xs sm:text-sm">
          {product.description}
        </p>
        <div className="mb-3 flex items-center gap-1">
          <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1">By {product.vendor?.business_name}</p>
          {product.vendor?.is_verified && (
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-green-600" aria-label="Verified Vendor" />
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-xl font-bold text-green-700">
            ₦{formatPrice(product.price)}
            <span className="text-[10px] sm:text-sm text-gray-600">/{product.unit}</span>
          </span>
          <span className="text-[10px] sm:text-sm text-right">
            {product.stock_quantity === 0 ? (
              <span className="text-red-600 font-medium">Out of Stock</span>
            ) : lowStock ? (
              <span className="text-amber-600 font-medium">Only {product.stock_quantity} left</span>
            ) : (
              <span className="text-green-600">In Stock</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

// Order Modal Component
function OrderModal({
  product,
  onClose,
  onSuccess
}: {
  product: VendorProduct;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const buyerId = localStorage.getItem('buyerId');
  const buyerName = localStorage.getItem('buyerName') || '';
  const buyerEmail = localStorage.getItem('buyerEmail') || '';

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
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(result.error || 'Failed to place order');
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h3>
          <p className="text-gray-600">
            The vendor will contact you shortly to confirm your order.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Place Order</h2>
            <button
              type="button"
              aria-label="Close order modal"
              title="Close order modal"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex gap-4">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{product.product_name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm text-gray-600">
                  Vendor: {product.vendor?.business_name}
                </p>
                <p className="text-lg font-bold text-green-700 mt-1">
                  ₦{formatPrice(product.price)}/{product.unit}
                </p>
              </div>
            </div>
          </div>

          {/* Login/Signup Prompt for Guests */}
          {!buyerId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    💡 Save time on future orders!
                  </p>
                  <p className="text-xs text-blue-700 mb-3">
                    Create an account to save your details, track orders, and checkout faster.
                  </p>
                  <div className="flex gap-2">
                    <a href="/buyer-login" className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
                      Login
                    </a>
                    <a href="/buyer-signup" className="text-xs bg-white text-blue-600 px-3 py-1.5 rounded border border-blue-600 hover:bg-blue-50">
                      Create Account
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="order-customer-name" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                id="order-customer-name"
                type="text"
                value={orderData.customer_name}
                onChange={(e) => setOrderData({ ...orderData, customer_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="order-customer-email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="order-customer-email"
                type="email"
                value={orderData.customer_email}
                onChange={(e) => setOrderData({ ...orderData, customer_email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="order-customer-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                id="order-customer-phone"
                type="tel"
                value={orderData.customer_phone}
                onChange={(e) => setOrderData({ ...orderData, customer_phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label htmlFor="order-quantity" className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity * (Available: {product.stock_quantity})
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(orderData.quantity - 1)}
                  disabled={orderData.quantity <= 1}
                  className="p-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  id="order-quantity"
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={orderData.quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  required
                  className="w-24 text-center px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity(orderData.quantity + 1)}
                  disabled={orderData.quantity >= product.stock_quantity}
                  className="p-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="ml-2 text-sm text-gray-500">
                  × ₦{formatPrice(product.price)}/{product.unit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                value={orderData.delivery_address}
                onChange={(e) => setOrderData({ ...orderData, delivery_address: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter your delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={orderData.notes}
                onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Any special requests or notes..."
              />
            </div>

            <div className="bg-green-50 rounded-lg p-4 space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{orderData.quantity} × ₦{formatPrice(product.price)}/{product.unit}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-700">₦{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || product.stock_quantity === 0}
                className="flex-1 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 font-semibold"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By placing this order, the vendor will be notified and will contact you to confirm details and payment.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
