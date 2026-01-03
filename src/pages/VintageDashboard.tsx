import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Send, 
  Eye,
  Calendar,
  RefreshCw,
  LogOut,
  Plus,
  X,
  Edit
} from 'lucide-react';

interface Email {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
  last_event: string;
  html?: string;
}



interface AllData {
  bookEventRequests: any[];
  investmentInquiries: any[];
  machineOrders: any[];
  productOrders: any[];
  serviceContacts: any[];
  toxicResults: any[];
  waitlist: any[];
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
}

const VintageDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [emails, setEmails] = useState<Email[]>([]);
  const [allData, setAllData] = useState<AllData>({
    bookEventRequests: [],
    investmentInquiries: [],
    machineOrders: [],
    productOrders: [],
    serviceContacts: [],
    toxicResults: [],
    waitlist: []
  });
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalTitle, setDetailModalTitle] = useState('');
  const [sending, setSending] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [editPriceItem, setEditPriceItem] = useState<any>(null);
  const [editPriceType, setEditPriceType] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const navigate = useNavigate();

  const [composer, setComposer] = useState({
    to: '',
    subject: '',
    message: '',
    heading: '',
    templateType: 'customer', // 'customer' or 'team'
    isHtml: false,
    attachments: [] as File[]
  });

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/vintage');
    }
  }, [navigate]);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch emails
      const emailResponse = await fetch('/api/get-emails');
      const emailData = await emailResponse.json();
      
      if (emailData.success) {
        setEmails(emailData.emails || []);
      }



      // Fetch ALL data from new API
      const allDataResponse = await fetch('/api/get-all-data');
      const allDataResult = await allDataResponse.json();
      
      if (allDataResult.success) {
        setAllData(allDataResult.data || {
          bookEventRequests: [],
          investmentInquiries: [],
          machineOrders: [],
          productOrders: [],
          serviceContacts: [],
          toxicResults: [],
          waitlist: []
        });
      }

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!composer.to || !composer.subject || !composer.message) {
      alert('Please fill in all required fields (Recipients, Subject, and Message)');
      return;
    }

    try {
      setSending(true);
      
      // Create FormData to support file uploads
      const formData = new FormData();
      formData.append('to', composer.to);
      formData.append('subject', composer.subject);
      formData.append('message', composer.message);
      formData.append('heading', composer.heading);
      formData.append('templateType', composer.templateType);
      
      // Append all attachments
      composer.attachments.forEach((file, index) => {
        formData.append('attachments', file);
      });

      const response = await fetch('/api/send-custom-email', {
        method: 'POST',
        body: formData, // Send as FormData instead of JSON
      });

      const data = await response.json();
      if (data.success) {
        alert('Email sent successfully!');
        setComposer({ to: '', subject: '', message: '', heading: '', templateType: 'customer', isHtml: false, attachments: [] });
        setShowComposer(false);
        fetchData();
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (err) {
      alert('Network error occurred while sending email');
    } finally {
      setSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/vintage');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': case 'completed': return 'text-green-600 bg-green-100';
      case 'sent': case 'pending': return 'text-blue-600 bg-blue-100';
      case 'bounced': case 'cancelled': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Open detail modal for any table item
  const openDetailModal = (title: string, item: any) => {
    setDetailModalTitle(title);
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // Open edit price modal
  const openEditPriceModal = (type: string, item: any) => {
    setEditPriceType(type);
    setEditPriceItem(item);
    
    // Get current price based on item type
    let currentPrice = '';
    if (type === 'Machine Order' || type === 'Event Request') {
      currentPrice = item?.price ? item.price.toString() : '';
    } else if (type === 'Product Order') {
      currentPrice = item?.total_price ? item.total_price.toString() : '';
    }
    
    setNewPrice(currentPrice);
    setShowEditPriceModal(true);
  };

  // Update price function
  const updatePrice = async () => {
    if (!editPriceItem || !newPrice) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const priceValue = parseFloat(newPrice);
      if (isNaN(priceValue) || priceValue < 0) {
        alert('Please enter a valid positive number');
        return;
      }

      // Determine which table to update based on type
      let tableName = '';
      if (editPriceType === 'Machine Order') tableName = 'machine_orders';
      else if (editPriceType === 'Product Order') tableName = 'product_orders';
      else if (editPriceType === 'Event Request') tableName = 'book_event_requests';

      console.log('Updating price:', { tableName, id: editPriceItem.id, price: priceValue });

      // Update price via API
      const response = await fetch('/api/update-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: tableName,
          id: editPriceItem.id,
          price: priceValue
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`Price updated successfully to ₦${priceValue.toLocaleString()}!`);
        setShowEditPriceModal(false);
        fetchData(); // Refresh data
      } else {
        alert(`Failed to update price: ${data.error}`);
      }
    } catch (err) {
      console.error('Update price error:', err);
      alert('Network error occurred while updating price');
    }
  };

  // Detail Modal Component
  const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, data }) => {
    if (!isOpen || !data) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="space-y-4">
              {Object.entries(data)
                .filter(([key, value]) => {
                  // Always hide the id field
                  if (key === 'id') {
                    return false;
                  }

                  // For buyers: show products they're interested in
                  if (data.account_type === 'buyer' && key === 'products') {
                    // Show products if it's an array with items
                    if (Array.isArray(value) && value.length > 0) {
                      // Check if it's a string array (waitlist) or object array (orders)
                      if (typeof value[0] === 'string') {
                        return true; // Show products_interested
                      }
                      // For object arrays, check if they have valid data
                      if (value[0]?.name && value[0].name !== 'N/A') {
                        return true;
                      }
                    }
                    return false; // Hide empty product arrays
                  }

                  // For sellers: show their business info
                  if (data.account_type === 'seller') {
                    const sellerFields = ['business_type', 'business_category', 'monthly_volume', 'years_experience'];
                    if (sellerFields.includes(key) && value && value !== 'N/A' && value !== '') {
                      return true;
                    }
                  }

                  // Always show these core fields (unless truly empty)
                  const coreFields = ['name', 'email', 'phone', 'company', 'account_type', 'country', 'state', 'city', 
                                      'created_at', 'updated_at', 'address', 'total_price', 'price', 
                                      'products_interested', 'products_other', 'primary_use_case', 'hear_about_us', 
                                      'additional_info', 'type', 'quantity', 'installation_address', 'notes'];
                  
                  if (coreFields.includes(key)) {
                    // Hide if empty or N/A
                    if (!value || value === 'N/A' || value === '' || 
                        (Array.isArray(value) && value.length === 0)) {
                      return false;
                    }
                    return true;
                  }

                  // For buyers: hide seller-specific fields when N/A
                  if (data.account_type === 'buyer') {
                    const sellerOnlyFields = ['monthly_volume', 'years_experience', 'business_type', 'business_category'];
                    if (sellerOnlyFields.includes(key)) {
                      return false;
                    }
                  }
                  
                  // For sellers: hide buyer-specific fields when N/A
                  if (data.account_type === 'seller') {
                    const buyerOnlyFields = ['products_interested', 'products_other', 'primary_use_case'];
                    if (buyerOnlyFields.includes(key) && (!value || value === 'N/A' || value === '')) {
                      return false;
                    }
                  }
                  
                  // Hide any field that is explicitly N/A, empty, or null
                  if (!value || value === 'N/A' || value === '' || 
                      (Array.isArray(value) && value.length === 0)) {
                    return false;
                  }
                  
                  return true;
                })
                .map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="font-medium text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </div>
                  <div className="sm:col-span-2 text-gray-900">
                    {typeof value === 'object' && value !== null ? (
                      Array.isArray(value) ? (
                        // Check if this is a products array from product orders (has name, price, etc.)
                        value.length > 0 && value[0]?.name ? (
                          <div className="space-y-2">
                            {value.map((item: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div><span className="font-medium">Name:</span> {item.name || 'N/A'}</div>
                                  <div><span className="font-medium">Price:</span> {item.price || 'N/A'}</div>
                                  <div><span className="font-medium">Quantity:</span> {item.quantity || 'N/A'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // For simple arrays like products_interested
                          <div className="bg-gray-50 p-3 rounded-lg border text-sm">
                            {value.length > 0 ? value.join(', ') : 'N/A'}
                          </div>
                        )
                      ) : (
                        <div className="bg-gray-50 p-3 rounded-lg border text-sm">
                          {Object.entries(value).map(([k, v]) => (
                            <div key={k} className="mb-1">
                              <span className="font-medium">{k}:</span> {String(v)}
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      // Format date fields (created_at, updated_at, submitted_at, etc.)
                      (key.includes('_at') || key === 'date') && typeof value === 'string' && value.includes('T') ?
                        formatDate(value) :
                        // Format price fields with ₦ symbol and commas
                        (key === 'total_price' || key === 'price') && typeof value === 'number' && value > 0 ? 
                          `₦${Number(value).toLocaleString()}` : 
                          // Format string values: convert underscores to spaces and capitalize
                          typeof value === 'string' && value !== 'N/A' ? 
                            value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                            String(value || 'N/A')
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end p-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filter emails by type
  const businessEmails = Array.isArray(emails) ? emails.filter(email => 
    email?.from?.includes('team@') || email?.to?.some(recipient => recipient.includes('coconoto'))
  ) : [];

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">🥥 Coconoto Admin</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowComposer(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Compose Email
              </button>
              <button
                onClick={fetchData}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>


              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-4 overflow-x-auto" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },

              { id: 'business-emails', name: 'Business Emails', icon: Users },
              { id: 'book-events', name: `Event Requests (${allData.bookEventRequests.length})`, icon: Calendar },

              { id: 'machine-orders', name: `Machine Orders (${allData.machineOrders.length})`, icon: ShoppingCart },
              { id: 'product-orders', name: `Product Orders (${allData.productOrders.length})`, icon: ShoppingCart },
              { id: 'service-contacts', name: `Service Contacts (${allData.serviceContacts.length})`, icon: Mail },

              { id: 'waitlist', name: `Waitlist (${allData.waitlist.length})`, icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center gap-2`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{Array.isArray(emails) ? emails.length : 0}</h3>
                    <p className="text-gray-600">Total Emails</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{allData.bookEventRequests.length}</h3>
                    <p className="text-gray-600">Event Requests</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{allData.machineOrders.length + allData.productOrders.length}</h3>
                    <p className="text-gray-600">Total Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{allData.waitlist.length}</h3>
                    <p className="text-gray-600">Waitlist Entries</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Mail className="h-8 w-8 text-pink-600" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{allData.serviceContacts.length}</h3>
                    <p className="text-gray-600">Service Contacts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {Object.values(allData).reduce((sum, arr) => sum + arr.length, 0)}
                    </h3>
                    <p className="text-gray-600">Total Entries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Event Requests</h2>
                </div>
                <div className="p-6">
                  {allData.bookEventRequests.length > 0 ? allData.bookEventRequests.slice(0, 5).map((request) => (
                    <div key={request?.id || Math.random()} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{request?.full_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{request?.event_type || 'Unknown Event'} - {request?.event_date || 'No date'}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                        New
                      </span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-4">No event requests yet</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Machine Orders</h2>
                </div>
                <div className="p-6">
                  {allData.machineOrders.length > 0 ? allData.machineOrders.slice(0, 5).map((order) => (
                    <div key={order?.id || Math.random()} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{order?.name || 'Unknown Customer'}</p>
                        <p className="text-xs text-gray-500">{order?.type || 'Unknown Machine'} x{order?.quantity || 1}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                        Pending
                      </span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-4">No machine orders yet</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Waitlist Entries</h2>
                </div>
                <div className="p-6">
                  {allData.waitlist.length > 0 ? allData.waitlist.slice(0, 5).map((entry) => (
                    <div key={entry?.id || Math.random()} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{entry?.company || 'No company'} - {entry?.account_type || 'Unknown'}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-600">
                        Waitlist
                      </span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-4">No waitlist entries yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Business Emails Tab */}
        {activeTab === 'business-emails' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Business Emails ({businessEmails.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {businessEmails.length > 0 ? businessEmails.map((email) => (
                    <tr key={email?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{email?.subject || 'No Subject'}</div>
                        <div className="text-sm text-gray-500">From: {email?.from || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{email?.to ? email.to.join(', ') : 'No recipients'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(email?.last_event || 'unknown')}`}>
                          {email?.last_event || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{email?.created_at ? formatDate(email.created_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedEmail(email)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No business emails found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Book Event Requests Tab */}
        {activeTab === 'book-events' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Event Booking Requests ({allData.bookEventRequests.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allData.bookEventRequests.length > 0 ? allData.bookEventRequests.map((request) => (
                    <tr key={request?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request?.full_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{request?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request?.event_type || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request?.event_date || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request?.guests || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {request?.price ? `₦${Number(request.price).toLocaleString()}` : 'No price set'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request?.created_at ? formatDate(request.created_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openDetailModal('Event Request Details', request)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button 
                            onClick={() => openEditPriceModal('Event Request', request)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Price"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No event requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* Machine Orders Tab */}
        {activeTab === 'machine-orders' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Machine Orders ({allData.machineOrders.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Installation Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allData.machineOrders.length > 0 ? allData.machineOrders.map((order) => (
                    <tr key={order?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{order?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order?.type || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order?.quantity || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order?.total_price ? `₦${Number(order.total_price).toLocaleString()}` : 'No price set'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order?.installation_address || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order?.submitted_at ? formatDate(order.submitted_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openDetailModal('Machine Order Details', order)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button 
                            onClick={() => openEditPriceModal('Machine Order', order)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Price"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No machine orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Orders Tab */}
        {activeTab === 'product-orders' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Product Orders ({allData.productOrders.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allData.productOrders.length > 0 ? allData.productOrders.map((order) => (
                    <tr key={order?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{order?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {Array.isArray(order?.products) ? order.products.map((p: any) => p.name).join(', ') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order?.total_price ? `₦${Number(order.total_price).toLocaleString()}` : 'No price set'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order?.address || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order?.created_at ? formatDate(order.created_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openDetailModal('Product Order Details', order)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button 
                            onClick={() => openEditPriceModal('Product Order', order)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Price"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No product orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Service Contacts Tab */}
        {activeTab === 'service-contacts' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Service Contacts ({allData.serviceContacts.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message Preview</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allData.serviceContacts.length > 0 ? allData.serviceContacts.map((contact) => (
                    <tr key={contact?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contact?.email || 'No email'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contact?.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {contact?.message ? contact.message.substring(0, 50) + '...' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contact?.created_at ? formatDate(contact.created_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => openDetailModal('Service Contact Details', contact)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No service contacts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* Waitlist Tab */}
        {activeTab === 'waitlist' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Waitlist Entries ({allData.waitlist.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allData.waitlist.length > 0 ? allData.waitlist.map((entry) => (
                    <tr key={entry?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{entry?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{entry?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry?.company || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry?.account_type || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry?.country || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry?.created_at ? formatDate(entry.created_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => openDetailModal('Waitlist Entry Details', entry)}
                          className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No waitlist entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={detailModalTitle}
        data={selectedItem}
      />

      {/* Email Composer Modal */}
      {showComposer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Compose Email</h3>
              <button 
                onClick={() => setShowComposer(false)}
                title="Close composer"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Template Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Template</label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="customer"
                      checked={composer.templateType === 'customer'}
                      onChange={(e) => setComposer({ ...composer, templateType: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Customer Template (Marketing)</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="team"
                      checked={composer.templateType === 'team'}
                      onChange={(e) => setComposer({ ...composer, templateType: e.target.value })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Team Template (Internal)</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {composer.templateType === 'customer' 
                    ? 'Full marketing email with product recommendations and branding' 
                    : 'Clean internal notification email for team members'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <input
                  type="email"
                  value={composer.to}
                  onChange={(e) => setComposer({ ...composer, to: e.target.value })}
                  placeholder="user@example.com, user2@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={composer.subject}
                  onChange={(e) => setComposer({ ...composer, subject: e.target.value })}
                  placeholder="Email subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heading <span className="text-gray-500 text-xs">(Appears as bold section title)</span>
                </label>
                <input
                  type="text"
                  value={composer.heading}
                  onChange={(e) => setComposer({ ...composer, heading: e.target.value })}
                  placeholder="e.g., ORDER CONFIRMATION, NEW MACHINE REQUEST, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={composer.message}
                  onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                  placeholder="Enter your message content here..."
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments <span className="text-gray-500 text-xs">(Optional - Max 10MB per file)</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setComposer({ ...composer, attachments: [...composer.attachments, ...files] });
                    e.target.value = ''; // Reset input to allow re-selecting same file
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {composer.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {composer.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-700 truncate">
                          📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          onClick={() => {
                            const newAttachments = composer.attachments.filter((_, i) => i !== index);
                            setComposer({ ...composer, attachments: newAttachments });
                          }}
                          className="text-red-600 hover:text-red-800 ml-2"
                          title="Remove attachment"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowComposer(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                disabled={sending}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Email Details</h3>
              <button 
                onClick={() => setSelectedEmail(null)}
                title="Close email details"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmail.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmail.last_event)}`}>
                    {selectedEmail.last_event}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">From</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmail.from}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmail.to.join(', ')}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Sent</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedEmail.created_at)}</p>
                </div>
              </div>
              
              {selectedEmail.html && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Content</label>
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {showEditPriceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Edit Price - {editPriceType}</h3>
              <button 
                onClick={() => setShowEditPriceModal(false)}
                title="Close price editor"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer: {editPriceItem?.name || 'Unknown'}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editPriceType === 'Machine Order' && `Machine: ${editPriceItem?.type || 'Unknown'}`}
                  {editPriceType === 'Product Order' && 'Product Order'}
                  {editPriceType === 'Event Request' && `Event: ${editPriceItem?.event_type || 'Unknown'}`}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="Enter price in Naira"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>Current price: {
                  editPriceType === 'Product Order' 
                    ? (editPriceItem?.total_price ? `₦${Number(editPriceItem.total_price).toLocaleString()}` : 'Not set')
                    : (editPriceItem?.price ? `₦${Number(editPriceItem.price).toLocaleString()}` : 'Not set')
                }</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowEditPriceModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={updatePrice}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VintageDashboard;