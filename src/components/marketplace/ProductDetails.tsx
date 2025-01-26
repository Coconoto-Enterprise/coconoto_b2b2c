import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Package, Phone, Mail, AlertCircle, ShoppingCart } from 'lucide-react';
import { products } from '../../data/products';
import { useAuth } from '../../context/AuthContext';
import { MakeOfferModal } from './MakeOfferModal';
import { OrderModal } from './OrderModal';
import { AuthModal } from '../auth/AuthModal';
import { SellerProfile } from './SellerProfile';

export function ProductDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = products.find(p => p.id === id);
  
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(searchParams.get('action') === 'order');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showSellerProfile, setShowSellerProfile] = useState(false);

  if (!product) {
    return <div className="container mx-auto px-6 py-8">Product not found</div>;
  }

  const handleMakeOffer = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsOfferModalOpen(true);
    }
  };

  const handleOrder = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setIsOrderModalOpen(true);
    }
  };

  const handleContactSeller = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      setShowSellerProfile(true);
    }
  };

  if (showSellerProfile) {
    return <SellerProfile seller={product.seller} />;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <span className="text-green-600 font-medium">{product.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-gray-400" />
              <span>{product.quantity} units available</span>
            </div>
          </div>
          
          <div className="border-t border-b py-4 mb-6">
            <div className="text-3xl font-bold text-gray-900">${product.price}</div>
            <div className="text-sm text-gray-500">per unit</div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold">Seller Information</h3>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span>{product.seller.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span>{product.seller.email}</span>
            </div>
          </div>
          
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-yellow-700">
                <AlertCircle className="h-5 w-5" />
                <span>Please sign in to contact the seller or make an offer</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={handleOrder}
              className="flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Order Now
            </button>
            <button
              onClick={handleContactSeller}
              className="bg-white border border-green-600 text-green-600 py-3 px-6 rounded-lg hover:bg-green-50 transition"
            >
              Contact Seller
            </button>
            <button
              onClick={handleMakeOffer}
              className="bg-white border border-green-600 text-green-600 py-3 px-6 rounded-lg hover:bg-green-50 transition"
            >
              Make Offer
            </button>
          </div>
        </div>
      </div>

      <MakeOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        product={product}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={product}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
}