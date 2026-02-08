export interface Vendor {
  id: string;
  email: string;
  business_name: string;
  contact_name: string;
  phone?: string;
  address?: string;
  description?: string;
  logo_url?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorSignupData {
  email: string;
  password: string;
  business_name: string;
  contact_name: string;
  phone?: string;
  address?: string;
  description?: string;
}

export interface VendorLoginData {
  email: string;
  password: string;
}

export interface VendorProduct {
  id: string;
  vendor_id: string;
  product_name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  vendor?: Vendor; // For joined queries
}

export interface VendorProductInput {
  product_name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  stock_quantity: number;
  image_url?: string;
  is_active?: boolean;
}

export interface VendorOrder {
  id: string;
  product_id: string;
  vendor_id: string;
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
  product?: VendorProduct; // For joined queries
}

export interface VendorOrderInput {
  product_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  quantity: number;
  delivery_address?: string;
  notes?: string;
}

export const PRODUCT_CATEGORIES = [
  'Fresh Coconuts',
  'Coconut Water',
  'Coconut Oil',
  'Coconut Milk',
  'Desiccated Coconut',
  'Coconut Flour',
  'Coconut Sugar',
  'Coconut Shells',
  'Coconut Husks',
  'Coir Products',
  'Other Products'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

export const UNITS = [
  'piece',
  'kg',
  'liter',
  'ton',
  'bag',
  'box',
  'bundle'
] as const;

export type Unit = typeof UNITS[number];
