import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { vendorSignup } from '../../services/vendorService';

export function VendorSignup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    business_name: '',
    contact_name: '',
    phone: '',
    address: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    const result = await vendorSignup({
      email: formData.email,
      password: formData.password,
      business_name: formData.business_name,
      contact_name: formData.contact_name,
      phone: formData.phone,
      address: formData.address,
      description: formData.description
    });

    if (result.success && result.vendor) {
      // Store vendor info in localStorage
      localStorage.setItem('vendorId', result.vendor.id);
      localStorage.setItem('vendorEmail', result.vendor.email);
      localStorage.setItem('vendorBusinessName', result.vendor.business_name);
      navigate('/vendor-dashboard');
    } else {
      setError(result.error || 'Signup failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-green-700">
              C<img src="/favicon.png" alt="o" className="h-6 inline-block mx-[-6px] mb-1" />co-connect
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Become a Vendor
          </h2>
          <p className="text-gray-600">
            Join our marketplace and start selling your coconut products
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-green-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Account Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Min. 6 characters"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="business_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    id="business_name"
                    name="business_name"
                    type="text"
                    value={formData.business_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your farm or business name"
                  />
                </div>

                <div>
                  <label htmlFor="contact_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    id="contact_name"
                    name="contact_name"
                    type="text"
                    value={formData.contact_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="City, State, Country"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about your business and products..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Vendor Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/vendor-login" className="text-green-700 font-semibold hover:text-green-800">
                Sign In
              </Link>
            </p>
          </div>

          {/* Back to Marketplace */}
          <div className="mt-4 text-center">
            <Link to="/marketplace" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
