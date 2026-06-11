import React, { useState, useEffect } from 'react';
import { getSentEmails, searchSentEmails, EmailLog } from '../../services/emailConfigService';

interface SentEmailsListProps {
  isLoading?: boolean;
}

export const SentEmailsList: React.FC<SentEmailsListProps> = ({ isLoading: initialLoading = false }) => {
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all'); // 'all', 'delivered', 'failed'
  const [currentFolder, setCurrentFolder] = useState<'sent' | 'drafts'>('sent');
  const [page, setPage] = useState(1);
  const [totalEmails, setTotalEmails] = useState(0);

  const ITEMS_PER_PAGE = 25;

  // Fetch emails
  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;

        let result;
        if (searchQuery.trim()) {
          result = await searchSentEmails(searchQuery, ITEMS_PER_PAGE);
          setTotalEmails(result.length);
        } else {
          result = await getSentEmails(ITEMS_PER_PAGE, offset);
          setTotalEmails(result.total || 0);
        }

        // Filter by status
        let filtered = result.emails || [];
        if (filterType !== 'all') {
          filtered = filtered.filter(email => email.status === filterType);
        }

        setEmails(filtered);
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [page, searchQuery, filterType]);

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

  const totalPages = Math.ceil(totalEmails / ITEMS_PER_PAGE);

  return (
    <div className="flex h-screen bg-gray-50" style={{ backgroundColor: '#f5f5f5' }}>
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col" style={{ borderRightColor: '#d4a574' }}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200" style={{ borderBottomColor: '#d4a574' }}>
          <h2 className="text-lg font-bold" style={{ color: '#8b5e47' }}>
            📧 Email
          </h2>
        </div>

        {/* Folders */}
        <div className="flex-1 overflow-y-auto py-2">
          <nav className="space-y-1 px-2">
            {[
              { label: 'Sent', icon: '✓', value: 'sent' },
              { label: 'All', icon: '📬', value: 'all-folder' }
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
                <span className="mr-2">{folder.icon}</span>
                {folder.label}
              </button>
            ))}
          </nav>

          {/* Email Type Quick Filters */}
          <div className="px-4 py-4 border-t border-gray-200" style={{ borderTopColor: '#d4a574' }}>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Status</p>
            <div className="space-y-1">
              {[
                { label: 'All', value: 'all' },
                { label: 'Delivered', value: 'delivered' },
                { label: 'Failed', value: 'failed' },
                { label: 'Bounced', value: 'bounced' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => {
                    setFilterType(status.value);
                    setPage(1);
                  }}
                  className={`w-full text-left text-sm px-3 py-1 rounded ${
                    filterType === status.value
                      ? 'font-semibold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={
                    filterType === status.value
                      ? { backgroundColor: '#f0e5d8', color: '#8b5e47' }
                      : {}
                  }
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white">
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
            style={{ focusColor: '#8CC63F' }}
          />
        </div>

        {/* Email List or Empty State */}
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
          <div className="flex-1 flex flex-col">
            {/* Email Items */}
            <div className="flex-1 overflow-y-auto">
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
                      {format(new Date(email.created_at), 'MMM d, yyyy')}
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
        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto flex flex-col" style={{ borderLeftColor: '#d4a574' }}>
          {/* Detail Header */}
          <div className="border-b border-gray-200 p-4 sticky top-0 bg-white" style={{ borderBottomColor: '#d4a574' }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg" style={{ color: '#8b5e47' }}>
                Email Details
              </h3>
              <button
                onClick={() => setSelectedEmail(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
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
              <label className="text-xs font-semibold text-gray-600 uppercase">Status</label>
              <div className={`inline-block text-sm px-3 py-1 rounded-full text-white mt-1 font-semibold`}
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
                {format(new Date(selectedEmail.created_at), 'PPpp')}
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
                  className="mt-2 p-3 bg-gray-50 rounded-lg text-sm overflow-x-auto max-h-64"
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
