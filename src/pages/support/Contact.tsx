import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import Navbar from '/src/components/Navbar';
import Footer from '/src/components/Footer';

export function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    const { data, error: supaError } = await supabase.from('service_contacts').insert([
      {
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        created_at: new Date().toISOString()
      }
    ]);
    setLoading(false);
    if (supaError) {
      setError('Submission failed. Please try again.');
    } else {
      setSuccess('Your message has been sent!');
      // Send notification email via Netlify proxy
  fetch('/.netlify/functions/mail-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'New Contact Message',
          message: `Contact message:\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`
        })
      });
      setForm({ name: '', phone: '', email: '', message: '' });
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow pt-16">
        <div className="bg-green-700 text-white py-12 w-full text-center">
          <div className="container mx-auto px-6 pt-10 pb-10">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-green-100">Get in touch with our team</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-3 gap-0">
              {/* Left side - Form with black translucent background */}
              <div className="bg-white p-8 md:col-span-2">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                        placeholder="Enter your full name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                        placeholder="+234 800 000 0000"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white bg-opacity-90"
                      placeholder="your@email.com"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none bg-white bg-opacity-90"
                      placeholder="Tell us how we can help you..."
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  {success && <p className="text-green-600 mt-4">{success}</p>}
                  {error && <p className="text-red-600 mt-4">{error}</p>}
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
      </main>

      <Footer />
    </div>
  );
}
