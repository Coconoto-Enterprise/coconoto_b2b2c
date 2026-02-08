-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create vendor_products table
CREATE TABLE IF NOT EXISTS vendor_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create vendor_orders table
CREATE TABLE IF NOT EXISTS vendor_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES vendor_products(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_category ON vendor_products(category);
CREATE INDEX IF NOT EXISTS idx_vendor_products_is_active ON vendor_products(is_active);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_vendor_id ON vendor_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_product_id ON vendor_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_vendor_orders_status ON vendor_orders(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_products_updated_at BEFORE UPDATE ON vendor_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_orders_updated_at BEFORE UPDATE ON vendor_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for vendors table
CREATE POLICY "Vendors can view their own data" ON vendors
  FOR SELECT USING (true);

CREATE POLICY "Vendors can insert their own data" ON vendors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendors can update their own data" ON vendors
  FOR UPDATE USING (true);

-- Create policies for vendor_products table
CREATE POLICY "Anyone can view active products" ON vendor_products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Vendors can insert their own products" ON vendor_products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendors can update their own products" ON vendor_products
  FOR UPDATE USING (true);

CREATE POLICY "Vendors can delete their own products" ON vendor_products
  FOR DELETE USING (true);

-- Create policies for vendor_orders table
CREATE POLICY "Anyone can create orders" ON vendor_orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Vendors can view their orders" ON vendor_orders
  FOR SELECT USING (true);

CREATE POLICY "Vendors can update their orders" ON vendor_orders
  FOR UPDATE USING (true);
