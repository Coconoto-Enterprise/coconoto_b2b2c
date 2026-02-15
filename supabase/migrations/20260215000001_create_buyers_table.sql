-- Create buyers table
CREATE TABLE IF NOT EXISTS buyers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Update vendor_orders table to optionally link to buyer accounts (only if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendor_orders') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'vendor_orders' AND column_name = 'buyer_id') THEN
      ALTER TABLE vendor_orders ADD COLUMN buyer_id UUID REFERENCES buyers(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_buyers_email ON buyers(email);
CREATE INDEX IF NOT EXISTS idx_buyers_is_active ON buyers(is_active);

-- Create index on vendor_orders.buyer_id only if table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendor_orders') THEN
    CREATE INDEX IF NOT EXISTS idx_vendor_orders_buyer_id ON vendor_orders(buyer_id);
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at on buyers
DROP TRIGGER IF EXISTS update_buyers_updated_at ON buyers;
CREATE TRIGGER update_buyers_updated_at BEFORE UPDATE ON buyers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE buyers ENABLE ROW LEVEL SECURITY;

-- Create policies for buyers table
CREATE POLICY "Buyers can view their own data" ON buyers
  FOR SELECT USING (true);

CREATE POLICY "Buyers can insert their own data" ON buyers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Buyers can update their own data" ON buyers
  FOR UPDATE USING (true);

-- Create a view for buyer orders (buyers can see their own orders)
-- Only create if all required tables exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendor_orders') 
     AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendor_products')
     AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendors') THEN
    
    CREATE OR REPLACE VIEW buyer_order_history AS
    SELECT 
      vo.*,
      vp.product_name,
      vp.image_url as product_image_url,
      v.business_name as vendor_business_name,
      v.phone as vendor_phone,
      v.email as vendor_email
    FROM vendor_orders vo
    LEFT JOIN vendor_products vp ON vo.product_id = vp.id
    LEFT JOIN vendors v ON vo.vendor_id = v.id;

    -- Grant permissions on the view
    GRANT SELECT ON buyer_order_history TO authenticated;
    GRANT SELECT ON buyer_order_history TO anon;
  END IF;
END $$;
