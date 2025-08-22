import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X } from 'lucide-react';

interface BookEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookEventModal({ isOpen, onClose }: BookEventModalProps) {
  type FormDataType = {
    fullName: string;
    email: string;
    phone: string;
    eventType: string;
    eventTypeOther: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    guests: string;
    venue: string;
    venueType: string;
    servingStyle: string[];
    aesthetic: string;
    additionalServices: string[];
    staffCount: string;
    dietaryNeeds: string;
    wasteHandling: string[];
    wasteHandlingOther: string;
    budget: string;
    notes: string;
    hearAbout: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    eventTypeOther: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    guests: '',
    venue: '',
    venueType: '',
    servingStyle: [],
    aesthetic: '',
    additionalServices: [],
    staffCount: '',
    dietaryNeeds: '',
    wasteHandling: [],
    wasteHandlingOther: '',
    budget: '',
    notes: '',
    hearAbout: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => {
        if (name === 'servingStyle' || name === 'additionalServices' || name === 'wasteHandling') {
          const arr = prev[name as keyof FormDataType] as string[];
          return {
            ...prev,
            [name]: checked ? [...arr, value] : arr.filter(v => v !== value)
          };
        }
        return prev;
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.eventDate || !formData.startTime || !formData.endTime || !formData.guests || !formData.venue) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }
    // Prepare data for Supabase
    const insertData = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      event_type: formData.eventType,
      event_type_other: formData.eventTypeOther,
      event_date: formData.eventDate,
      start_time: formData.startTime,
      end_time: formData.endTime,
      guests: formData.guests ? parseInt(formData.guests) : null,
      venue: formData.venue,
      venue_type: formData.venueType,
      serving_style: formData.servingStyle,
      notes: formData.notes,
      hear_about: formData.hearAbout,
    };
    try {
      const { error } = await supabase.from('book_event_requests').insert([insertData]);
      if (error) {
        console.error('Supabase insert error:', error);
        setSubmitMessage({ type: 'error', text: `Submission failed. ${error.message || 'Please try again.'}` });
        setIsSubmitting(false);
        return;
      }
      setSubmitMessage({ type: 'success', text: 'Your event request has been submitted!' });
      // Send notification email via Netlify proxy
      fetch('/.netlify/functions/waitlist-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          type: 'Event Booking',
          details: insertData
        })
      });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        eventType: '',
        eventTypeOther: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        guests: '',
        venue: '',
        venueType: '',
        servingStyle: [],
        aesthetic: '',
        additionalServices: [],
        staffCount: '',
        dietaryNeeds: '',
        wasteHandling: [],
        wasteHandlingOther: '',
        budget: '',
        notes: '',
        hearAbout: '',
      });
      setTimeout(() => {
        onClose();
        setSubmitMessage(null);
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      setSubmitMessage({ type: 'error', text: 'Submission failed. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white bg-opacity-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <style>{`
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
        {/* Header */}
        <div className="sticky top-0 bg-white bg-opacity-90 border-b border-gray-100 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Coconut Event Experience</h2>
              <p className="text-gray-600 mt-1">Complete the form below to request your event</p>
            </div>
            <button onClick={onClose} aria-label="Close modal" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client & Event Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="your@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="+234 800 000 0000" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type *</label>
              <div className="flex flex-wrap gap-4">
                {['Corporate Event','Wedding','Private Party','Festival/Fair'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input type="radio" name="eventType" value={type} checked={formData.eventType === type} onChange={handleInputChange} /> {type}
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input type="radio" name="eventType" value="Other" checked={formData.eventType === 'Other'} onChange={handleInputChange} /> Other:
                  <input type="text" name="eventTypeOther" value={formData.eventTypeOther} onChange={handleInputChange} className="ml-2 px-2 py-1 border rounded" placeholder="Specify" />
                </label>
              </div>
            </div>
          </div>
          {/* Event Logistics */}
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Date *</label>
                <input type="date" name="eventDate" required value={formData.eventDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                  <input type="time" name="startTime" required value={formData.startTime} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                  <input type="time" name="endTime" required value={formData.endTime} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Number of Guests *</label>
                <input type="number" name="guests" min={1} required value={formData.guests} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Number of guests" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue Name/Address *</label>
                <input type="text" name="venue" required value={formData.venue} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Venue name/address" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Is the venue indoor or outdoor?</label>
              <div className="flex gap-4">
                {['Indoor','Outdoor','Both'].map(type => (
                  <label key={type} className="flex items-center gap-2">
                    <input type="radio" name="venueType" value={type} checked={formData.venueType === type} onChange={handleInputChange} /> {type}
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Coconut Experience Customization */}
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Serving Style</label>
              <div className="flex flex-wrap gap-4">
                {['Whole coconuts with straws','Pre-cut coconut chunks','Coconut water served in cups'].map(style => (
                  <label key={style} className="flex items-center gap-2">
                    <input type="checkbox" name="servingStyle" value={style} checked={formData.servingStyle.includes(style)} onChange={handleInputChange} /> {style}
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Budget & Special Requests */}

          {/* Confirmation & Submission */}
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us?</label>
              <select name="hearAbout" value={formData.hearAbout} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                <option value="">Select</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="referral">Referral</option>
                <option value="google_search">Google Search</option>
                <option value="ads">Ads</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

                    <div className="space-y-4 pt-4">
            {/* Removed Budget Range and Special Dietary Needs fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none" placeholder="Any other requests or info..." />
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
            <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
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
