import { supabase } from '../lib/supabase';

export async function submitProductOrder(order: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  notes?: string;
  products: Array<{ id: string; name: string; price: string; quantity: number; }>;
}) {
  // Calculate total dynamically
  const calculatedTotal = order.products.reduce((sum, product) => {
    const price = parseInt(product.price.replace(/[^\d]/g, '')) || 0;
    return sum + (price * product.quantity);
  }, 0);

  const { data, error } = await supabase.from('product_orders').insert([
    {
      name: order.name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      state: order.state,
      country: order.country,
      notes: order.notes,
      products: order.products,
      total_price: calculatedTotal // Save calculated total to database with correct field name
    }
  ]);
  return { data, error };
}
