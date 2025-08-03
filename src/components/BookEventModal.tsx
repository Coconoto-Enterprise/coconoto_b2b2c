import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BookEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookEventModal({ isOpen, onClose }: BookEventModalProps) {
  type FormDataType = {
    fullName: string;
    company: string;
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
    servingStyleCustom: string;
    branding: string;
    brandingFiles: string;
    aesthetic: string;
    additionalServices: string[];
    staffCount: string;
    dietaryNeeds: string;
    wasteHandling: string[];
    wasteHandlingOther: string;
    budget: string;
    notes: string;
    contactMethod: string;
    hearAbout: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    fullName: '',
    company: '',
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
    servingStyleCustom: '',
    branding: '',
    brandingFiles: '',
    aesthetic: '',
    additionalServices: [],
    staffCount: '',
    dietaryNeeds: '',
    wasteHandling: [],
    wasteHandlingOther: '',
    budget: '',
    notes: '',
    contactMethod: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.eventDate || !formData.startTime || !formData.endTime || !formData.guests || !formData.venue) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }
    setSubmitMessage({ type: 'success', text: 'Your event request has been submitted!' });
    setFormData({
      fullName: '',
      company: '',
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
      servingStyleCustom: '',
      branding: '',
      brandingFiles: '',
      aesthetic: '',
      additionalServices: [],
      staffCount: '',
      dietaryNeeds: '',
      wasteHandling: [],
      wasteHandlingOther: '',
      budget: '',
      notes: '',
      contactMethod: '',
      hearAbout: '',
    });
    setTimeout(() => {
      onClose();
      setSubmitMessage(null);
      setIsSubmitting(false);
    }, 2000);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Company/Organization</label>
                <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Enter company/organization" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="your@email.com" />
              </div>
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
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="servingStyle" value="Custom" checked={formData.servingStyle.includes('Custom')} onChange={handleInputChange} /> Custom:
                  <input type="text" name="servingStyleCustom" value={formData.servingStyleCustom} onChange={handleInputChange} className="ml-2 px-2 py-1 border rounded" placeholder="Describe" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Would you like custom-branded serving stations?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="branding" value="Yes" checked={formData.branding === 'Yes'} onChange={handleInputChange} /> Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="branding" value="No" checked={formData.branding === 'No'} onChange={handleInputChange} /> No
                </label>
                {formData.branding === 'Yes' && (
                  <input type="text" name="brandingFiles" value={formData.brandingFiles} onChange={handleInputChange} className="ml-2 px-2 py-1 border rounded" placeholder="Provide logo/files" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Aesthetic</label>
              <div className="flex flex-wrap gap-4">
                {['Rustic/Eco-Friendly','Modern','Themed'].map(aesthetic => (
                  <label key={aesthetic} className="flex items-center gap-2">
                    <input type="radio" name="aesthetic" value={aesthetic} checked={formData.aesthetic === aesthetic} onChange={handleInputChange} /> {aesthetic}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Services Needed</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="additionalServices" value="Staff for serving" checked={formData.additionalServices.includes('Staff for serving')} onChange={handleInputChange} /> Staff for serving
                  <input type="number" name="staffCount" value={formData.staffCount} onChange={handleInputChange} className="ml-2 px-2 py-1 border rounded" placeholder="Number of attendants" />
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="additionalServices" value="Coconut-themed decor" checked={formData.additionalServices.includes('Coconut-themed decor')} onChange={handleInputChange} /> Coconut-themed decor
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="additionalServices" value="Photography/video coverage" checked={formData.additionalServices.includes('Photography/video coverage')} onChange={handleInputChange} /> Photography/video coverage
                </label>
              </div>
            </div>
          </div>
          {/* Sustainability Preferences */}
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste Handling</label>
              <div className="flex flex-wrap gap-4">
                {['Compostable serving materials','Recycling bins provided'].map(waste => (
                  <label key={waste} className="flex items-center gap-2">
                    <input type="checkbox" name="wasteHandling" value={waste} checked={formData.wasteHandling.includes(waste)} onChange={handleInputChange} /> {waste}
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="wasteHandling" value="Other" checked={formData.wasteHandling.includes('Other')} onChange={handleInputChange} /> Other:
                  <input type="text" name="wasteHandlingOther" value={formData.wasteHandlingOther} onChange={handleInputChange} className="ml-2 px-2 py-1 border rounded" placeholder="Specify" />
                </label>
              </div>
            </div>
          </div>
          {/* Budget & Special Requests */}
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range *</label>
                <select name="budget" required value={formData.budget} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                  <option value="">Select range</option>
                  <option value="$500–$1K">$500–$1K</option>
                  <option value="$1K–$3K">$1K–$3K</option>
                  <option value="$3K+">$3K+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Special Dietary Needs</label>
                <input type="text" name="dietaryNeeds" value={formData.dietaryNeeds} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="e.g., allergies" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none" placeholder="Any other requests or info..." />
            </div>
          </div>
          {/* Confirmation & Submission */}
          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" name="contactMethod" value="Email" checked={formData.contactMethod === 'Email'} onChange={handleInputChange} /> Email
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="contactMethod" value="Phone" checked={formData.contactMethod === 'Phone'} onChange={handleInputChange} /> Phone
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us?</label>
              <select name="hearAbout" value={formData.hearAbout} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                <option value="">Select</option>
                <option value="Social Media">Social Media</option>
                <option value="Referral">Referral</option>
                <option value="Web Search">Web Search</option>
                <option value="Other">Other</option>
              </select>
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
