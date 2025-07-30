import React from 'react';
import { TrendingUp, Users, DollarSign, Globe } from 'lucide-react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

export function InvestmentSection() {
  const metrics = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      value: "127%",
      label: "Annual Growth",
      description: "Year-over-year revenue growth"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      value: "10,000+",
      label: "Active Users",
      description: "Verified businesses on our platform"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      value: "$50M+",
      label: "Transaction Volume",
      description: "Monthly trading volume"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      value: "45+",
      label: "Countries",
      description: "Global market presence"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-0">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Invest in Coconoto
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us in revolutionizing the coconut industry through technology and innovation
          </p>
        </div>


        <div className="container mx-auto px-6 py-12">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Left side - Form with black translucent background */}
              <div className="bg-white p-8 md:col-span-2">
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                        placeholder="Enter your full name"
                        name="fullName"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Company Name *</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                        placeholder="Enter your company name"
                        name="companyName"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                        placeholder="your@email.com"
                        name="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Phone *</label>
                      <input
                        type="tel"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                        placeholder="+234 800 000 0000"
                        name="phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Investment Range *</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                      name="investmentRange"
                    >
                      <option value="">Select range</option>
                      <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                      <option value="$20,000 - $35,000">$20,000 - $35,000</option>
                      <option value="$35,000 - $50,000">$35,000 - $50,000</option>
                      <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                      <option value="$100,000 - $500,000">$100,000 - $500,000</option>
                      <option value="$500,000 - $1,000,000">$500,000 - $1,000,000</option>
                      <option value="$1,000,000+">$1,000,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-white bg-opacity-90"
                      placeholder="Tell us about your investment interests and experience..."
                      name="message"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Right side - Contact info with green translucent background */}
              <div className="bg-green-700 p-8">
                <h2 className="text-2xl font-bold mb-8 text-white">Contact Information</h2>
                
                {/* Contact Information */}
                <div className="space-y-8 mb-12">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-white" />
                    <div>
                      <p className="text-gray-100">No 67. Cele estate, mowo kekere, Ikorodu, Lagos, Nigeria</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-white" />
                    <div>
                      <p className="text-gray-100">+234 814 860 9051</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-white" />
                    <div>
                      <p className="text-gray-100">coconotoenterprise@gmail.com</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-6 text-white">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="https://m.facebook.com/p/Coconoto-100092422418297/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors" aria-label="Facebook">
                      <FaFacebook className="h-8 w-8" />
                    </a>
                    <a href="https://www.instagram.com/_coconoto?igsh=MTNuZXh1dGF1dTd0dw==" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors" aria-label="Instagram">
                      <FaInstagram className="h-8 w-8" />
                    </a>
                    <a href="https://www.linkedin.com/company/coconoto/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors" aria-label="LinkedIn">
                      <FaLinkedin className="h-8 w-8" />
                    </a>
                    <a href="https://wa.me/qr/CTOTUF7JCEUFE1" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-200 transition-colors" aria-label="WhatsApp">
                      <FaWhatsapp className="h-8 w-8" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}