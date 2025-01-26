import React, { useState } from 'react';
import { User, Bell, Lock, Globe, CreditCard } from 'lucide-react';
import { PaymentMethodModal } from './PaymentMethodModal';
import { SecurityModal } from './SecurityModal';

export function Settings() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [securityModalType, setSecurityModalType] = useState<'password' | '2fa'>('password');

  const openSecurityModal = (type: 'password' | '2fa') => {
    setSecurityModalType(type);
    setIsSecurityModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Account Settings</h2>

      <div className="bg-white rounded-lg shadow divide-y">
        {/* Profile Settings */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <User className="h-6 w-6 text-gray-400" />
            <h3 className="text-lg font-medium">Profile Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                defaultValue="John Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                defaultValue="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                defaultValue="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                defaultValue="Global Foods Inc."
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <CreditCard className="h-6 w-6 text-gray-400" />
            <h3 className="text-lg font-medium">Payment Methods</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/24</p>
                </div>
              </div>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                Remove
              </button>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Lock className="h-6 w-6 text-gray-400" />
            <h3 className="text-lg font-medium">Security</h3>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => openSecurityModal('password')}
              className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <h4 className="font-medium">Change Password</h4>
              <p className="text-sm text-gray-500">Update your password for better security</p>
            </button>
            <button
              onClick={() => openSecurityModal('2fa')}
              className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
          Cancel
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Save Changes
        </button>
      </div>

      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        type={securityModalType}
      />
    </div>
  );
}