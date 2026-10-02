import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { sendMachineOrderEmails } from '../../../utils/vercelEmailService';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Unit price in naira, and the price this form shows the buyer.
 *
 * Commit fbfc3fa (2026-03-18) replaced `1000000` with `0` and a "quote-based"
 * comment, so the form stopped carrying a price and `total_price` was written to
 * the database as 0. The form is reachable again from `/services`, and the
 * buyer should see what the machine costs, so the price is restored here.
 */
const UNIT_PRICE = 1000000;

const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

export function OrderDeshellerModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: '',
    installationAddress: '',
    additionalRequirements: ''
  });
  const [quantityError, setQuantityError] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Live order total — shown to the buyer, and the same figure written to the
  // database as `total_price`.
  const orderQuantity = Math.max(1, parseInt(formData.quantity, 10) || 1);
  const orderTotal = UNIT_PRICE * orderQuantity;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'quantity') {
      if (!value || isNaN(Number(value)) || Number(value) < 1) {
        setQuantityError('Please enter a valid quantity');
      } else {
        setQuantityError('');
      }
    }
  };

  // Removed: handleProductChange and products_interested logic (no longer needed)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.installationAddress) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }
    if (!formData.quantity || isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1) {
      setQuantityError('Please enter a valid quantity');
      setIsSubmitting(false);
      return;
    }
    setQuantityError('');

    // 1. Try to store in Supabase with retry logic
    let supabaseSuccess = false;
    try {
      // Calculate total price for Desheller
      const quantity = parseInt(formData.quantity) || 1;
      const unitPrice = UNIT_PRICE;
      const calculatedTotal = unitPrice * quantity;

      const { error } = await supabase.from('machine_orders').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          quantity: formData.quantity,
          installation_address: formData.installationAddress,
          additional_requirements: formData.additionalRequirements,
          type: 'Desheller Machine Order',
          total_price: calculatedTotal, // Save calculated total to database
          submitted_at: new Date().toISOString()
        }
      ]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      supabaseSuccess = true;
    } catch (supabaseError) {
      console.error('Failed to save to Supabase:', supabaseError);
      // Continue with email notification even if Supabase fails
      supabaseSuccess = false;
    }

    // 2. Send notification email
    try {
      await sendMachineOrderEmails({
        ...formData,
        machineType: 'Desheller',
        orderType: 'Desheller Machine Order',
        submittedAt: new Date().toLocaleString()
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the entire process if email fails
    }

    setSubmitMessage({ type: 'success', text: 'Your machine order has been submitted!' });
    setFormData({
      name: '',
      email: '',
      phone: '',
      quantity: '',
      installationAddress: '',
      additionalRequirements: ''
    });
    setTimeout(() => {
      onClose();
      setSubmitMessage(null);
      setIsSubmitting(false);
    }, 2000);
  };

  const products = [
    'Fresh Coconuts',
    'Coconut Water',
    'Coconut Oil',
    'Coconut Fiber/Coir',
    'Cocopeat',
    'Coconut Shell Products'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white bg-opacity-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <style>
          {`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {/* Header */}
        <div className="sticky top-0 bg-white bg-opacity-90 border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Request a Quote for Desheller Machine</h2>
              <p className="text-gray-600 mt-1">Complete the form below to place your order</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  min={1}
                  required
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter quantity"
                />
                {quantityError && (
                  <p className="text-red-600 text-xs mt-1">{quantityError}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Installation Address *</label>
              <textarea
                name="installationAddress"
                required
                value={formData.installationAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter installation address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Requirements</label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Any specific requirements or customizations..."
              />
            </div>
          </div>

          {/* Price — the buyer should see what they are ordering before they submit. */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>Desheller Machine — unit price</span>
              <span className="font-semibold text-gray-900">{formatNaira(UNIT_PRICE)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-green-200 pt-3">
              <span className="font-semibold text-gray-900">
                Total
                {orderQuantity > 1 && (
                  <span className="ml-1 font-normal text-gray-600">
                    ({orderQuantity} × {formatNaira(UNIT_PRICE)})
                  </span>
                )}
              </span>
              <span className="text-lg font-bold text-green-700">{formatNaira(orderTotal)}</span>
            </div>
          </div>

          {/* Message Display */}
          {submitMessage && (
            <div className={`p-4 rounded-lg ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {submitMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Order'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              We'll never share your information and you can unsubscribe at any time.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
