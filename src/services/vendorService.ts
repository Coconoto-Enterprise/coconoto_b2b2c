import { supabase } from '../lib/supabase';
import type {
  Vendor,
  VendorSignupData,
  VendorLoginData,
  VendorProduct,
  VendorProductInput,
  VendorOrder,
  VendorOrderInput
} from '../types/vendor';

// Vendor Authentication
export const vendorSignup = async (data: VendorSignupData): Promise<{ success: boolean; vendor?: Vendor; error?: string }> => {
  try {
    const response = await fetch('/api/vendor-signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create vendor account' };
  }
};

export const vendorLogin = async (credentials: VendorLoginData): Promise<{ success: boolean; vendor?: Vendor; error?: string }> => {
  try {
    const response = await fetch('/api/vendor-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to login' };
  }
};

// Vendor Profile Management
export const getVendorProfile = async (vendorId: string): Promise<Vendor | null> => {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('id, email, business_name, contact_name, phone, address, description, logo_url, is_verified, is_active, created_at, updated_at')
      .eq('id', vendorId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    return null;
  }
};

export const updateVendorProfile = async (vendorId: string, updates: Partial<Vendor>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vendors')
      .update(updates)
      .eq('id', vendorId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    return false;
  }
};

// Product Management
export const getVendorProducts = async (vendorId: string): Promise<VendorProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('vendor_products')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    return [];
  }
};

export const getAllMarketplaceProducts = async (): Promise<VendorProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('vendor_products')
      .select(`
        *,
        vendor:vendors(business_name, contact_name, phone, email, is_verified)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching marketplace products:', error);
    return [];
  }
};

export const getProductById = async (productId: string): Promise<VendorProduct | null> => {
  try {
    const { data, error } = await supabase
      .from('vendor_products')
      .select(`
        *,
        vendor:vendors(business_name, contact_name, phone, email, is_verified, address)
      `)
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (vendorId: string, productData: VendorProductInput): Promise<{ success: boolean; product?: VendorProduct; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('vendor_products')
      .insert([{
        vendor_id: vendorId,
        ...productData
      }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, product: data };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: 'Failed to create product' };
  }
};

export const updateProduct = async (productId: string, vendorId: string, updates: Partial<VendorProductInput>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vendor_products')
      .update(updates)
      .eq('id', productId)
      .eq('vendor_id', vendorId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    return false;
  }
};

export const deleteProduct = async (productId: string, vendorId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vendor_products')
      .delete()
      .eq('id', productId)
      .eq('vendor_id', vendorId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

// Order Management
export const createOrder = async (vendorId: string, orderData: VendorOrderInput): Promise<{ success: boolean; order?: VendorOrder; error?: string }> => {
  try {
    // Get product details to calculate total
    const product = await getProductById(orderData.product_id);
    
    if (!product) {
      return { success: false, error: 'Product not found' };
    }

    if (product.stock_quantity < orderData.quantity) {
      return { success: false, error: 'Insufficient stock' };
    }

    const total_price = product.price * orderData.quantity;

    const { data, error } = await supabase
      .from('vendor_orders')
      .insert([{
        vendor_id: vendorId,
        product_id: orderData.product_id,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        quantity: orderData.quantity,
        total_price,
        delivery_address: orderData.delivery_address,
        notes: orderData.notes,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Update product stock
    await supabase
      .from('vendor_products')
      .update({ stock_quantity: product.stock_quantity - orderData.quantity })
      .eq('id', orderData.product_id);

    return { success: true, order: data };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
};

export const getVendorOrders = async (vendorId: string): Promise<VendorOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('vendor_orders')
      .select(`
        *,
        product:vendor_products(product_name, category, unit, price)
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, vendorId: string, status: VendorOrder['status']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('vendor_orders')
      .update({ status })
      .eq('id', orderId)
      .eq('vendor_id', vendorId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

// Image Upload
export const uploadProductImage = async (vendorId: string, imageFile: File): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('vendorId', vendorId);

    const response = await fetch('/api/upload-product-image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Image upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};
