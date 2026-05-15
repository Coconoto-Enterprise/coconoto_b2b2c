// Buyer types for the marketplace

export interface Buyer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuyerSignupInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface BuyerLoginInput {
  email: string;
  password: string;
}

export interface BuyerUpdateInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface BuyerOrder {
  id: string;
  product_id: string;
  vendor_id: string;
  buyer_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  quantity: number;
  total_price: number;
  delivery_address?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  // From view
  product_name?: string;
  product_image_url?: string;
  vendor_business_name?: string;
  vendor_phone?: string;
  vendor_email?: string;
}

export interface BuyerAuthResponse {
  success: boolean;
  buyer?: Buyer;
  error?: string;
}
