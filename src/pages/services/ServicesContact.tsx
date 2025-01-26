import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export function ServicesContact() {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Contact Our Services Team
        </h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
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
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
              >
                Send Message
              </button>
            </form>

            <div className="mt-8 pt-8 border-t grid md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-green-600 mr-2" />
                <span>services@coconoto.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-2" />
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-green-600 mr-2" />
                <span>Global Locations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}