import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VendorNavbar from '../../components/VendorNavbar';
import {
  getVendorProducts,
  getVendorOrders,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  getVendorProfile,
  uploadProductImage
} from '../../services/vendorService';
import type { VendorProduct, VendorOrder, VendorProductInput, Vendor } from '../../types/vendor';
import { PRODUCT_CATEGORIES, UNITS } from '../../types/vendor';

export function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'profile'>('products');
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const navigate = useNavigate();

  const vendorId = localStorage.getItem('vendorId');
  const vendorBusinessName = localStorage.getItem('vendorBusinessName');

  useEffect(() => {
    if (!vendorId) {
      navigate('/vendor-login');
      return;
    }

    loadDashboardData();
  }, [vendorId, navigate]);

  const loadDashboardData = async () => {
    if (!vendorId) return;

    setIsLoading(true);
    const [productsData, ordersData, vendorData] = await Promise.all([
      getVendorProducts(vendorId),
      getVendorOrders(vendorId),
      getVendorProfile(vendorId)
    ]);

    setProducts(productsData);
    setOrders(ordersData);
    setVendor(vendorData);
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorId');
    localStorage.removeItem('vendorEmail');
    localStorage.removeItem('vendorBusinessName');
    navigate('/vendor-login');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!vendorId || !confirm('Are you sure you want to delete this product?')) return;

    const success = await deleteProduct(productId, vendorId);
    if (success) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: VendorOrder['status']) => {
    if (!vendorId) return;

    const success = await updateOrderStatus(orderId, vendorId, status);
    if (success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <VendorNavbar 
        vendorBusinessName={vendorBusinessName || undefined} 
        onLogout={handleLogout} 
      />

      {/* Tabs */}
      <div className="bg-white border-b mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onAddProduct={() => setShowAddProductModal(true)}
            onEditProduct={setEditingProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
        )}

        {activeTab === 'profile' && vendor && <ProfileTab vendor={vendor} />}
      </main>

      {/* Add/Edit Product Modal */}
      {(showAddProductModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          vendorId={vendorId!}
          onClose={() => {
            setShowAddProductModal(false);
            setEditingProduct(null);
          }}
          onSave={loadDashboardData}
        />
      )}
    </div>
  );
}

// Products Tab Component
function ProductsTab({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}: {
  products: VendorProduct[];
  onAddProduct: () => void;
  onEditProduct: (product: VendorProduct) => void;
  onDeleteProduct: (productId: string) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Products</h2>
        <button
          onClick={onAddProduct}
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 font-semibold"
        >
          + Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">You haven't added any products yet.</p>
          <button
            onClick={onAddProduct}
            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 font-semibold"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{product.product_name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <p className="text-gray-700 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-green-700">
                    ₦{product.price}/{product.unit}
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock: {product.stock_quantity}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Orders Tab Component
function OrdersTab({
  orders,
  onUpdateStatus
}: {
  orders: VendorOrder[];
  onUpdateStatus: (orderId: string, status: VendorOrder['status']) => void;
}) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-sm text-gray-500">{order.customer_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.product?.product_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₦{order.total_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as VendorOrder['status'])}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Profile Tab Component
function ProfileTab({ vendor }: { vendor: Vendor }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Business Name</label>
            <p className="mt-1 text-lg text-gray-900">{vendor.business_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Name</label>
            <p className="mt-1 text-lg text-gray-900">{vendor.contact_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg text-gray-900">{vendor.email}</p>
          </div>
          {vendor.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-lg text-gray-900">{vendor.phone}</p>
            </div>
          )}
          {vendor.address && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-lg text-gray-900">{vendor.address}</p>
            </div>
          )}
          {vendor.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-gray-900">{vendor.description}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Verification Status</label>
            <span className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
              vendor.is_verified
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {vendor.is_verified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Modal Component
function ProductModal({
  product,
  vendorId,
  onClose,
  onSave
}: {
  product: VendorProduct | null;
  vendorId: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState<VendorProductInput>({
    product_name: product?.product_name || '',
    description: product?.description || '',
    category: product?.category || PRODUCT_CATEGORIES[0],
    price: product?.price || 0,
    unit: product?.unit || UNITS[0],
    stock_quantity: product?.stock_quantity || 0,
    image_url: product?.image_url || '',
    is_active: product?.is_active ?? true
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSetImage = (file: File) => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return false;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WEBP, or AVIF)');
      return false;
    }

    setSelectedImage(file);
    setError('');
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetImage(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetImage(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let imageUrl = formData.image_url;

    // Upload image if a new one was selected
    if (selectedImage) {
      setIsUploading(true);
      const uploadResult = await uploadProductImage(vendorId, selectedImage);
      setIsUploading(false);

      if (!uploadResult.success) {
        setError(uploadResult.error || 'Failed to upload image');
        setIsLoading(false);
        return;
      }

      imageUrl = uploadResult.imageUrl || '';
    }

    const productData = {
      ...formData,
      image_url: imageUrl
    };

    let success = false;

    if (product) {
      // Update existing product
      success = await updateProduct(product.id, vendorId, productData);
    } else {
      // Create new product
      const result = await createProduct(vendorId, productData);
      success = result.success;
      if (!success) {
        setError(result.error || 'Failed to create product');
      }
    }

    setIsLoading(false);

    if (success) {
      onSave();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image</label>
              
              {!imagePreview ? (
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400 bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="image-upload"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <svg 
                        className={`w-16 h-16 ${isDragging ? 'text-green-500' : 'text-gray-400'}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                        />
                      </svg>
                    </div>
                    
                    <div>
                      <p className="text-base font-medium text-gray-700">
                        {isDragging ? 'Drop image here' : 'Drag & drop your image here'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">or</p>
                      <label 
                        htmlFor="image-upload" 
                        className="inline-block mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer font-medium transition-colors"
                      >
                        Browse Files
                      </label>
                    </div>
                    
                    <p className="text-xs text-gray-500">
                      Supported formats: JPEG, PNG, WEBP, AVIF (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-lg border-2 border-gray-200 overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {selectedImage ? selectedImage.name : 'Current image'}
                    </span>
                    <label 
                      htmlFor="image-upload-change" 
                      className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                    >
                      Change Image
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload-change"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active (visible in marketplace)
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="flex-1 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                {isUploading ? 'Uploading Image...' : isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
