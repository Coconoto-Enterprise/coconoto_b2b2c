import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';
import { sendWaitlistEmails } from '../utils/vercelEmailService';

interface HuskSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HuskSaleModal({ isOpen, onClose }: HuskSaleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfSacks: '1',
    customSackCount: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Validation
    if (!formData.name || !formData.email || !formData.phone) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    // If "More" is selected, validate custom count
    if (formData.numberOfSacks === 'more') {
      if (!formData.customSackCount || isNaN(Number(formData.customSackCount))) {
        setSubmitMessage({ type: 'error', text: 'Please enter a valid number of sacks.' });
        setIsSubmitting(false);
        return;
      }
      if (Number(formData.customSackCount) < 11) {
        setSubmitMessage({ type: 'error', text: 'For "More", please enter a number greater than 10.' });
        setIsSubmitting(false);
        return;
      }
    }

    const finalSackCount = formData.numberOfSacks === 'more' ? formData.customSackCount : formData.numberOfSacks;

    try {
      // Insert into Supabase
      const { error } = await supabase.from('husk_sale_requests').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        number_of_sacks: parseInt(finalSackCount),
        created_at: new Date().toISOString()
      }]);

      if (error) {
        console.error('Supabase insert error:', error);
        setSubmitMessage({ type: 'error', text: `Submission failed. ${error.message || 'Please try again.'}` });
        setIsSubmitting(false);
        return;
      }

      // Send notification email
      try {
        await sendWaitlistEmails({
          customerName: formData.name,
          customerEmail: formData.email,
          eventType: 'Coconut Husk Sale',
          message: `Phone: ${formData.phone}, Number of Sacks: ${finalSackCount}`,
          formType: 'Husk Sale Inquiry',
          formData: { ...formData, finalSackCount }
        });
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError);
      }

      setSubmitMessage({ type: 'success', text: 'Thank you! We will contact you soon about your coconut husk sale.' });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        numberOfSacks: '1',
        customSackCount: ''
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitMessage(null);
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitMessage({ type: 'error', text: 'Submission failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white bg-opacity-50 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <style>{`
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 bg-white bg-opacity-90 border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sell Your Coconut Husk</h2>
              <p className="text-gray-600 mt-1">Complete the form to get started</p>
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
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

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="+234 800 000 0000"
            />
          </div>

          {/* Number of Sacks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Sacks *
            </label>
            <select
              name="numberOfSacks"
              value={formData.numberOfSacks}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Sack' : 'Sacks'}
                </option>
              ))}
              <option value="more">More (Specify)</option>
            </select>
          </div>

          {/* Custom Sack Count - Only shown when "More" is selected */}
          {formData.numberOfSacks === 'more' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specify Number of Sacks *
              </label>
              <input
                type="number"
                name="customSackCount"
                required
                min="11"
                value={formData.customSackCount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter number (11 or more)"
              />
            </div>
          )}

          {/* Submit Message */}
          {submitMessage && (
            <div className={`p-4 rounded-lg ${submitMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
