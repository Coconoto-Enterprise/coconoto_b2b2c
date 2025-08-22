import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export interface ProductCartContextType {
  cart: CartProduct[];
  addToCart: (product: Omit<CartProduct, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
}

const ProductCartContext = createContext<ProductCartContextType | undefined>(undefined);


export function useProductCart() {
  const ctx = useContext(ProductCartContext);
  if (!ctx) throw new Error('useProductCart must be used within ProductCartProvider');
  return ctx;
}

interface ProductCartProviderProps {
  children: ReactNode;
}

export function ProductCartProvider({ children }: ProductCartProviderProps) {
  const [cart, setCart] = useState<CartProduct[]>([]);

  const addToCart = (product: Omit<CartProduct, 'quantity'>) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const increment = (id: string) => {
    setCart((prev) => prev.map((p) => p.id === id ? { ...p, quantity: p.quantity + 1 } : p));
  };

  const decrement = (id: string) => {
    setCart((prev) => prev.map((p) =>
      p.id === id ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p
    ));
  };

  return (
    <ProductCartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increment, decrement }}>
      {children}
    </ProductCartContext.Provider>
  );
}
