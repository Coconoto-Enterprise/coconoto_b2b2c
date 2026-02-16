import { supabase } from '../lib/supabase';
import type { 
  Buyer, 
  BuyerSignupInput, 
  BuyerLoginInput, 
  BuyerUpdateInput,
  BuyerAuthResponse,
  BuyerOrder 
} from '../types/buyer';

// Buyer Signup
export async function buyerSignup(input: BuyerSignupInput): Promise<BuyerAuthResponse> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'buyer-signup', ...input }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'Signup failed' 
      };
    }

    return { success: true, buyer: data.buyer };
  } catch (error) {
    console.error('Buyer signup error:', error);
    return { success: false, error: 'Signup failed' };
  }
}

// Buyer Login
export async function buyerLogin(input: BuyerLoginInput): Promise<BuyerAuthResponse> {
  try {
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'buyer-login', ...input }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        error: data.error || 'Login failed' 
      };
    }

    return { success: true, buyer: data.buyer };
  } catch (error) {
    console.error('Buyer login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Get Buyer Profile
export async function getBuyerProfile(buyerId: string): Promise<Buyer | null> {
  try {
    const { data, error } = await supabase
      .from('buyers')
      .select('*')
      .eq('id', buyerId)
      .single();

    if (error || !data) {
      console.error('Get buyer profile error:', error);
      return null;
    }

    const { password_hash, ...buyer } = data;
    return buyer as Buyer;
  } catch (error) {
    console.error('Get buyer profile error:', error);
    return null;
  }
}

// Update Buyer Profile
export async function updateBuyerProfile(
  buyerId: string, 
  updates: BuyerUpdateInput
): Promise<{ success: boolean; buyer?: Buyer; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('buyers')
      .update(updates)
      .eq('id', buyerId)
      .select()
      .single();

    if (error) {
      console.error('Update buyer profile error:', error);
      return { success: false, error: 'Update failed' };
    }

    const { password_hash, ...buyer } = data;
    return { success: true, buyer: buyer as Buyer };
  } catch (error) {
    console.error('Update buyer profile error:', error);
    return { success: false, error: 'Update failed' };
  }
}

// Get Buyer Orders
export async function getBuyerOrders(buyerId: string): Promise<BuyerOrder[]> {
  try {
    const { data, error } = await supabase
      .from('buyer_order_history')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Get buyer orders error:', error);
      return [];
    }

    return data as BuyerOrder[];
  } catch (error) {
    console.error('Get buyer orders error:', error);
    return [];
  }
}

// Create Order with Buyer Account (for authenticated buyers)
export async function createOrderWithBuyer(
  vendorId: string,
  productId: string,
  buyerId: string,
  orderData: {
    quantity: number;
    delivery_address?: string;
    notes?: string;
  }
): Promise<{ success: boolean; order?: any; error?: string }> {
  try {
    // Get buyer info
    const buyer = await getBuyerProfile(buyerId);
    if (!buyer) {
      return { success: false, error: 'Buyer not found' };
    }

    // Get product info to calculate total price
    const { data: product, error: productError } = await supabase
      .from('vendor_products')
      .select('price, stock_quantity')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return { success: false, error: 'Product not found' };
    }

    if (product.stock_quantity < orderData.quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    const totalPrice = product.price * orderData.quantity;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('vendor_orders')
      .insert([{
        product_id: productId,
        vendor_id: vendorId,
        buyer_id: buyerId,
        customer_name: `${buyer.first_name} ${buyer.last_name}`,
        customer_email: buyer.email,
        customer_phone: buyer.phone || '',
        quantity: orderData.quantity,
        total_price: totalPrice,
        delivery_address: orderData.delivery_address || buyer.address || '',
        notes: orderData.notes || '',
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Create order error:', orderError);
      return { success: false, error: 'Failed to create order' };
    }

    // Update product stock
    await supabase
      .from('vendor_products')
      .update({ stock_quantity: product.stock_quantity - orderData.quantity })
      .eq('id', productId);

    return { success: true, order };
  } catch (error) {
    console.error('Create order with buyer error:', error);
    return { success: false, error: 'Failed to create order' };
  }
}
