import React, { useState } from 'react';
import { MapPin, Phone, Mail, Building2, Star, MessageCircle } from 'lucide-react';
import { Seller } from '../../types/product';
import { ContactSellerModal } from './ContactSellerModal';
import { useAuth } from '../../context/AuthContext';
import { AuthModal } from '../auth/AuthModal';

interface SellerProfileProps {
  seller: Seller;
}

export function SellerProfile({ seller }: SellerProfileProps) {
  const { user } = useAuth();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleContact = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsContactModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-green-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{seller.name}</h1>
              <div className="flex items-center mt-1">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1">{seller.rating} rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Business Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span>{seller.company}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{seller.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span>{seller.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>{seller.email}</span>
                </div>
              </div>

              <button
                onClick={handleContact}
                className="mt-6 flex items-center justify-center w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Seller
              </button>
            </div>

            {/* Statistics and Verification */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Seller Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">98%</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">&lt; 24h</div>
                  <div className="text-sm text-gray-600">Response Time</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">156</div>
                  <div className="text-sm text-gray-600">Completed Orders</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">4.8/5</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Verification Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-green-700">
                    <Star className="h-4 w-4 mr-2" />
                    Business Verified
                  </div>
                  <div className="flex items-center text-green-700">
                    <Star className="h-4 w-4 mr-2" />
                    Phone Verified
                  </div>
                  <div className="flex items-center text-green-700">
                    <Star className="h-4 w-4 mr-2" />
                    Email Verified
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContactSellerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        seller={seller}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
}