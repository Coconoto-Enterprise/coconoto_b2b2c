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
    }
  ]);
  return { data, error };
}
