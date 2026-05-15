import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BuyerNavbar from '../../components/BuyerNavbar';
import { getBuyerProfile, getBuyerOrders, updateBuyerProfile } from '../../services/buyerService';
import type { Buyer, BuyerOrder, BuyerUpdateInput } from '../../types/buyer';

export function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const buyerId = localStorage.getItem('buyerId');

  useEffect(() => {
    if (!buyerId) {
      navigate('/buyer-login');
      return;
    }

    loadDashboardData();
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BuyerNavbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600">Failed to load buyer data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BuyerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {buyer.first_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your orders and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'orders'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Orders ({orders.length})
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

        {/* Content */}
        {activeTab === 'orders' && (
          <OrdersTab orders={orders} getStatusColor={getStatusColor} />
        )}
        {activeTab === 'profile' && (
          <ProfileTab 
            buyer={buyer} 
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onUpdate={loadDashboardData}
          />
        )}
      </div>
    </div>
  );
}

// Orders Tab Component
function OrdersTab({
  orders,
  getStatusColor
}: {
  orders: BuyerOrder[];
  getStatusColor: (status: string) => string;
}) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600 mb-6">
          Start shopping in our marketplace to see your orders here
        </p>
        <a
          href="/marketplace"
          className="inline-block bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {order.product_name || 'Product'}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Order ID: {order.id.substring(0, 8)}...
                </p>
                <p className="text-sm text-gray-600">
                  Ordered: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              {order.product_image_url && (
                <img
                  src={order.product_image_url}
                  alt={order.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Vendor:</span>
                <span className="font-medium">{order.vendor_business_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{order.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-green-700 text-lg">
                  ₦{order.total_price.toFixed(2)}
                </span>
              </div>
              {order.delivery_address && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Address:</span>
                  <span className="font-medium text-right">{order.delivery_address}</span>
                </div>
              )}
              {order.notes && (
                <div className="mt-2 text-sm">
                  <span className="text-gray-600">Notes:</span>
                  <p className="text-gray-700 mt-1">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Vendor Contact */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Vendor Contact:</p>
              <div className="flex gap-4 text-sm">
                {order.vendor_email && (
                  <a href={`mailto:${order.vendor_email}`} className="text-green-700 hover:text-green-800">
                    📧 {order.vendor_email}
                  </a>
                )}
                {order.vendor_phone && (
                  <a href={`tel:${order.vendor_phone}`} className="text-green-700 hover:text-green-800">
                    📞 {order.vendor_phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Profile Tab Component
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
      
      // Update localStorage
      localStorage.setItem('buyerName', `${formData.first_name} ${formData.last_name}`);
    } else {
      setMessage(result.error || 'Failed to update profile');
    }

    setIsSaving(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.first_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.last_name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.phone || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.address || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.city || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.state || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.country || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <p className="mt-1 text-lg text-gray-900">{buyer.postal_code || 'Not provided'}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Account created: {new Date(buyer.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h2>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.includes('success') 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
          <input
            type="text"
            value={formData.postal_code}
            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={() => {
            setIsEditing(false);
            setMessage('');
          }}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
