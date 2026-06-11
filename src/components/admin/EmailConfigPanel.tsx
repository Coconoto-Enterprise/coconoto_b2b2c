import React, { useState, useEffect } from 'react';
import { getAllSenderConfigs, updateSenderConfig, EmailSenderConfig } from '../services/emailConfigService';

interface EmailConfigPanelProps {
  isLoading?: boolean;
}

export const EmailConfigPanel: React.FC<EmailConfigPanelProps> = ({ isLoading: initialLoading = false }) => {
  const [configs, setConfigs] = useState<EmailSenderConfig[]>([]);
  const [loading, setLoading] = useState(initialLoading);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<EmailSenderConfig>>({});
  const [saveStatus, setSaveStatus] = useState<{ id: string; status: 'saving' | 'success' | 'error' } | null>(null);

  // Fetch configs on mount
  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const result = await getAllSenderConfigs();
      setConfigs(result);
    } catch (error) {
      console.error('Error fetching configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (config: EmailSenderConfig) => {
    setEditingId(config.id);
    setEditValues({
      sender_email: config.sender_email,
      sender_name: config.sender_name,
      is_active: config.is_active
    });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleEditSave = async (emailType: string) => {
    setSaveStatus({ id: emailType, status: 'saving' });
    try {
      await updateSenderConfig(emailType, editValues);
      
      // Update local state
      setConfigs(configs.map(c => 
        c.email_type === emailType 
          ? { ...c, ...editValues }
          : c
      ));
      
      setSaveStatus({ id: emailType, status: 'success' });
      setEditingId(null);
      
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveStatus({ id: emailType, status: 'error' });
    }
  };

  const formatEmailType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" style={{ borderTop: '4px solid #8CC63F' }}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#8b5e47' }}>
          📨 Email Sender Configuration
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Configure which @coconoto.africa address sends each type of email
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-3" style={{ color: '#8CC63F' }}>⟳</div>
            <p className="text-gray-500">Loading configuration...</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderBottomColor: '#d4a574' }}>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: '#8b5e47' }}>Email Type</th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: '#8b5e47' }}>Sender Email</th>
                <th className="text-left py-3 px-4 font-semibold" style={{ color: '#8b5e47' }}>Display Name</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#8b5e47' }}>Active</th>
                <th className="text-center py-3 px-4 font-semibold" style={{ color: '#8b5e47' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {configs.map(config => (
                <tr
                  key={config.id}
                  className="border-b hover:bg-gray-50 transition"
                  style={{ borderBottomColor: '#e0d5c7' }}
                >
                  {/* Email Type */}
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ backgroundColor: '#618A42' }}>
                      {formatEmailType(config.email_type)}
                    </span>
                  </td>

                  {/* Sender Email */}
                  <td className="py-4 px-4">
                    {editingId === config.id ? (
                      <input
                        type="email"
                        value={editValues.sender_email || ''}
                        onChange={e => setEditValues({ ...editValues, sender_email: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                        style={{ focusRing: '#8CC63F' }}
                      />
                    ) : (
                      <code className="text-sm font-mono" style={{ color: '#8b5e47' }}>{config.sender_email}</code>
                    )}
                  </td>

                  {/* Display Name */}
                  <td className="py-4 px-4">
                    {editingId === config.id ? (
                      <input
                        type="text"
                        value={editValues.sender_name || ''}
                        onChange={e => setEditValues({ ...editValues, sender_name: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2"
                        style={{ focusRing: '#8CC63F' }}
                      />
                    ) : (
                      <span className="text-gray-700">{config.sender_name}</span>
                    )}
                  </td>

                  {/* Active Toggle */}
                  <td className="py-4 px-4 text-center">
                    {editingId === config.id ? (
                      <input
                        type="checkbox"
                        checked={editValues.is_active !== false}
                        onChange={e => setEditValues({ ...editValues, is_active: e.target.checked })}
                        className="w-4 h-4 cursor-pointer"
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={config.is_active}
                        readOnly
                        className="w-4 h-4 cursor-not-allowed"
                        style={{ accentColor: '#8CC63F' }}
                      />
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-center space-x-2">
                    {editingId === config.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(config.email_type)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm font-semibold hover:bg-green-600 transition"
                        >
                          {saveStatus?.status === 'saving' ? '⟳' : '✓ Save'}
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm font-semibold hover:bg-gray-400 transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditStart(config)}
                        className="px-3 py-1 rounded text-sm font-semibold transition"
                        style={{ backgroundColor: '#d4a574', color: 'white' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#c49564')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#d4a574')}
                      >
                        Edit
                      </button>
                    )}
                  </td>

                  {/* Status Indicator */}
                  {saveStatus?.id === config.email_type && (
                    <td className="py-4 px-4">
                      <span className={`text-sm font-semibold ${
                        saveStatus.status === 'success' ? 'text-green-600' : 
                        saveStatus.status === 'error' ? 'text-red-600' : 
                        'text-blue-600'
                      }`}>
                        {saveStatus.status === 'success' ? '✓ Saved' : 
                         saveStatus.status === 'error' ? '✗ Error' : 
                         'Saving...'}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#f0e5d8' }}>
        <p className="text-sm" style={{ color: '#8b5e47' }}>
          💡 <strong>Tip:</strong> All sender emails must be verified in your Resend account and have @coconoto.africa domain.
          Disable an email type to prevent those emails from being sent.
        </p>
      </div>
    </div>
  );
};

export default EmailConfigPanel;
