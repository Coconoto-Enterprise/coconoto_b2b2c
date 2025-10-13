import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useProductCart } from './ProductCartContext';
import { submitProductOrder } from '../services/productOrder';
import { sendProductOrderEmails } from '../utils/vercelEmailService';

interface ProductCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCheckoutModal({ isOpen, onClose }: ProductCheckoutModalProps) {
  const { cart, clearCart, removeFromCart, increment, decrement } = useProductCart();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const total = cart.reduce((sum, p) => {
    const price = parseInt(p.price.replace(/[^\d]/g, '')) || 0;
    return sum + price * p.quantity;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const { error } = await submitProductOrder({
        ...form,
        products: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
      });
      if (error) {
        setSubmitMessage('Failed to submit order. Please try again.');
      } else {
        setSubmitMessage('Order submitted! We will contact you soon.');
        // Send notification email via Resend API
        try {
          const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
          await sendProductOrderEmails({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            cart: cart, // Send full cart data for template
            products: cart.map(p => `${p.name} (x${p.quantity})`).join(', '),
            total: totalAmount,
            orderType: 'Product Order',
            submittedAt: new Date().toLocaleString()
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
        }
        clearCart();
        setTimeout(() => {
          setSubmitMessage(null);
          onClose();
        }, 2000);
      }
    } catch (err) {
      setSubmitMessage('Network error. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white bg-opacity-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Header */}
        <div className="sticky top-0 bg-white bg-opacity-90 border-b border-gray-100 p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button onClick={onClose} aria-label="Close modal" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
            <ul className="divide-y divide-gray-200 mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <button type="button" onClick={() => decrement(item.id)} className="w-6 h-6 rounded bg-gray-200 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-300">-</button>
                        <span className="text-xs text-gray-700 font-semibold w-6 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => increment(item.id)} className="w-6 h-6 rounded bg-gray-200 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-300">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-semibold">{item.price}</span>
                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline text-xs ml-2">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-right font-bold text-lg mb-4">Total: ₦{total.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" required placeholder="Full Name" value={form.name} onChange={handleInputChange} className="px-4 py-3 border border-gray-300 rounded-lg" />
            <input type="email" name="email" required placeholder="Email" value={form.email} onChange={handleInputChange} className="px-4 py-3 border border-gray-300 rounded-lg" />
            <input type="tel" name="phone" required placeholder="Phone Number" value={form.phone} onChange={handleInputChange} className="px-4 py-3 border border-gray-300 rounded-lg" />
            <input type="text" name="address" required placeholder="Delivery Address" value={form.address} onChange={handleInputChange} className="px-4 py-3 border border-gray-300 rounded-lg" />
            <input type="text" name="city" placeholder="City" value={form.city} onChange={handleInputChange} className="px-4 py-3 border border-gray-300 rounded-lg" />
            <input type="text" name="state" placeholder="State" value={form.state} onChange={handleInputChange} className="px-4 py-3 border border-gray-300 rounded-lg" />
            <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleInputChange} className="px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
          <textarea name="notes" placeholder="Additional Notes (optional)" value={form.notes} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none" rows={3} />
          {submitMessage && <div className="p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">{submitMessage}</div>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}
