import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WaitlistService } from '../services/waitlist';
import { sendWaitlistEmails } from '../utils/apiEmailService';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    account_type: '', // buyer, seller, both
    country: '',
    state: '',
    city: '',
    business_type: '',
    products_interested: [] as string[],
    products_other: '',
    monthly_volume: '',
    years_experience: '',
    primary_use_case: '',
    hear_about_us: '',
    additional_info: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (product: string) => {
    setFormData(prev => ({
      ...prev,
      products_interested: prev.products_interested.includes(product)
        ? prev.products_interested.filter(p => p !== product)
        : [...prev.products_interested, product]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.account_type) {
      setSubmitMessage({ type: 'error', text: 'Please fill in all required fields.' });
      setIsSubmitting(false);
      return;
    }

    // Only require products_interested for buyers (or both)
    if ((formData.account_type === 'buyer' || formData.account_type === 'both') && formData.products_interested.length === 0) {
      setSubmitMessage({ type: 'error', text: 'Please select at least one product.' });
      setIsSubmitting(false);
      return;
    }

    // Validate business type compatibility with account type
    if (formData.business_type) {
      const sellerBusinessTypes = ['coconut_farm', 'processing_company', 'wholesaler', 'retailer', 'individual_farmer'];
      const buyerBusinessTypes = ['food_beverage', 'cosmetics', 'agriculture', 'manufacturing', 'retail_buyer', 'individual_consumer'];
      
      if (formData.account_type === 'buyer' && sellerBusinessTypes.includes(formData.business_type)) {
        setSubmitMessage({ type: 'error', text: 'Selected business type is for sellers only. Please choose a buyer business type or change your account type to seller/both.' });
        setIsSubmitting(false);
        return;
      }
      
      if (formData.account_type === 'seller' && buyerBusinessTypes.includes(formData.business_type)) {
        setSubmitMessage({ type: 'error', text: 'Selected business type is for buyers only. Please choose a seller business type or change your account type to buyer/both.' });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Check if email already exists
      const emailExists = await WaitlistService.checkEmailExists(formData.email);
      if (emailExists) {
        setSubmitMessage({ type: 'error', text: 'This email is already on our waitlist.' });
        setIsSubmitting(false);
        return;
      }

      // Submit to Supabase
      const result = await WaitlistService.addToWaitlist({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        account_type: formData.account_type as 'seller' | 'buyer' | 'both',
        country: formData.country,
        state: formData.state,
        city: formData.city,
        business_type: formData.business_type,
        business_category: formData.business_type,
        products: formData.products_interested,
        products_other: formData.products_other,
        monthly_volume: formData.monthly_volume,
        years_experience: formData.years_experience,
        primary_use_case: formData.primary_use_case,
        hear_about_us: formData.hear_about_us,
        additional_info: formData.additional_info
      });

      if (result.success) {
        // Send notification via Resend API
        try {
          await sendWaitlistEmails({
            customerName: formData.name,
            customerEmail: formData.email,
            eventType: 'Waitlist Registration',
            message: `Phone: ${formData.phone}, Company: ${formData.company}`,
            formType: 'Waitlist Signup',
            formData: formData
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
        }

        setSubmitMessage({ type: 'success', text: 'Thank you for joining our waitlist! We\'ll be in touch soon.' });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          account_type: '',
          country: '',
          state: '',
          city: '',
          business_type: '',
          products_interested: [],
          products_other: '',
          monthly_volume: '',
          years_experience: '',
          primary_use_case: '',
          hear_about_us: '',
          additional_info: ''
        });
        setTimeout(() => {
          onClose();
          setSubmitMessage(null);
        }, 2000);
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit. Please try again.' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    }
    
    setIsSubmitting(false);
  };

  const products = [
    'Fresh Coconuts',
    'Coconut Water',
    'Coconut Oil',
    'Coconut Fiber/Coir',
    'Cocopeat',
    'Coconut Shell Products',
    'Briquette charcoal',
    'Biochar',
    'Cocopot coconut husk'
  ];

  // Business type options by account type
  const sellerBusinessTypes = [
    { value: 'coconut_farm', label: 'Coconut Farm/Plantation' },
    { value: 'processing_company', label: 'Coconut Processing Company' },
    { value: 'wholesaler', label: 'Wholesaler/Distributor' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'individual_farmer', label: 'Individual Farmer' }
  ];
  const buyerBusinessTypes = [
    { value: 'food_beverage', label: 'Food & Beverage Company' },
    { value: 'cosmetics', label: 'Cosmetics/Beauty Brand' },
    { value: 'agriculture', label: 'Agriculture/Gardening Business' },
    { value: 'manufacturing', label: 'Manufacturing Company' },
    { value: 'retail_buyer', label: 'Retailer' },
    { value: 'individual_consumer', label: 'Individual Consumer' }
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
              <h2 className="text-2xl font-bold text-gray-900">Join Our Waitlist</h2>
              <p className="text-gray-600 mt-1">Be first to access our coconut marketplace</p>
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
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your company name (optional)"
                />
              </div>
            </div>
          </div>

          {/* Account Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Type</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a: *
              </label>
              <select
                name="account_type"
                required
                value={formData.account_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Select your role</option>
                <option value="seller">Seller</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your country"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Enter your state/province"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your city (optional but helpful for logistics)"
              />
            </div>
          </div>

          {/* Business Specific Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
            {/* Seller: Business Type only */}
            {formData.account_type === 'seller' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Select business type</option>
                  {sellerBusinessTypes.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Buyer: Primary Use Case only */}
            {formData.account_type === 'buyer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Use Case
                </label>
                <select
                  name="primary_use_case"
                  value={formData.primary_use_case}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Select primary use case</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="resale">Resale</option>
                  <option value="personal_use">Personal use</option>
                  <option value="export">Export</option>
                  <option value="processing">Processing</option>
                  <option value="research">Research & Development</option>
                </select>
              </div>
            )}
            {/* Both: Show both fields */}
            {formData.account_type === 'both' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    name="business_type"
                    value={formData.business_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select business type</option>
                    {sellerBusinessTypes.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Use Case
                  </label>
                  <select
                    name="primary_use_case"
                    value={formData.primary_use_case}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select primary use case</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="resale">Resale</option>
                    <option value="personal_use">Personal use</option>
                    <option value="export">Export</option>
                    <option value="processing">Processing</option>
                    <option value="research">Research & Development</option>
                  </select>
                </div>
              </>
            )}
            {/* Products of Interest and other fields for buyer or both */}
            {(formData.account_type === 'buyer' || formData.account_type === 'both') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Products of Interest *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {products.map((product) => (
                      <label key={product} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.products_interested.includes(product)}
                          onChange={() => handleProductChange(product)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{product}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Other Products (if not listed above)
                  </label>
                  <input
                    type="text"
                    name="products_other"
                    value={formData.products_other}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Specify other coconut products..."
                  />
                </div>
              </>
            )}
            {/* Seller fields for seller or both */}
            {(formData.account_type === 'seller' || formData.account_type === 'both') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Volume Capacity/Purchase
                  </label>
                  <select
                    name="monthly_volume"
                    value={formData.monthly_volume}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select volume range</option>
                    <option value="less_than_1">Less than 1 ton</option>
                    <option value="1_to_10">1-10 tons</option>
                    <option value="10_to_50">10-50 tons</option>
                    <option value="50_plus">50+ tons</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience in Coconut Industry
                  </label>
                  <select
                    name="years_experience"
                    value={formData.years_experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select experience level</option>
                    <option value="new">New to the industry</option>
                    <option value="1_to_3">1-3 years</option>
                    <option value="3_to_5">3-5 years</option>
                    <option value="5_to_10">5-10 years</option>
                    <option value="10_plus">10+ years</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about us?
              </label>
              <select
                name="hear_about_us"
                value={formData.hear_about_us}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Select option</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="linkedin">LinkedIn</option>
                <option value="google_search">Google Search</option>
                <option value="referral">Referral</option>
                <option value="ads">Ads</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments/Requirements
              </label>
              <textarea
                name="additional_info"
                value={formData.additional_info}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us more about your specific needs, requirements, or any other information..."
              />
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
              {isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist'}
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
