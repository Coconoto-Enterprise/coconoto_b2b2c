import React from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Globe } from 'lucide-react';

export function Contact() {
  const offices = [
    {
      city: "New York",
      address: "123 Business Ave, NY 10001",
      phone: "+1 234 567 8900"
    },
    {
      city: "London",
      address: "456 Trade St, London EC1A 1BB",
      phone: "+44 20 7123 4567"
    },
    {
      city: "Singapore",
      address: "789 Market Rd, Singapore 048619",
      phone: "+65 6789 0123"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-green-100">Get in touch with our team</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Other Ways to Connect</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-gray-600">Chat with our support team in real-time</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-gray-600">We're here to help anytime</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Globe className="h-6 w-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">Global Support</h3>
                  <p className="text-gray-600">Support in multiple languages</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-6">Our Offices</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">{office.city}</h3>
                      <p className="text-gray-600">{office.address}</p>
                      <p className="text-gray-600">{office.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}