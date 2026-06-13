import React, { useEffect, useState } from 'react';
import { EmailUser, createEmailUser, getEmailUsers, updateEmailUserPassword } from '../../services/emailConfigService';

interface EmailUsersPanelProps {
  currentUser: {
    id: string;
    email: string;
    role: 'admin' | 'staff';
  };
  onClose: () => void;
}

const EmailUsersPanel: React.FC<EmailUsersPanelProps> = ({ currentUser, onClose }) => {
  const [users, setUsers] = useState<EmailUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'staff' as 'admin' | 'staff' });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState<Record<string, string>>({});

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await getEmailUsers(currentUser.id, currentUser.email);
      setUsers(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      setStatusMessage('Email and password are required for a new user.');
      return;
    }

    setLoading(true);
    const created = await createEmailUser(
      currentUser.id,
      currentUser.email,
      newUser.email,
      newUser.password,
      newUser.role
    );
    setLoading(false);

    if (created) {
      setStatusMessage(`Created ${created.role} account for ${created.email}`);
      setNewUser({ email: '', password: '', role: 'staff' });
      loadUsers();
    } else {
      setStatusMessage('Failed to create new email user.');
    }
  };

  const handlePasswordSave = async (userId: string) => {
    const password = editingPassword[userId]?.trim();
    if (!password) {
      setStatusMessage('Password cannot be empty.');
      return;
    }

    setLoading(true);
    const updated = await updateEmailUserPassword(currentUser.id, currentUser.email, userId, password);
    setLoading(false);

    if (updated) {
      setStatusMessage(`Updated password for ${updated.email}`);
      setEditingPassword({ ...editingPassword, [userId]: '' });
      loadUsers();
    } else {
      setStatusMessage('Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-green-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mail Users</h2>
            <p className="text-sm text-gray-600">Add staff and admin email users, then allow them to log in and send mail.</p>
          </div>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900 font-semibold">Close</button>
        </div>

        <div className="p-5 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="user@coconoto.africa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                placeholder="Choose a strong password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                aria-label="Select user role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'staff' })}
                className="mt-2 block w-full rounded-lg border-gray-300 bg-white shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={handleCreateUser}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              Add new user
            </button>
            {statusMessage && <p className="text-sm text-gray-700">{statusMessage}</p>}
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Reset Password</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">No mail users created yet.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 text-sm text-gray-800">{user.email}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">{user.role}</td>
                      <td className="px-4 py-4 text-sm text-gray-800">{user.is_active ? 'Active' : 'Inactive'}</td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={editingPassword[user.id] || ''}
                            onChange={(e) => setEditingPassword({ ...editingPassword, [user.id]: e.target.value })}
                            className="w-full rounded-lg border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500"
                            placeholder="New password"
                          />
                          <button
                            type="button"
                            onClick={() => handlePasswordSave(user.id)}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-500">{new Date(user.updated_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailUsersPanel;
