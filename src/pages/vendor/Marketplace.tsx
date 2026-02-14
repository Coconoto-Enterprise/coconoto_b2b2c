import React, { useState, useEffect } from 'react';
import MarketplaceNavbar from '../../components/MarketplaceNavbar';
import { getAllMarketplaceProducts, createOrder } from '../../services/vendorService';
import type { VendorProduct, VendorOrderInput } from '../../types/vendor';
import { PRODUCT_CATEGORIES } from '../../types/vendor';

export function Marketplace() {
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<VendorProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

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

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product: VendorProduct) => {
    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <MarketplaceNavbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-4xl font-bold mb-4">
            Discover Quality Coconut Products
          </h2>
          <p className="text-xl text-green-100 mb-6">
            Direct from verified farmers and processors
          </p>
          <div className="max-w-2xl">
            <input
              type="text"
              placeholder="Search products or vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-green-700'
              }`}
            >
              All Products
            </button>
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-green-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-green-700 font-semibold hover:text-green-800"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
    >
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.product_name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
          <span className="text-6xl">🥥</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
            {product.product_name}
          </h3>
          {product.vendor?.is_verified && (
            <span className="text-green-700" title="Verified Vendor">
              ✓
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        <p className="text-gray-700 mb-3 line-clamp-2 text-sm">
          {product.description}
        </p>
        <div className="mb-3">
          <p className="text-xs text-gray-500">By {product.vendor?.business_name}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-green-700">
            ${product.price}
            <span className="text-sm text-gray-600">/{product.unit}</span>
          </span>
          <span className="text-sm text-gray-600">
            {product.stock_quantity > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
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
  const [orderData, setOrderData] = useState<VendorOrderInput>({
    product_id: product.id,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    quantity: 1,
    delivery_address: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const totalPrice = product.price * orderData.quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (orderData.quantity > product.stock_quantity) {
      setError(`Only ${product.stock_quantity} units available`);
      setIsLoading(false);
      return;
    }

    const result = await createOrder(product.vendor_id, orderData);

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
                  ${product.price}/{product.unit}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                value={orderData.customer_name}
                onChange={(e) => setOrderData({ ...orderData, customer_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={orderData.customer_email}
                onChange={(e) => setOrderData({ ...orderData, customer_email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={orderData.customer_phone}
                onChange={(e) => setOrderData({ ...orderData, customer_phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity * (Available: {product.stock_quantity})
              </label>
              <input
                type="number"
                min="1"
                max={product.stock_quantity}
                value={orderData.quantity}
                onChange={(e) => setOrderData({ ...orderData, quantity: parseInt(e.target.value) || 1 })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
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

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-700">${totalPrice.toFixed(2)}</span>
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
