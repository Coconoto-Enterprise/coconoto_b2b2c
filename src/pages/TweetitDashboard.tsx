import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Send,
  LogOut,
  X,
  Menu,
  Users,
  Megaphone,
  UserCheck,
  Paperclip,
  Check,
  Loader2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { SentEmailsList } from '../components/admin/SentEmailsList';
import EmailUsersPanel from '../components/admin/EmailUsersPanel';
import { getAllSenderConfigs, getMailUsers, EmailSenderConfig, MailUser } from '../services/emailConfigService';
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
  const [showSidebar, setShowSidebar] = useState(false);
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
  const [teamMembers, setTeamMembers] = useState<MailUser[]>([]);
  const [selectedTeamEmails, setSelectedTeamEmails] = useState<string[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  // Reply deep link: /tweetit-dashboard?compose=1&to=sender@x.com&subject=Re:...
  // opens the composer with the recipient (and optional subject) prefilled.
  useEffect(() => {
    if (!currentUser) return;
    const params = new URLSearchParams(location.search);
    if (params.get('compose') !== '1') return;

    const to = (params.get('to') || '').trim();
    const subject = (params.get('subject') || '').trim();
    setComposer((prev) => ({
      ...prev,
      templateType: 'customer',
      to: to || prev.to,
      subject: subject || prev.subject,
    }));
    setShowComposer(true);
    // Strip the params so refresh/back doesn't reopen the composer
    navigate('/tweetit-dashboard', { replace: true });
  }, [currentUser, location.search, navigate]);

  const toggleTeamEmail = (email: string) => {
    setSelectedTeamEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const setTemplateType = (templateType: string) => {
    setComposer((prev) => ({ ...prev, templateType, to: '' }));
    setSelectedTeamEmails([]);
  };

  useEffect(() => {
    const stored = localStorage.getItem('tweetitUser');
    if (!stored) {
      navigate(`/tweetit${window.location.search || ''}`);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as TweetitUser;
      if (!parsed?.email) {
        navigate(`/tweetit${window.location.search || ''}`);
        return;
      }
      setCurrentUser(parsed);
    } catch {
      navigate(`/tweetit${window.location.search || ''}`);
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
      const selfSender: EmailSenderConfig = {
        id: `self-${currentUser.email}`,
        email_type: 'admin-self',
        sender_email: currentUser.email,
        sender_name: currentUser.email,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const specialSenders =
        currentUser.email === 'info@coconoto.africa'
          ? [
              { id: 'login-info', email_type: 'admin-login', sender_email: 'info@coconoto.africa', sender_name: 'Info Admin', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'login-jacob', email_type: 'admin-login', sender_email: 'jacob.abiodun@coconoto.africa', sender_name: 'Jacob Abiodun', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'login-support', email_type: 'admin-login', sender_email: 'support@coconoto.africa', sender_name: 'Support Team', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
              { id: 'login-team', email_type: 'admin-login', sender_email: 'team@coconoto.africa', sender_name: 'Team Sender', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            ]
          : [];

      const mergedSenders = [selfSender, ...specialSenders, ...activeSenders].reduce<EmailSenderConfig[]>((acc, sender) => {
        if (!acc.some((item) => item.sender_email === sender.sender_email)) {
          acc.push(sender);
        }
        return acc;
      }, []);

      setSenderOptions(mergedSenders);
      setSelectedSender(currentUser.email);
    };

    loadSenderConfigs();
  }, [currentUser]);

  // Registered mail users double as the team directory for team emails
  useEffect(() => {
    if (!currentUser) return;
    const loadTeam = async () => {
      const users = await getMailUsers();
      setTeamMembers((users || []).filter((u) => u.is_active));
    };
    loadTeam();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('tweetitUser');
    localStorage.removeItem('tweetitEmailRemember');
    navigate('/tweetit');
  };

  const handleSendEmail = async () => {
    const recipients = composer.templateType === 'team'
      ? selectedTeamEmails.join(', ')
      : composer.to;

    if (!recipients || !composer.subject || !composer.message) {
      showToast(
        'error',
        composer.templateType === 'team'
          ? 'Please select at least one team member and fill in Subject and Message.'
          : 'Please fill in Recipients, Subject, and Message.'
      );
      return;
    }

    if (!currentUser) {
      showToast('error', 'Your session has expired. Please login again.');
      navigate('/tweetit');
      return;
    }

    try {
      setSending(true);
      const formData = new FormData();
      formData.append('to', recipients);
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
        showToast('success', 'Email sent successfully!');
        setComposer({ to: '', subject: '', message: '', heading: '', templateType: 'customer', attachments: [] });
        setSelectedTeamEmails([]);
        setShowComposer(false);
        setRefreshKey((k) => k + 1);
      } else {
        showToast('error', `Failed to send email: ${data.error}`);
      }
    } catch (err) {
      showToast('error', 'Network error while sending email.');
    } finally {
      setSending(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 flex flex-col">
      {/* Modern header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/80 flex-shrink-0 shadow-sm sticky top-0 z-30">
        <div className="px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-3">
            <div className="flex items-center min-w-0 gap-2 sm:gap-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
              <img
                src={Logo}
                alt="Coconoto"
                className="hidden md:block h-12 w-12 lg:h-14 lg:w-14 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                  <Sparkles className="h-3 w-3" />
                  Tweetit
                </div>
                <h2 className="font-bold text-base sm:text-lg text-gray-900 leading-tight tracking-tight truncate">
                  Email Center
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setShowUserManager(true)}
                  className="hidden sm:inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition shadow-sm hover:shadow-md"
                >
                  <Users className="h-4 w-4" />
                  Manage Users
                </button>
              )}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setShowUserManager(true)}
                  className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white shadow-sm"
                  title="Manage Users"
                >
                  <Users className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setShowComposer(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Compose</span>
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200/70 px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 px-0 overflow-x-hidden overflow-y-hidden min-h-0 min-w-0 w-full max-w-full">
        <SentEmailsList
          refreshKey={refreshKey}
          viewerEmail={currentUser.role === 'staff' ? currentUser.email : undefined}
          mobileSidebarOpen={showSidebar}
          onToggleMobileSidebar={() => setShowSidebar(!showSidebar)}
          onOpenUserManager={() => setShowUserManager(true)}
        />
      </div>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[120] flex items-center gap-2 rounded-2xl px-5 py-3 shadow-xl text-white font-medium ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          <span className="text-sm">{toast.text}</span>
        </div>
      )}

      {showComposer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl sm:max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Compose Email</h3>
                <p className="text-xs sm:text-sm text-emerald-50/90 mt-0.5">
                  Sending as {currentUser.role === 'admin' ? selectedSender : currentUser.email}
                </p>
              </div>
              <button
                onClick={() => setShowComposer(false)}
                title="Close composer"
                className="text-white/80 hover:text-white rounded-full p-1.5 hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="p-5 sm:p-7 space-y-5 flex-1 overflow-y-auto">
              {currentUser.role === 'admin' && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Send From</label>
                  <div className="relative">
                    <select
                      aria-label="Select sender email"
                      value={selectedSender}
                      onChange={(e) => setSelectedSender(e.target.value)}
                      className="w-full appearance-none pl-3 pr-10 py-2.5 text-sm border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
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
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email Template</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTemplateType('customer')}
                    className={`relative flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-all ${
                      composer.templateType === 'customer'
                        ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {composer.templateType === 'customer' && (
                      <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <Megaphone className={`h-5 w-5 ${composer.templateType === 'customer' ? 'text-emerald-700' : 'text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${composer.templateType === 'customer' ? 'text-emerald-900' : 'text-gray-800'}`}>Customer</span>
                    <span className="text-xs text-gray-500">Marketing email to any address</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTemplateType('team')}
                    className={`relative flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-all ${
                      composer.templateType === 'team'
                        ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {composer.templateType === 'team' && (
                      <span className="absolute top-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <UserCheck className={`h-5 w-5 ${composer.templateType === 'team' ? 'text-emerald-700' : 'text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${composer.templateType === 'team' ? 'text-emerald-900' : 'text-gray-800'}`}>Team</span>
                    <span className="text-xs text-gray-500">Internal note to registered members</span>
                  </button>
                </div>
              </div>

              {composer.templateType === 'team' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Team Recipients
                      {selectedTeamEmails.length > 0 && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                          {selectedTeamEmails.length} selected
                        </span>
                      )}
                    </label>
                    {teamMembers.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedTeamEmails(
                            selectedTeamEmails.length === teamMembers.length
                              ? []
                              : teamMembers.map((m) => m.sender_email)
                          )
                        }
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        {selectedTeamEmails.length === teamMembers.length ? 'Clear all' : 'Select all'}
                      </button>
                    )}
                  </div>

                  {teamMembers.length === 0 ? (
                    <p className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-2xl p-4 text-center">
                      No registered team members found.
                    </p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto rounded-2xl border border-gray-200 divide-y divide-gray-100">
                      {teamMembers.map((member) => {
                        const isSelected = selectedTeamEmails.includes(member.sender_email);
                        return (
                          <button
                            key={member.id}
                            type="button"
                            onClick={() => toggleTeamEmail(member.sender_email)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition ${
                              isSelected ? 'bg-emerald-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span
                              className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition ${
                                isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3" />}
                            </span>
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white uppercase">
                              {(member.sender_email || '?').charAt(0)}
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-medium text-gray-900">{member.sender_email}</span>
                              <span className="block truncate text-xs text-gray-500 capitalize">{member.role}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label htmlFor="tweetit-recipients" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Recipients
                  </label>
                  <input
                    id="tweetit-recipients"
                    type="email"
                    value={composer.to}
                    onChange={(e) => setComposer({ ...composer, to: e.target.value })}
                    placeholder="user@example.com, user2@example.com"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label htmlFor="tweetit-subject" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  id="tweetit-subject"
                  type="text"
                  value={composer.subject}
                  onChange={(e) => setComposer({ ...composer, subject: e.target.value })}
                  placeholder="Email subject"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="tweetit-heading" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                  Heading <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                </label>
                <input
                  id="tweetit-heading"
                  type="text"
                  value={composer.heading}
                  onChange={(e) => setComposer({ ...composer, heading: e.target.value })}
                  placeholder="e.g., ORDER CONFIRMATION"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="tweetit-message" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="tweetit-message"
                  value={composer.message}
                  onChange={(e) => setComposer({ ...composer, message: e.target.value })}
                  placeholder="Enter your message..."
                  rows={6}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                  Attachments <span className="text-gray-500 text-xs font-normal">(Max 10MB per file)</span>
                </label>
                <label
                  htmlFor="tweetit-attachments"
                  className="flex items-center justify-center gap-2 w-full px-3 py-3.5 text-sm border-2 border-dashed border-gray-300 rounded-xl cursor-pointer text-gray-600 hover:border-emerald-400 hover:bg-emerald-50/50 transition"
                >
                  <Paperclip className="h-4 w-4" />
                  Click to attach files
                </label>
                <input
                  id="tweetit-attachments"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setComposer({ ...composer, attachments: [...composer.attachments, ...files] });
                    e.target.value = '';
                  }}
                  className="hidden"
                />
                {composer.attachments.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {composer.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl text-xs sm:text-sm">
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

            <div className="px-5 sm:px-7 py-4 sm:py-5 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 bg-gray-50">
              <button
                onClick={() => setShowComposer(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-full disabled:opacity-60 transition shadow-sm hover:shadow-md"
              >
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {composer.templateType === 'team' && selectedTeamEmails.length > 0
                      ? `Send to ${selectedTeamEmails.length} member${selectedTeamEmails.length > 1 ? 's' : ''}`
                      : 'Send'}
                  </>
                )}
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
