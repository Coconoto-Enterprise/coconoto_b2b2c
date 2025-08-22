import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useProductCart } from './ProductCartContext';

interface FloatingCartButtonProps {
  onClick: () => void;
}

export function FloatingCartButton({ onClick }: FloatingCartButtonProps) {
  const { cart } = useProductCart();
  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className="fixed z-[80] bottom-6 right-6 bg-green-600 text-white rounded-full shadow-lg flex items-center px-5 py-3 gap-2 hover:bg-green-700 transition-all"
      style={{ minWidth: 56 }}
      aria-label="View cart and checkout"
    >
      <ShoppingBag className="w-6 h-6" />
      <span className="font-bold">{count}</span>
      <span className="ml-1 font-semibold hidden sm:inline">Checkout</span>
    </button>
  );
}
