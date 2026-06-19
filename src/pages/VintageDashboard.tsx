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
  Edit,
  BookOpen,
  Trash2,
  Menu
} from 'lucide-react';
import { MernBlogManagement } from '../components/blog/MernBlogManagement';
import AnalyticsPanel from '../components/AnalyticsPanel';
import Logo from '../assets/Logo_1.png';

interface Email {
  id: string;
  to: string[];
  from: string;
  subject: string;
  created_at: string;
  last_event: string;
  html?: string;
  status?: 'pending' | 'processing' | 'completed';
}



interface AllData {
  bookEventRequests: any[];
  investmentInquiries: any[];
  machineOrders: any[];
  productOrders: any[];
  serviceContacts: any[];
  toxicResults: any[];
  waitlist: any[];
  huskSaleRequests: any[];
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
}

const VintageDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilters, setStatusFilters] = useState({
    'business-emails': 'pending',
    'book-events': 'pending',
    'machine-orders': 'pending',
    'product-orders': 'pending',
    'service-contacts': 'pending',
    'husk-sales': 'pending',
    // No status for waitlist
  });
  const [emails, setEmails] = useState<Email[]>([]);
  const [allData, setAllData] = useState<AllData>({
    bookEventRequests: [],
    investmentInquiries: [],
    machineOrders: [],
    productOrders: [],
    serviceContacts: [],
    toxicResults: [],
    waitlist: [],
    huskSaleRequests: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
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
  const [editItemStatus, setEditItemStatus] = useState<'pending' | 'processing' | 'completed'>('pending');
  const [editItemSection, setEditItemSection] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [deleteItemType, setDeleteItemType] = useState('');
  const [deleteItemSection, setDeleteItemSection] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
    // Temporarily bypass auth check for testing
    if (!isLoggedIn) {
      localStorage.setItem('adminLoggedIn', 'true');
    }
  }, [navigate]);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      // Fetch emails
      const emailResponse = await fetch('/api/data?type=emails');
      if (!emailResponse.ok) {
        throw new Error(`Emails request failed with status ${emailResponse.status}`);
      }
      const emailData = await emailResponse.json();
      if (!emailData.success) {
        throw new Error(emailData.error || 'Failed to fetch emails');
      }
      setEmails(emailData.emails || []);

      // Fetch ALL data from new API
      const allDataResponse = await fetch('/api/data?type=all-data');
      if (!allDataResponse.ok) {
        throw new Error(`Data request failed with status ${allDataResponse.status}`);
      }
      const allDataResult = await allDataResponse.json();
      if (!allDataResult.success) {
        throw new Error(allDataResult.error || allDataResult.message || 'Failed to fetch dashboard data');
      }

      setAllData(allDataResult.data || {
        bookEventRequests: [],
        investmentInquiries: [],
        machineOrders: [],
        productOrders: [],
        serviceContacts: [],
        toxicResults: [],
        waitlist: [],
        huskSaleRequests: []
      });

      if (typeof allDataResult.message === 'string' && allDataResult.message.trim() !== '') {
        setErrorMessage(allDataResult.message);
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown dashboard fetch error';
      console.error('Dashboard fetch error:', err);
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/vintage');
  };

  const handleRefresh = () => fetchData();

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
      const currentMailUser = localStorage.getItem('currentMailUser');
      if (currentMailUser) {
        const parsedUser = JSON.parse(currentMailUser);
        if (parsedUser?.sender_email) {
          formData.append('senderEmail', parsedUser.sender_email);
        }
      }
      
      // Append all attachments
      composer.attachments.forEach((file) => {
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

  // Vintage now hosts refresh and logout controls again, while the email admin list remains in Tweetit.

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
  const openEditPriceModal = (type: string, item: any, section?: string) => {
    setEditPriceType(type);
    setEditPriceItem(item);
    setEditItemSection(section || '');
    
    // Get current price based on item type
    let currentPrice = '';
    if (type === 'Machine Order' || type === 'Event Request') {
      currentPrice = item?.price ? item.price.toString() : '';
    } else if (type === 'Product Order') {
      currentPrice = item?.total_price ? item.total_price.toString() : '';
    } else {
      // For Service Contacts and Husk Sales that don't have prices
      currentPrice = '';
    }
    
    setNewPrice(currentPrice);
    setEditItemStatus(item?.status || 'pending');
    setShowEditPriceModal(true);
  };

  // Update price and status function
  const updatePrice = async () => {
    if (!editPriceItem) {
      alert('No item selected');
      return;
    }

    try {
      // First, update status if needed (for all item types)
      if (editItemSection && editItemStatus !== (editPriceItem?.status || 'pending')) {
        await updateItemStatus(editItemSection, editPriceItem.id, editItemStatus);
      }

      // Only update price if there's a new price entered and it's not a section without price
      if (newPrice && ['Machine Order', 'Product Order', 'Event Request'].includes(editPriceType)) {
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
        if (!data.success) {
          alert(`Failed to update price: ${data.error}`);
          return;
        }
      }

      setShowEditPriceModal(false);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Update error:', err);
      alert('Network error occurred while updating');
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (itemType: string, item: any, section: string) => {
    setDeleteItemType(itemType);
    setDeleteItem(item);
    setDeleteItemSection(section);
    setShowDeleteModal(true);
  };

  // Delete record function
  const deleteRecord = async () => {
    if (!deleteItem || !deleteItemSection) {
      alert('Error: Cannot delete record');
      return;
    }

    try {
      setIsDeleting(true);

      // Map section to table name
      const sectionToTable: Record<string, string> = {
        bookEventRequests: 'book_event_requests',
        machineOrders: 'machine_orders',
        productOrders: 'product_orders',
        serviceContacts: 'service_contacts',
        huskSaleRequests: 'husk_sale_requests',
        waitlist: 'waitlist'
      };

      const table = sectionToTable[deleteItemSection];
      if (!table) {
        alert('Error: Cannot determine table to delete from');
        return;
      }

      // Call API to delete the record
      const response = await fetch('/api/delete-record', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: table,
          id: deleteItem.id
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowDeleteModal(false);
        fetchData(); // Refresh data
      } else {
        alert(`Failed to delete: ${data.error}`);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error occurred while deleting');
    } finally {
      setIsDeleting(false);
    }
  };

  // Detail Modal Component
  const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, data }) => {
    if (!isOpen || !data) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
            <h2 className="text-base sm:text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Close">
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(data)
                .filter(([key, value]) => {
                  if (key === 'id') return false;
                  if (data.account_type === 'buyer' && key === 'products') {
                    if (Array.isArray(value) && value.length > 0) {
                      if (typeof value[0] === 'string') return true;
                      if (value[0]?.name && value[0].name !== 'N/A') return true;
                    }
                    return false;
                  }
                  if (data.account_type === 'seller') {
                    const sellerFields = ['business_type', 'business_category', 'monthly_volume', 'years_experience'];
                    if (sellerFields.includes(key) && value && value !== 'N/A' && value !== '') return true;
                  }
                  const coreFields = ['name', 'email', 'phone', 'company', 'account_type', 'country', 'state', 'city', 
                                      'created_at', 'updated_at', 'address', 'total_price', 'price', 
                                      'products_interested', 'products_other', 'primary_use_case', 'hear_about_us', 
                                      'additional_info', 'type', 'quantity', 'installation_address', 'notes'];
                  if (coreFields.includes(key)) {
                    if (!value || value === 'N/A' || value === '' || (Array.isArray(value) && value.length === 0)) return false;
                    return true;
                  }
                  if (data.account_type === 'buyer') {
                    const sellerOnlyFields = ['monthly_volume', 'years_experience', 'business_type', 'business_category'];
                    if (sellerOnlyFields.includes(key)) return false;
                  }
                  if (data.account_type === 'seller') {
                    const buyerOnlyFields = ['products_interested', 'products_other', 'primary_use_case'];
                    if (buyerOnlyFields.includes(key) && (!value || value === 'N/A' || value === '')) return false;
                  }
                  if (!value || value === 'N/A' || value === '' || (Array.isArray(value) && value.length === 0)) return false;
                  return true;
                })
                .map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2 sm:pb-3 border-b last:border-b-0">
                  <div className="font-medium text-xs sm:text-sm text-gray-700 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </div>
                  <div className="sm:col-span-2 text-xs sm:text-sm text-gray-900 break-words">
                    {typeof value === 'object' && value !== null ? (
                      Array.isArray(value) ? (
                        value.length > 0 && value[0]?.name ? (
                          <div className="space-y-2">
                            {value.map((item: any, index: number) => (
                              <div key={index} className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs">
                                  <div><span className="font-medium">Name:</span> {item.name || 'N/A'}</div>
                                  <div><span className="font-medium">Price:</span> {item.price || 'N/A'}</div>
                                  <div><span className="font-medium">Qty:</span> {item.quantity || 'N/A'}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-xs">
                            {value.length > 0 ? value.join(', ') : 'N/A'}
                          </div>
                        )
                      ) : (
                        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-xs">
                          {Object.entries(value).map(([k, v]) => (
                            <div key={k} className="mb-1">
                              <span className="font-medium">{k}:</span> {String(v)}
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      (key.includes('_at') || key === 'date') && typeof value === 'string' && value.includes('T') ?
                        formatDate(value) :
                        (key === 'total_price' || key === 'price') && typeof value === 'number' && value > 0 ? 
                          `₦${Number(value).toLocaleString()}` : 
                          typeof value === 'string' && value !== 'N/A' ? 
                            value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) :
                            String(value || 'N/A')
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end p-4 sm:p-6 border-t flex-shrink-0">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filter emails by type
  const businessEmailsRaw = Array.isArray(emails) ? emails.filter(email => 
    email?.from?.includes('team@') || email?.to?.some(recipient => recipient.includes('coconoto'))
  ) : [];
  // Add status if missing
  const businessEmails = businessEmailsRaw.map(email => ({
    ...email,
    status: email.status || 'pending',
  }));
  // Helper to filter by status
  const filterByStatus = (items: any[], status: string) => {
    if (!items) return [];
    if (status === 'all') return items;
    return items.filter(item => (item.status || 'pending') === status);
  };
  // Helper to update status and persist to Supabase
  const updateItemStatus = async (section: string, id: string, status: 'pending' | 'processing' | 'completed') => {
    // Map section to table name
    const sectionToTable: Record<string, string> = {
      bookEventRequests: 'book_event_requests',
      machineOrders: 'machine_orders',
      productOrders: 'product_orders',
      serviceContacts: 'service_contacts',
      huskSaleRequests: 'husk_sale_requests',
    };
    const table = sectionToTable[section];
    if (!table) return;
    // Optimistically update UI
    setAllData(prev => {
      const updated = { ...prev };
      const sectionKey = section as keyof AllData;
      updated[sectionKey] = updated[sectionKey].map((item: any) =>
        item.id === id ? { ...item, status } : item
      );
      return updated;
    });
    // Persist to backend
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table, id, status }),
    });
    // Optionally re-fetch data here for consistency
    // fetchData();
  };
  // Helper to update email status
  const updateEmailStatus = (id: string, status: 'pending' | 'processing' | 'completed') => {
    setEmails(prev => prev.map(email =>
      email.id === id ? { ...email, status } : email
    ));
  };

  useEffect(() => {
    fetchData();
    const interval = window.setInterval(() => {
      fetchData();
    }, 30000); // Auto-refresh every 30 seconds

    return () => {
      window.clearInterval(interval);
    };
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
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center min-w-0 gap-2 sm:gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden text-gray-600 hover:text-gray-900 flex-shrink-0"
                title="Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              {/* Logo */}
              <img src={Logo} alt="Coconoto" className="h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={handleRefresh}
                className="bg-green-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-green-700 transition-colors inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-red-700 transition-colors inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <button
                onClick={() => navigate('/tweetit')}
                className="bg-green-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-green-700 transition-colors inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                title="Email Center"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Email Center</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMobileMenu(false)} />
      )}
      <div className={`md:hidden fixed left-0 top-14 bottom-0 w-56 bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
        showMobileMenu ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <nav className="p-4 space-y-1">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'blog', name: 'Blog', icon: BookOpen },
            { id: 'book-events', name: `DrinkEat (${filterByStatus(allData.bookEventRequests, 'pending').length || 0})`, icon: Calendar },
            { id: 'machine-orders', name: `Machines (${filterByStatus(allData.machineOrders, 'pending').length || 0})`, icon: ShoppingCart },
            { id: 'product-orders', name: `Products (${filterByStatus(allData.productOrders, 'pending').length || 0})`, icon: ShoppingCart },
            { id: 'service-contacts', name: `Contact (${filterByStatus(allData.serviceContacts, 'pending').length || 0})`, icon: Send },
            { id: 'husk-sales', name: `Husk (${filterByStatus(allData.huskSaleRequests, 'pending').length || 0})`, icon: ShoppingCart },
            { id: 'waitlist', name: `Waitlist (${allData.waitlist?.length || 0})`, icon: Users },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 },
            
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowMobileMenu(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Navigation - Centered */}
      <div className="hidden md:block bg-white border-b sticky top-0 z-30">
        <div className="px-3 sm:px-4 lg:px-6">
          <nav className="flex justify-center flex-wrap gap-1" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'blog', name: 'Blog', icon: BookOpen },
              { id: 'book-events', name: `DrinkEat (${filterByStatus(allData.bookEventRequests, 'pending').length || 0})`, icon: Calendar },
              { id: 'machine-orders', name: `Machines (${filterByStatus(allData.machineOrders, 'pending').length || 0})`, icon: ShoppingCart },
              { id: 'product-orders', name: `Products (${filterByStatus(allData.productOrders, 'pending').length || 0})`, icon: ShoppingCart },
              { id: 'service-contacts', name: `Contact (${filterByStatus(allData.serviceContacts, 'pending').length || 0})`, icon: Mail },
              { id: 'husk-sales', name: `Husk (${filterByStatus(allData.huskSaleRequests, 'pending').length || 0})`, icon: ShoppingCart },
              { id: 'waitlist', name: `Waitlist (${allData.waitlist?.length || 0})`, icon: Users },
              { id: 'analytics', name: 'Analytics', icon: BarChart3 },
              
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
                  } py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm inline-flex items-center gap-1 sm:gap-2 transition-colors`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-8">
        {errorMessage && (
          <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            <strong>Dashboard status:</strong> {errorMessage}
            <button
              onClick={handleRefresh}
              className="ml-3 inline-flex items-center rounded bg-yellow-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-yellow-700"
            >
              Retry
            </button>
          </div>
        )}
        <div className="mb-4 text-xs text-gray-500">
          Auto-refresh every 30 seconds. Last update: {lastUpdated || 'Not yet refreshed'}.
        </div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{allData.bookEventRequests?.length || 0}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">DrinkEat</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{allData.productOrders?.length || 0}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Product Orders</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{allData.huskSaleRequests?.length || 0}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Husk Sales</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{allData.waitlist?.length || 0}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Waitlist</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-pink-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{allData.serviceContacts?.length || 0}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Contact</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {Object.values(allData).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent DrinkEat</h2>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {allData.bookEventRequests?.length > 0 ? allData.bookEventRequests.slice(0, 5).map((request) => (
                    <div key={request?.id || Math.random()} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium text-gray-900 truncate">{request?.full_name || 'Unknown'}</p>
                      <p className="text-xs sm:text-xs text-gray-500 mt-0.5 line-clamp-2">{request?.event_type || 'Unknown'} • {request?.event_date || 'No date'}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                        New
                      </span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-6 sm:py-8">No DrinkEat requests yet</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Machines</h2>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {allData.machineOrders?.length > 0 ? allData.machineOrders.slice(0, 5).map((order) => (
                    <div key={order?.id || Math.random()} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium text-gray-900 truncate">{order?.name || 'Unknown'}</p>
                      <p className="text-xs sm:text-xs text-gray-500 mt-0.5">{order?.type || 'Unknown'} × {order?.quantity || 1}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                        Pending
                      </span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-6 sm:py-8">No orders yet</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Waitlist</h2>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {allData.waitlist?.length > 0 ? allData.waitlist.slice(0, 5).map((entry) => (
                    <div key={entry?.id || Math.random()} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-medium text-gray-900 truncate">{entry?.name || 'Unknown'}</p>
                      <p className="text-xs sm:text-xs text-gray-500 mt-0.5 line-clamp-1">{entry?.company || 'No company'}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                        {entry?.account_type || 'User'}
                      </span>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 py-6 sm:py-8">No entries yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Tab */}
        {activeTab === 'blog' && <MernBlogManagement />}

        {/* Business Emails Tab */}
        {activeTab === 'business-emails' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Business Emails ({filterByStatus(businessEmails, statusFilters['business-emails']).length})</h2>
              <div>
                <select
                  value={statusFilters['business-emails']}
                  onChange={e => setStatusFilters({ ...statusFilters, 'business-emails': e.target.value })}
                  className="border rounded px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            
            {/* Mobile card view */}
            <div className="sm:hidden divide-y">
              {filterByStatus(businessEmails, statusFilters['business-emails']).length > 0 ? filterByStatus(businessEmails, statusFilters['business-emails']).map((email) => (
                email.status !== 'completed' || statusFilters['business-emails'] === 'completed' || statusFilters['business-emails'] === 'all' ? (
                <div key={email?.id || Math.random()} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{email?.subject || 'No Subject'}</p>
                      <p className="text-xs text-gray-500 mt-1">From: {email?.from || 'Unknown'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(email?.status || 'pending')}`}>{email?.status || 'pending'}</span>
                  </div>
                  <p className="text-xs text-gray-600">To: {email?.to ? email.to.join(', ') : 'No recipients'}</p>
                  <p className="text-xs text-gray-500">{email?.created_at ? formatDate(email.created_at) : 'Unknown'}</p>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <select
                      value={email.status || 'pending'}
                      onChange={e => updateEmailStatus(email.id, e.target.value as any)}
                      className="border rounded px-2 py-1 text-xs flex-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button 
                      onClick={() => setSelectedEmail(email)}
                      className="text-green-600 hover:text-green-900 text-xs whitespace-nowrap"
                    >
                      View
                    </button>
                  </div>
                </div>
                ) : null
              )) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No business emails found
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">To</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterByStatus(businessEmails, statusFilters['business-emails']).length > 0 ? filterByStatus(businessEmails, statusFilters['business-emails']).map((email) => (
                    email.status !== 'completed' || statusFilters['business-emails'] === 'completed' || statusFilters['business-emails'] === 'all' ? (
                    <tr key={email?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{email?.subject || 'No Subject'}</div>
                        <div className="text-sm text-gray-500">From: {email?.from || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{email?.to ? email.to.join(', ') : 'No recipients'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(email?.status || 'pending')}`}>{email?.status || 'pending'}</span>
                        <select
                          value={email.status || 'pending'}
                          onChange={e => updateEmailStatus(email.id, e.target.value as any)}
                          className="ml-2 border rounded px-2 py-1 text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                        </select>
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
                    ) : null
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">DrinkEat Requests ({filterByStatus(allData.bookEventRequests, statusFilters['book-events']).length})</h2>
              <div>
                <select
                  value={statusFilters['book-events']}
                  onChange={e => setStatusFilters({ ...statusFilters, 'book-events': e.target.value })}
                  className="border rounded px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            
            {/* Mobile card view */}
            <div className="sm:hidden divide-y">
              {filterByStatus(allData.bookEventRequests, statusFilters['book-events']).length > 0 ? filterByStatus(allData.bookEventRequests, statusFilters['book-events']).map((request) => (
                request.status !== 'completed' || statusFilters['book-events'] === 'completed' || statusFilters['book-events'] === 'all' ? (
                <div key={request?.id || Math.random()} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{request?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{request?.email || 'No email'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(request?.status || 'pending')}`}>{request?.status || 'pending'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Event: {request?.event_type || 'N/A'}</div>
                    <div>Date: {request?.event_date || 'N/A'}</div>
                    <div>Guests: {request?.guests || 'N/A'}</div>
                    <div>Price: {request?.price ? `₦${Number(request.price).toLocaleString()}` : 'Not set'}</div>
                  </div>
                  <p className="text-xs text-gray-500">{request?.created_at ? formatDate(request.created_at) : 'Unknown'}</p>
                  <div className="flex items-center gap-1.5 pt-2 border-t flex-wrap">
                    <button 
                      onClick={() => openDetailModal('Event Request Details', request)}
                      className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded hover:bg-green-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditPriceModal('Event Request', request, 'bookEventRequests')}
                      className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal('Event Request', request, 'bookEventRequests')}
                      className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                ) : null
              )) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No event requests found
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterByStatus(allData.bookEventRequests, statusFilters['book-events']).length > 0 ? filterByStatus(allData.bookEventRequests, statusFilters['book-events']).map((request) => (
                    request.status !== 'completed' || statusFilters['book-events'] === 'completed' || statusFilters['book-events'] === 'all' ? (
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
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request?.status || 'pending')}`}>{request?.status || 'pending'}</span>
                      </td>
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
                            onClick={() => openEditPriceModal('Event Request', request, 'bookEventRequests')}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Price & Status"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal('Event Request', request, 'bookEventRequests')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-xs"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ) : null
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Machine Orders ({filterByStatus(allData.machineOrders, statusFilters['machine-orders']).length})</h2>
              <div>
                <select
                  value={statusFilters['machine-orders']}
                  onChange={e => setStatusFilters({ ...statusFilters, 'machine-orders': e.target.value })}
                  className="border rounded px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            
            {/* Mobile card view */}
            <div className="sm:hidden divide-y">
              {filterByStatus(allData.machineOrders, statusFilters['machine-orders']).length > 0 ? filterByStatus(allData.machineOrders, statusFilters['machine-orders']).map((order) => (
                order.status !== 'completed' || statusFilters['machine-orders'] === 'completed' || statusFilters['machine-orders'] === 'all' ? (
                <div key={order?.id || Math.random()} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{order?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order?.email || 'No email'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(order?.status || 'pending')}`}>{order?.status || 'pending'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Machine: {order?.type || 'N/A'}</div>
                    <div>Qty: {order?.quantity || 'N/A'}</div>
                    <div>Price: {order?.total_price ? `₦${Number(order.total_price).toLocaleString()}` : 'Not set'}</div>
                    <div>{order?.created_at ? formatDate(order.created_at) : 'Unknown'}</div>
                  </div>
                  <p className="text-xs text-gray-600 truncate">Address: {order?.installation_address || 'N/A'}</p>
                  <div className="flex items-center gap-1.5 pt-2 border-t flex-wrap">
                    <button 
                      onClick={() => openDetailModal('Machine Order Details', order)}
                      className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded hover:bg-green-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditPriceModal('Machine Order', order, 'machineOrders')}
                      className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal('Machine Order', order, 'machineOrders')}
                      className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                ) : null
              )) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No machine orders found
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Machine Type</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterByStatus(allData.machineOrders, statusFilters['machine-orders']).length > 0 ? filterByStatus(allData.machineOrders, statusFilters['machine-orders']).map((order) => (
                    order.status !== 'completed' || statusFilters['machine-orders'] === 'completed' || statusFilters['machine-orders'] === 'all' ? (
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
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order?.status || 'pending')}`}>{order?.status || 'pending'}</span>
                      </td>
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
                            onClick={() => openEditPriceModal('Machine Order', order, 'machineOrders')}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Price & Status"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal('Machine Order', order, 'machineOrders')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-xs"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ) : null
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Product Orders ({filterByStatus(allData.productOrders, statusFilters['product-orders']).length})</h2>
              <div>
                <select
                  value={statusFilters['product-orders']}
                  onChange={e => setStatusFilters({ ...statusFilters, 'product-orders': e.target.value })}
                  className="border rounded px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            
            {/* Mobile card view */}
            <div className="sm:hidden divide-y">
              {filterByStatus(allData.productOrders, statusFilters['product-orders']).length > 0 ? filterByStatus(allData.productOrders, statusFilters['product-orders']).map((order) => (
                order.status !== 'completed' || statusFilters['product-orders'] === 'completed' || statusFilters['product-orders'] === 'all' ? (
                <div key={order?.id || Math.random()} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{order?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{order?.email || 'No email'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(order?.status || 'pending')}`}>{order?.status || 'pending'}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Products: {Array.isArray(order?.products) ? order.products.map((p: any) => p.name).join(', ') : 'N/A'}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Price: {order?.total_price ? `₦${Number(order.total_price).toLocaleString()}` : 'Not set'}</div>
                    <div>{order?.created_at ? formatDate(order.created_at).split(',')[0] : 'Unknown'}</div>
                  </div>
                  <p className="text-xs text-gray-600 truncate">Address: {order?.address || 'N/A'}</p>
                  <div className="flex items-center gap-1.5 pt-2 border-t flex-wrap">
                    <button 
                      onClick={() => openDetailModal('Product Order Details', order)}
                      className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded hover:bg-green-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditPriceModal('Product Order', order, 'productOrders')}
                      className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal('Product Order', order, 'productOrders')}
                      className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                ) : null
              )) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No product orders found
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterByStatus(allData.productOrders, statusFilters['product-orders']).length > 0 ? filterByStatus(allData.productOrders, statusFilters['product-orders']).map((order) => (
                    order.status !== 'completed' || statusFilters['product-orders'] === 'completed' || statusFilters['product-orders'] === 'all' ? (
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
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order?.status || 'pending')}`}>{order?.status || 'pending'}</span>
                      </td>
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
                            onClick={() => openEditPriceModal('Product Order', order, 'productOrders')}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Price & Status"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal('Product Order', order, 'productOrders')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-xs"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ) : null
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Contact Messages ({filterByStatus(allData.serviceContacts, statusFilters['service-contacts']).length})</h2>
              <div>
                <select
                  value={statusFilters['service-contacts']}
                  onChange={e => setStatusFilters({ ...statusFilters, 'service-contacts': e.target.value })}
                  className="border rounded px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            
            {/* Mobile card view */}
            <div className="sm:hidden divide-y">
              {filterByStatus(allData.serviceContacts, statusFilters['service-contacts']).length > 0 ? filterByStatus(allData.serviceContacts, statusFilters['service-contacts']).map((contact) => (
                contact.status !== 'completed' || statusFilters['service-contacts'] === 'completed' || statusFilters['service-contacts'] === 'all' ? (
                <div key={contact?.id || Math.random()} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{contact?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{contact?.email || 'No email'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(contact?.status || 'pending')}`}>{contact?.status || 'pending'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Phone: {contact?.phone || 'N/A'}</div>
                    <div>{contact?.created_at ? formatDate(contact.created_at).split(',')[0] : 'Unknown'}</div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">Message: {contact?.message ? contact.message.substring(0, 100) + '...' : 'N/A'}</p>
                  <div className="flex items-center gap-1.5 pt-2 border-t flex-wrap">
                    <button 
                      onClick={() => openDetailModal('Service Contact Details', contact)}
                      className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded hover:bg-green-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditPriceModal('Service Contact', contact, 'serviceContacts')}
                      className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal('Service Contact', contact, 'serviceContacts')}
                      className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                ) : null
              )) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No service contacts found
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message Preview</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterByStatus(allData.serviceContacts, statusFilters['service-contacts']).length > 0 ? filterByStatus(allData.serviceContacts, statusFilters['service-contacts']).map((contact) => (
                    contact.status !== 'completed' || statusFilters['service-contacts'] === 'completed' || statusFilters['service-contacts'] === 'all' ? (
                    <tr key={contact?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{contact?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contact?.email || 'No email'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contact?.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {contact?.message ? contact.message.substring(0, 50) + '...' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{contact?.created_at ? formatDate(contact.created_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact?.status || 'pending')}`}>{contact?.status || 'pending'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openDetailModal('Service Contact Details', contact)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button 
                            onClick={() => openEditPriceModal('Service Contact', contact, 'serviceContacts')}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Status"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal('Service Contact', contact, 'serviceContacts')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-xs"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ) : null
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No service contacts found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Husk Sales Tab */}
        {activeTab === 'husk-sales' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Husk Sales ({filterByStatus(allData.huskSaleRequests, statusFilters['husk-sales']).length})</h2>
              <div>
                <select
                  value={statusFilters['husk-sales']}
                  onChange={e => setStatusFilters({ ...statusFilters, 'husk-sales': e.target.value })}
                  className="border rounded px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="all">Show All</option>
                </select>
              </div>
            </div>
            
            {/* Mobile card view */}
            <div className="sm:hidden divide-y">
              {filterByStatus(allData.huskSaleRequests, statusFilters['husk-sales']).length > 0 ? filterByStatus(allData.huskSaleRequests, statusFilters['husk-sales']).map((request) => (
                request.status !== 'completed' || statusFilters['husk-sales'] === 'completed' || statusFilters['husk-sales'] === 'all' ? (
                <div key={request?.id || Math.random()} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{request?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{request?.email || 'No email'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(request?.status || 'pending')}`}>{request?.status || 'pending'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Phone: {request?.phone || 'N/A'}</div>
                    <div className="flex items-center gap-1">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        {request?.number_of_sacks || 0} sacks
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{request?.created_at ? formatDate(request.created_at) : 'Unknown'}</p>
                  <div className="flex items-center gap-1.5 pt-2 border-t flex-wrap">
                    <button 
                      onClick={() => openDetailModal('Husk Sale Request Details', request)}
                      className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded hover:bg-green-50"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openEditPriceModal('Husk Sale', request, 'huskSaleRequests')}
                      className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openDeleteModal('Husk Sale', request, 'huskSaleRequests')}
                      className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                ) : null
              )) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No husk sale requests found
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sacks</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filterByStatus(allData.huskSaleRequests, statusFilters['husk-sales']).length > 0 ? filterByStatus(allData.huskSaleRequests, statusFilters['husk-sales']).map((request) => (
                    request.status !== 'completed' || statusFilters['husk-sales'] === 'completed' || statusFilters['husk-sales'] === 'all' ? (
                    <tr key={request?.id || Math.random()} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{request?.email || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request?.phone || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {request?.number_of_sacks || 0} sacks
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request?.created_at ? formatDate(request.created_at) : 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request?.status || 'pending')}`}>{request?.status || 'pending'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openDetailModal('Husk Sale Request Details', request)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button 
                            onClick={() => openEditPriceModal('Husk Sale', request, 'huskSaleRequests')}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 text-xs"
                            title="Edit Status"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal('Husk Sale', request, 'huskSaleRequests')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-xs"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    ) : null
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No husk sale requests found
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Waitlist Entries ({allData.waitlist.length})</h2>
            </div>
            
            {/* Mobile card view */}
            <div className="sm:hidden divide-y">
              {allData.waitlist.length > 0 ? allData.waitlist.map((entry) => (
                <div key={entry?.id || Math.random()} className="p-4 space-y-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{entry?.email || 'No email'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Company: {entry?.company || 'N/A'}</div>
                    <div>Type: {entry?.account_type || 'N/A'}</div>
                    <div>Country: {entry?.country || 'N/A'}</div>
                    <div>{entry?.created_at ? formatDate(entry.created_at).split(',')[0] : 'Unknown'}</div>
                  </div>
                  <div className="flex items-center gap-1.5 pt-2 border-t">
                    <button 
                      onClick={() => openDetailModal('Waitlist Entry Details', entry)}
                      className="text-green-600 hover:text-green-900 text-xs px-2 py-1 rounded hover:bg-green-50 flex-1"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => openDeleteModal('Waitlist Entry', entry, 'waitlist')}
                      className="text-red-600 hover:text-red-900 text-xs px-2 py-1 rounded hover:bg-red-50 flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  No waitlist entries found
                </div>
              )}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openDetailModal('Waitlist Entry Details', entry)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button 
                            onClick={() => openDeleteModal('Waitlist Entry', entry, 'waitlist')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1 text-xs"
                            title="Delete Record"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No waitlist entries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Analytics</h2>
            </div>
            <div className="p-4 sm:p-6">
              <AnalyticsPanel />
            </div>
          </div>
        )}

        {/* Email center moved to /tweetit */}
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Compose Email</h3>
              <button 
                onClick={() => setShowComposer(false)}
                title="Close composer"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
              {/* Template Type Toggle */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Template</label>
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="customer"
                      checked={composer.templateType === 'customer'}
                      onChange={(e) => setComposer({ ...composer, templateType: e.target.value })}
                      className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Customer</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="templateType"
                      value="team"
                      checked={composer.templateType === 'team'}
                      onChange={(e) => setComposer({ ...composer, templateType: e.target.value })}
                      className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Team</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {composer.templateType === 'customer' ? 'Marketing email' : 'Internal notification'}
                </p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <input
                  type="email"
                  value={composer.to}
                  onChange={(e) => setComposer({ ...composer, to: e.target.value })}
                  placeholder="user@example.com, user2@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={composer.subject}
                  onChange={(e) => setComposer({ ...composer, subject: e.target.value })}
                  placeholder="Email subject"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Heading <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={composer.heading}
                  onChange={(e) => setComposer({ ...composer, heading: e.target.value })}
                  placeholder="e.g., ORDER CONFIRMATION"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={composer.message}
                  onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                  placeholder="Enter your message..."
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Attachments <span className="text-gray-500 text-xs">(Max 10MB per file)</span>
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setComposer({ ...composer, attachments: [...composer.attachments, ...files] });
                    e.target.value = '';
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {composer.attachments.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {composer.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md text-xs sm:text-sm">
                        <span className="text-gray-700 truncate">
                          📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <button
                          onClick={() => {
                            const newAttachments = composer.attachments.filter((_, i) => i !== index);
                            setComposer({ ...composer, attachments: newAttachments });
                          }}
                          className="text-red-600 hover:text-red-800 ml-2 flex-shrink-0"
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
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-end gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setShowComposer(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                disabled={sending}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-1 sm:gap-2"
              >
                {sending ? <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                <span className="hidden sm:inline">{sending ? 'Sending...' : 'Send'}</span>
                <span className="sm:hidden">{sending ? 'Sending' : 'Send'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-40">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Email Details</h3>
              <button 
                onClick={() => setSelectedEmail(null)}
                title="Close email details"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Subject</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{selectedEmail.subject}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedEmail.last_event)}`}>
                    {selectedEmail.last_event}
                  </span>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">From</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{selectedEmail.from}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">To</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{selectedEmail.to.join(', ')}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Sent</label>
                  <p className="mt-1 text-xs sm:text-sm text-gray-900">{formatDate(selectedEmail.created_at)}</p>
                </div>
              </div>
              
              {selectedEmail.html && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Content</label>
                  <div className="border rounded-lg p-3 sm:p-4 bg-gray-50 max-h-60 overflow-y-auto text-xs sm:text-sm">
                    <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditPriceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Edit - {editPriceType}</h3>
              <button 
                onClick={() => setShowEditPriceModal(false)}
                title="Close editor"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Customer: {editPriceItem?.name || 'Unknown'}
                </label>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {editPriceType === 'Machine Order' && `Machine: ${editPriceItem?.type || 'Unknown'}`}
                  {editPriceType === 'Product Order' && 'Product Order'}
                  {editPriceType === 'Event Request' && `Event: ${editPriceItem?.event_type || 'Unknown'}`}
                  {editPriceType === 'Service Contact' && 'Service Inquiry'}
                  {editPriceType === 'Husk Sale' && `Sacks: ${editPriceItem?.number_of_sacks || 0}`}
                </label>
              </div>
              
              {['Machine Order', 'Product Order', 'Event Request'].includes(editPriceType) && (
                <>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="Enter price in Naira"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <p>Current: {
                      editPriceType === 'Product Order' 
                        ? (editPriceItem?.total_price ? `₦${Number(editPriceItem.total_price).toLocaleString()}` : 'Not set')
                        : (editPriceItem?.price ? `₦${Number(editPriceItem.price).toLocaleString()}` : 'Not set')
                    }</p>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editItemStatus}
                  onChange={(e) => setEditItemStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                </select>
                <p className="text-xs text-gray-600 mt-1">Current: {editPriceItem?.status || 'pending'}</p>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowEditPriceModal(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={updatePrice}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Delete {deleteItemType}</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                title="Close"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Delete this {deleteItemType.toLowerCase()}?</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Customer: <span className="font-semibold">{deleteItem?.name || 'Unknown'}</span>
                </p>
                <p className="text-red-600 text-xs font-medium mt-3">
                  ⚠️ This cannot be undone.
                </p>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={deleteRecord}
                disabled={isDeleting}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 inline-flex items-center gap-1 sm:gap-2"
              >
                {isDeleting ? <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                <span className="hidden sm:inline">{isDeleting ? 'Deleting...' : 'Delete'}</span>
                <span className="sm:hidden">{isDeleting ? 'Deleting' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VintageDashboard;