import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../../types/product';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-600">{product.category}</span>
          <span className="text-sm text-gray-500">{product.location}</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        </Link>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          <span className="text-sm text-gray-500">{product.quantity} available</span>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition text-sm"
          >
            View Details
          </Link>
          <Link
            to={user ? `/product/${product.id}?action=order` : '/login'}
            className="flex items-center justify-center bg-green-100 text-green-700 py-2 px-4 rounded-lg hover:bg-green-200 transition"
          >
            <ShoppingCart className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}