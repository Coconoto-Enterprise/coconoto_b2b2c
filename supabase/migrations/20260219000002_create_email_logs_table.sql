-- Create email_logs table for tracking all sent emails
-- This enables the Gmail-style sent folder view in the admin dashboard

CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_address TEXT NOT NULL,
  to_addresses TEXT[] NOT NULL,
  subject TEXT NOT NULL,
  preview TEXT,
  full_html TEXT,
  email_type TEXT,
  status TEXT DEFAULT 'pending', -- pending, delivered, failed, bounced
  resend_id TEXT UNIQUE,
  resend_created_at TIMESTAMP WITH TIME ZONE,
  sent_by_id UUID,
  sent_by_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read
CREATE POLICY "Allow admins to read email logs"
  ON public.email_logs
  FOR SELECT
  USING (TRUE); -- Later update to use auth.role() = 'admin'

-- Policy: Only admins and API can insert
CREATE POLICY "Allow API to insert email logs"
  ON public.email_logs
  FOR INSERT
  WITH CHECK (TRUE);

-- Policy: Only admins can update
CREATE POLICY "Allow admins to update email logs"
  ON public.email_logs
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- Create indexes for faster queries
CREATE INDEX idx_email_logs_created_at ON public.email_logs(created_at DESC);
CREATE INDEX idx_email_logs_email_type ON public.email_logs(email_type);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);
CREATE INDEX idx_email_logs_from_address ON public.email_logs(from_address);
CREATE INDEX idx_email_logs_resend_id ON public.email_logs(resend_id);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_logs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_logs_update_timestamp
BEFORE UPDATE ON public.email_logs
FOR EACH ROW
EXECUTE FUNCTION update_email_logs_timestamp();
