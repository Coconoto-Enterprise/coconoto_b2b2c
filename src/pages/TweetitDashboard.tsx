import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, LogOut, X } from 'lucide-react';
import { SentEmailsList } from '../components/admin/SentEmailsList';
import EmailUsersPanel from '../components/admin/EmailUsersPanel';
import { getAllSenderConfigs, EmailSenderConfig } from '../services/emailConfigService';
import Logo from '../assets/Logo_1.png';

interface TweetitUser {
  id: string;
  email: string;
  role: 'admin' | 'staff';
  is_active?: boolean;
}

const TweetitDashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showComposer, setShowComposer] = useState(false);
  const [sending, setSending] = useState(false);
  const [composer, setComposer] = useState({
    to: '',
    subject: '',
    message: '',
    heading: '',
    templateType: 'customer',
    attachments: [] as File[],
  });
  const [currentUser, setCurrentUser] = useState<TweetitUser | null>(null);
  const [senderOptions, setSenderOptions] = useState<EmailSenderConfig[]>([]);
  const [selectedSender, setSelectedSender] = useState('team@coconoto.africa');
  const [showUserManager, setShowUserManager] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('tweetitUser');
    if (!stored) {
      navigate('/tweetit');
      return;
    }

    try {
      const parsed = JSON.parse(stored) as TweetitUser;
      if (!parsed?.email) {
        navigate('/tweetit');
        return;
      }
      setCurrentUser(parsed);
    } catch {
      navigate('/tweetit');
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'staff') {
      setSelectedSender(currentUser.email);
      return;
    }

    const loadSenderConfigs = async () => {
      const configs = await getAllSenderConfigs();
      const activeSenders = configs.filter((config) => config.is_active);
      const specialSenders =
        currentUser.email === 'info@coconoto.africa'
          ? [
              { id: 'login-info', email_type: 'admin-login', sender_email: 'info@coconoto.africa', sender_name: 'Info Admin', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'login-jacob', email_type: 'admin-login', sender_email: 'jacob.abiodun@coconoto.africa', sender_name: 'Jacob Abiodun', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'login-support', email_type: 'admin-login', sender_email: 'support@coconoto.africa', sender_name: 'Support Team', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'login-team', email_type: 'admin-login', sender_email: 'team@coconoto.africa', sender_name: 'Team Sender', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            ]
          : [];

      const mergedSenders = [...specialSenders, ...activeSenders].reduce<EmailSenderConfig[]>((acc, sender) => {
        if (!acc.some((item) => item.sender_email === sender.sender_email)) {
          acc.push(sender);
        }
        return acc;
      }, []);

      setSenderOptions(mergedSenders);
      setSelectedSender(currentUser.email === 'info@coconoto.africa' ? 'info@coconoto.africa' : mergedSenders[0]?.sender_email || 'team@coconoto.africa');
    };

    loadSenderConfigs();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('tweetitUser');
    navigate('/tweetit');
  };

  const handleSendEmail = async () => {
    if (!composer.to || !composer.subject || !composer.message) {
      alert('Please fill in all required fields (Recipients, Subject, and Message)');
      return;
    }

    if (!currentUser) {
      alert('Your session has expired. Please login again.');
      navigate('/tweetit');
      return;
    }

    try {
      setSending(true);
      const formData = new FormData();
      formData.append('to', composer.to);
      formData.append('subject', composer.subject);
      formData.append('message', composer.message);
      formData.append('heading', composer.heading);
      formData.append('templateType', composer.templateType);
      const senderToUse = currentUser.role === 'staff'
        ? currentUser.email
        : selectedSender || currentUser.email;
      formData.append('senderEmail', senderToUse);
      formData.append('senderId', currentUser.id);
      composer.attachments.forEach((file) => formData.append('attachments', file));

      const response = await fetch('/api/send-custom-email', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        alert('Email sent successfully!');
        setComposer({ to: '', subject: '', message: '', heading: '', templateType: 'customer', attachments: [] });
        setShowComposer(false);
        setRefreshKey((k) => k + 1);
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (err) {
      alert('Network error occurred while sending email');
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center min-w-0 gap-2 sm:gap-3">
              <img src={Logo} alt="Coconoto" className="self-end mb-1 h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 object-contain flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-lg">Email Center</h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-shrink-0">
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setShowUserManager(true)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md inline-flex items-center gap-2"
                >
                  Manage Users
                </button>
              )}
              <button
                onClick={() => setShowComposer(true)}
                className="bg-green-600 text-white px-3 py-1 rounded-md inline-flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Compose Email
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md inline-flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-0 overflow-hidden min-h-0">
        <SentEmailsList refreshKey={refreshKey} viewerEmail={currentUser.role === 'staff' ? currentUser.email : undefined} />
      </div>

      {showComposer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Compose Email</h3>
                <p className="text-sm text-gray-600">Sending as {currentUser.role === 'admin' ? selectedSender : currentUser.email}</p>
              </div>
              <button
                onClick={() => setShowComposer(false)}
                title="Close composer"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
              {currentUser.role === 'admin' && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Send From</label>
                  <select
                    aria-label="Select sender email"
                    value={selectedSender}
                    onChange={(e) => setSelectedSender(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {senderOptions.length > 0 ? (
                      senderOptions.map((option) => (
                        <option key={option.id} value={option.sender_email}>
                          {option.sender_name} ({option.sender_email})
                        </option>
                      ))
                    ) : (
                      <option value="team@coconoto.africa">team@coconoto.africa</option>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Template</label>
                <div className="flex gap-3 sm:gap-4 flex-wrap">
                  <label className="flex items-center cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="templateType"
                      value="customer"
                      checked={composer.templateType === 'customer'}
                      onChange={(e) => setComposer({ ...composer, templateType: e.target.value })}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Customer</span>
                  </label>
                  <label className="flex items-center cursor-pointer gap-2">
                    <input
                      type="radio"
                      name="templateType"
                      value="team"
                      checked={composer.templateType === 'team'}
                      onChange={(e) => setComposer({ ...composer, templateType: e.target.value })}
                      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">Team</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {composer.templateType === 'customer' ? 'Marketing email' : 'Internal notification'}
                </p>
              </div>
              <div>
                <label htmlFor="tweetit-recipients" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Recipients</label>
                <input
                  id="tweetit-recipients"
                  type="email"
                  value={composer.to}
                  onChange={(e) => setComposer({ ...composer, to: e.target.value })}
                  placeholder="user@example.com, user2@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="tweetit-subject" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  id="tweetit-subject"
                  type="text"
                  value={composer.subject}
                  onChange={(e) => setComposer({ ...composer, subject: e.target.value })}
                  placeholder="Email subject"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="tweetit-heading" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Heading <span className="text-gray-500 text-xs">(Optional)</span></label>
                <input
                  id="tweetit-heading"
                  type="text"
                  value={composer.heading}
                  onChange={(e) => setComposer({ ...composer, heading: e.target.value })}
                  placeholder="e.g., ORDER CONFIRMATION"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="tweetit-message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="tweetit-message"
                  value={composer.message}
                  onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                  placeholder="Enter your message..."
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label htmlFor="tweetit-attachments" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Attachments <span className="text-gray-500 text-xs">(Max 10MB per file)</span></label>
                <input
                  id="tweetit-attachments"
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
                        <span className="text-gray-700 truncate">📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
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
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowComposer(false)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-1 sm:gap-2"
              >
                <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>{sending ? 'Sending...' : 'Send'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserManager && currentUser?.role === 'admin' && (
        <EmailUsersPanel currentUser={currentUser} onClose={() => setShowUserManager(false)} />
      )}
    </div>
  );
};

export default TweetitDashboard;
