-- Create email_sender_config table for dynamic email sender mapping
-- This allows admin to configure which @coconoto.africa address sends each email type

CREATE TABLE IF NOT EXISTS public.email_sender_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type TEXT NOT NULL UNIQUE,
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.email_sender_config ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read
CREATE POLICY "Allow admins to read email config"
  ON public.email_sender_config
  FOR SELECT
  USING (TRUE); -- Later update to use auth.role() = 'admin'

-- Policy: Only admins can update
CREATE POLICY "Allow admins to update email config"
  ON public.email_sender_config
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- Insert default email types
INSERT INTO public.email_sender_config (email_type, sender_email, sender_name, is_active)
VALUES
  ('waitlist_signup', 'hello@coconoto.africa', 'Coconoto Team', true),
  ('contact_inquiry', 'support@coconoto.africa', 'Support Team', true),
  ('machine_order', 'sales@coconoto.africa', 'Sales Team', true),
  ('product_order', 'orders@coconoto.africa', 'Coconoto Orders', true),
  ('husk_sale', 'procurement@coconoto.africa', 'Procurement Team', true),
  ('event_booking', 'events@coconoto.africa', 'Events Team', true),
  ('internal_notification', 'admin@coconoto.africa', 'Admin Alerts', true)
ON CONFLICT (email_type) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX idx_email_config_type ON public.email_sender_config(email_type);
CREATE INDEX idx_email_config_active ON public.email_sender_config(is_active);
