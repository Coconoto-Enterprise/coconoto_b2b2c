import React, { useState, useEffect } from 'react';
import Logo from '../../assets/Logo_1.png';
import {
  getSentEmails,
  searchSentEmails,
  getSentEmailsBySender,
  getMailUsers,
  createMailUser,
  deleteEmail,
  EmailLog,
  MailUser,
} from '../../services/emailConfigService';

interface SentEmailsListProps {
  isLoading?: boolean;
  refreshKey?: number;
  viewerEmail?: string;
  mobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
}

export const SentEmailsList: React.FC<SentEmailsListProps> = ({ isLoading: initialLoading = false, refreshKey, viewerEmail, mobileSidebarOpen = false, onToggleMobileSidebar }) => {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<'all' | 'sent' | 'drafts' | 'failed'>('all');
  const [page, setPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);
  const [mailUsers, setMailUsers] = useState<MailUser[]>([]);
  const [currentUser, setCurrentUser] = useState<MailUser | null>(null);
  const [selectedSender, setSelectedSender] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const currentUserEmail = currentUser?.login_email || (currentUser as any)?.email || '';
  const [newUser, setNewUser] = useState({ login_email: '', sender_email: '', password: '', role: 'user' });
  const [modalError, setModalError] = useState('');

  const ITEMS_PER_PAGE = 25;

  const formatDateShort = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateLong = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  };

  useEffect(() => {
    const storedMailUser = localStorage.getItem('currentMailUser');
    if (storedMailUser) {
      try {
        const parsed = JSON.parse(storedMailUser);
        setCurrentUser(parsed);
        if (parsed?.role !== 'admin' && parsed?.sender_email) {
          setSelectedSender(parsed.sender_email);
        }
      } catch (error) {
        console.error('Failed to parse currentMailUser', error);
      }
    }
  }, []);

  useEffect(() => {
    const loadMailUsers = async () => {
      const users = await getMailUsers();
      setMailUsers(users || []);
    };

    loadMailUsers();
  }, []);

  // Fetch emails
  const loadEmails = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;

      let allEmails: EmailLog[] = [];
      if (searchQuery.trim()) {
        allEmails = await searchSentEmails(searchQuery, ITEMS_PER_PAGE, viewerEmail);
        setTotalEmails(allEmails.length);
      } else if (selectedSender) {
        const result = await getSentEmailsBySender(selectedSender, ITEMS_PER_PAGE, offset);
        allEmails = result.emails;
        setTotalEmails(result.total || 0);
      } else {
        const result = await getSentEmails(ITEMS_PER_PAGE, offset, viewerEmail);
        allEmails = result.emails;
        setTotalEmails(result.total || 0);
      }

      let filtered = allEmails;
      if (currentFolder === 'sent') {
        filtered = filtered.filter(email => email.status === 'delivered');
      } else if (currentFolder === 'failed') {
        filtered = filtered.filter(email => email.status === 'failed');
      } else if (currentFolder === 'drafts') {
        filtered = filtered.filter(email => email.status === 'draft');
      }

      setEmails(filtered);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, [page, searchQuery, currentFolder, refreshKey, viewerEmail, selectedSender]);

  const handleDeleteEmailClick = async (emailId: string) => {
    if (!currentUser || currentUser.role !== 'admin') {
      alert('Only admins can delete emails.');
      return;
    }

    const confirmed = window.confirm('Delete this email? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    const success = await deleteEmail(emailId, currentUser.id, currentUserEmail);
    if (!success) {
      alert('Failed to delete email. Please try again.');
      return;
    }

    setSelectedEmail(null);
    await loadEmails();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'bounced':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'failed':
        return '✗';
      case 'bounced':
        return '⚠';
      default:
        return '◐';
    }
  };

  const truncatePreview = (text: string | undefined, length: number = 100) => {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  const handleUserSelection = (senderEmail: string) => {
    setSelectedSender(senderEmail);
    setSearchQuery('');
    setPage(1);
  };

  const handleCreateUser = async () => {
    setModalError('');
    if (!newUser.login_email || !newUser.password || !newUser.sender_email) {
      setModalError('Please fill all required fields.');
      return;
    }

    const created = await createMailUser(
      newUser.login_email,
      newUser.password,
      newUser.sender_email,
      newUser.role,
    );

    if (!created) {
      setModalError('Failed to create mail user. Please check the values and try again.');
      return;
    }

    setNewUser({ login_email: '', sender_email: '', password: '', role: 'user' });
    setShowAddUserModal(false);
    const users = await getMailUsers();
    setMailUsers(users || []);
  };

  const totalPages = Math.ceil(totalEmails / ITEMS_PER_PAGE);

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden rounded-none shadow-sm min-h-0" style={{ backgroundColor: '#f5f5f5' }}>
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onToggleMobileSidebar} />
          <div className="absolute left-0 top-0 bottom-0 w-[80vw] max-w-xs bg-white border-r border-gray-200 flex flex-col min-h-full shadow-xl" style={{ borderRightColor: '#d4a574' }}>
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <img src={Logo} alt="Coconoto" className="h-8 w-8 object-contain" />
                <div className="text-sm font-semibold text-gray-900">Email Center</div>
              </div>
              <button
                onClick={onToggleMobileSidebar}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-700"
                title="Close sidebar"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 min-h-0 py-2 px-2 flex flex-col">
              <section className="mb-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Folders</div>
                <div className="space-y-1">
                  {[
                    { label: 'All', value: 'all' },
                    { label: 'Sent', value: 'sent' },
                    { label: 'Failed', value: 'failed' }
                  ].map(folder => (
                    <button
                      key={folder.value}
                      onClick={() => {
                        setCurrentFolder(folder.value as any);
                        setPage(1);
                        onToggleMobileSidebar?.();
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition ${
                        currentFolder === folder.value
                          ? 'font-semibold text-white bg-green-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {folder.label}
                    </button>
                  ))}
                </div>
              </section>

              {(currentUser?.role === 'admin' || currentUser) && (
                <section className="mb-4 flex flex-col flex-1 min-h-0">
                  <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Mail Users</div>

                  {/* Fixed All users button (not part of scroll) */}
                  <div className="mb-2">
                    <button
                      onClick={() => {
                        handleUserSelection('');
                        onToggleMobileSidebar?.();
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl transition ${
                        selectedSender === '' ? 'bg-green-100 text-green-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All users
                    </button>
                  </div>

                  {/* Scrollable user list only */}
                  <div className="overflow-y-auto flex-1 pr-1 space-y-2 max-h-[40vh]">
                    {mailUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          handleUserSelection(user.sender_email);
                          onToggleMobileSidebar?.();
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl transition ${
                          selectedSender === user.sender_email ? 'bg-green-100 text-green-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {user.login_email}
                      </button>
                    ))}
                  </div>

                  {currentUser?.role === 'admin' && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setShowAddUserModal(true);
                          onToggleMobileSidebar?.();
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-gray-100 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Add mail user
                      </button>
                    </div>
                  )}
                </section>
              )}
            </div>

            {currentUser && (
              <div className="border-t border-gray-200 p-4 text-sm text-gray-700">
                <div className="font-semibold truncate">{currentUserEmail}</div>
                <div className="text-gray-500">{currentUser.role}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Left Sidebar */}
        <div className="hidden md:flex w-96 bg-white border-r border-gray-200 flex-col h-full min-h-0" style={{ borderRightColor: '#d4a574' }}>
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Coconoto" className="h-8 w-8 object-contain" />
            <div className="text-sm font-semibold">Email Center</div>
          </div>
        </div>
        <div className="flex-1 py-2 flex flex-col min-h-0">
          <nav className="space-y-1 px-2">
            {[
              { label: 'All', value: 'all' },
              { label: 'Sent', value: 'sent' },
              { label: 'Failed', value: 'failed' }
            ].map(folder => (
              <button
                key={folder.value}
                onClick={() => {
                  setCurrentFolder(folder.value as any);
                  setPage(1);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  currentFolder === folder.value
                    ? 'font-semibold text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={
                  currentFolder === folder.value
                    ? { backgroundColor: '#8CC63F' }
                    : {}
                }
              >
                {folder.label}
              </button>
            ))}
          </nav>
        </div>

        {(currentUser?.role === 'admin' || currentUser) && (
          <div className="px-4 py-4 border-t border-gray-200 flex flex-col min-h-0">
            {currentUser?.role === 'admin' && (
              <div className="space-y-4 flex-1 min-h-0 flex flex-col">
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Mail Users</div>

                  {/* Fixed All users button */}
                  <div className="mb-2">
                    <button
                      onClick={() => handleUserSelection('')}
                      className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition ${
                        selectedSender === '' ? 'bg-green-100 text-green-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="block truncate">All users</span>
                    </button>
                  </div>

                  {/* Scrollable user list only */}
                  <div className="overflow-y-auto overflow-x-hidden flex-1 pr-1">
                    {mailUsers.map(user => (
                      <button
                        key={user.id}
                        onClick={() => handleUserSelection(user.sender_email)}
                        className={`w-full text-left px-3 py-2 rounded-lg mb-2 transition ${
                          selectedSender === user.sender_email ? 'bg-green-100 text-green-900 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="block truncate">{user.login_email}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-700 font-bold hover:bg-gray-200"
                  >
                    Add mail user
                  </button>
                </div>
              </div>
            )}

            {currentUser && (
              <div className="mt-4 text-sm text-gray-700">
                <div className="font-semibold">{currentUserEmail} ({currentUser.role})</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white h-full min-h-0">
        {/* Search Bar */}
        <div className="border-b border-gray-200 p-4" style={{ borderBottomColor: '#d4a574' }}>
          <input
            type="text"
            placeholder="Search emails by subject, sender, or recipient..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
          />
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-3" style={{ color: '#8CC63F' }}>
                ⟳
              </div>
              <p className="text-gray-500">Loading emails...</p>
            </div>
          </div>
        ) : emails.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl mb-3">📭</p>
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No emails match your search' : 'No emails to display'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Email Items */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {emails.map(email => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`border-b border-gray-100 px-6 py-4 hover:bg-gray-50 cursor-pointer transition ${
                    selectedEmail?.id === email.id ? 'bg-blue-50' : ''
                  }`}
                  style={selectedEmail?.id === email.id ? { backgroundColor: '#f0e5d8' } : {}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Status Icon */}
                      <div className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(email.status)}`}>
                        {getStatusIcon(email.status)}
                      </div>

                      {/* From Address */}
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: '#8b5e47' }}>
                          {email.from_address}
                        </p>
                        <p className="text-sm text-gray-600">
                          To: {email.to_addresses.join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-right text-sm text-gray-500 whitespace-nowrap ml-4">
                      {formatDateShort(email.created_at)}
                    </div>
                  </div>

                  {/* Subject & Preview */}
                  <div className="ml-9">
                    <p className="font-semibold text-gray-900">{email.subject}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {truncatePreview(email.preview)}
                    </p>
                  </div>

                  {/* Email Type Badge */}
                  {email.email_type && (
                    <div className="ml-9 mt-2">
                      <span
                        className="inline-block text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: '#8CC63F' }}
                      >
                        {email.email_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between" style={{ borderTopColor: '#d4a574' }}>
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages} ({totalEmails} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email Detail Panel (Right Side) */}
      {selectedEmail && (
        <div className="w-[36rem] border-l border-gray-200 bg-white overflow-y-auto flex flex-col" style={{ borderLeftColor: '#d4a574' }}>
          {/* Detail Header */}
          <div className="border-b border-gray-200 p-4 sticky top-0 bg-white" style={{ borderBottomColor: '#d4a574' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg" style={{ color: '#8b5e47' }}>
                Email Details
              </h3>
              <div className="flex items-center gap-2">
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => handleDeleteEmailClick(selectedEmail.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                  title="Close details"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Detail Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* From */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">From</label>
              <p className="text-sm font-mono text-gray-900 mt-1">{selectedEmail.from_address}</p>
            </div>

            {/* To */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">To</label>
              <div className="text-sm font-mono text-gray-900 mt-1 space-y-1">
                {selectedEmail.to_addresses.map((addr, i) => (
                  <p key={i}>{addr}</p>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">Subject</label>
              <p className="text-sm font-semibold text-gray-900 mt-1">{selectedEmail.subject}</p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Status</label>
              <div className="inline-block text-sm px-3 py-1.5 rounded-full text-white font-semibold"
                style={{ backgroundColor: selectedEmail.status === 'delivered' ? '#618A42' : selectedEmail.status === 'failed' ? '#dc2626' : '#f59e0b' }}
              >
                {selectedEmail.status.charAt(0).toUpperCase() + selectedEmail.status.slice(1)}
              </div>
            </div>

            {/* Email Type */}
            {selectedEmail.email_type && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Type</label>
                <p className="text-sm text-gray-900 mt-1 capitalize">
                  {selectedEmail.email_type.replace(/_/g, ' ')}
                </p>
              </div>
            )}

            {/* Sent At */}
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase">Sent</label>
              <p className="text-sm text-gray-900 mt-1">
                {formatDateLong(selectedEmail.created_at)}
              </p>
            </div>

            {/* Resend ID */}
            {selectedEmail.resend_id && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Resend ID</label>
                <p className="text-xs font-mono text-gray-600 mt-1 break-all">{selectedEmail.resend_id}</p>
              </div>
            )}

            {/* Email Preview */}
            {selectedEmail.preview && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Preview</label>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{selectedEmail.preview}</p>
              </div>
            )}

            {/* Full HTML (if available) */}
            {selectedEmail.full_html && (
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase">Full Email</label>
                <div
                  className="mt-2 p-3 bg-gray-50 rounded-lg text-sm overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.full_html }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentEmailsList;
