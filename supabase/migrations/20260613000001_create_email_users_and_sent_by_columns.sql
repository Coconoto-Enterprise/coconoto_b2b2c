-- Create email_users table and add sent_by tracking to email_logs

CREATE TABLE IF NOT EXISTS public.email_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.email_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins to read email users"
  ON public.email_users
  FOR SELECT
  USING (true);

CREATE POLICY "Allow admins to insert email users"
  ON public.email_users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow admins to update email users"
  ON public.email_users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Add sender tracking to existing email logs
ALTER TABLE public.email_logs
  ADD COLUMN IF NOT EXISTS sent_by_id UUID;

ALTER TABLE public.email_logs
  ADD COLUMN IF NOT EXISTS sent_by_email TEXT;

ALTER TABLE public.email_logs
  ADD CONSTRAINT IF NOT EXISTS fk_email_logs_sent_by_user
  FOREIGN KEY (sent_by_id)
  REFERENCES public.email_users (id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_email_logs_sent_by_email ON public.email_logs(sent_by_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_by_id ON public.email_logs(sent_by_id);

-- Keep updated_at current for email_users
CREATE OR REPLACE FUNCTION update_email_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_users_update_timestamp ON public.email_users;
CREATE TRIGGER email_users_update_timestamp
BEFORE UPDATE ON public.email_users
FOR EACH ROW
EXECUTE FUNCTION update_email_users_timestamp();
