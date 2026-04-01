-- ═══════════════════════════════════════════════════════════
-- PhysioSthanak — Pilates Tables Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════

-- 1. Pilates Batches
CREATE TABLE pilates_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('online', 'offline')),
  schedule TEXT NOT NULL,
  days TEXT NOT NULL,
  time TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  current_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Pilates Registrations
CREATE TABLE pilates_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID REFERENCES pilates_batches(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  age INTEGER NOT NULL,
  preference TEXT NOT NULL CHECK (preference IN ('online', 'offline')),
  medical_history TEXT,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'waitlisted', 'confirmed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial')),
  consultation_status TEXT DEFAULT 'pending' CHECK (consultation_status IN ('pending', 'scheduled', 'done')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Admin Settings
CREATE TABLE pilates_admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

-- ═══════════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE pilates_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilates_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilates_admin_settings ENABLE ROW LEVEL SECURITY;

-- Batches: Public can READ active batches, Auth users can do everything
CREATE POLICY "Public can view active batches"
  ON pilates_batches FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage batches"
  ON pilates_batches FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Registrations: Public can INSERT (form submission), Auth users can do everything
CREATE POLICY "Public can register"
  ON pilates_registrations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage registrations"
  ON pilates_registrations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Admin Settings: Auth users only
CREATE POLICY "Authenticated users can manage settings"
  ON pilates_admin_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════
-- Triggers for auto batch count management
-- ═══════════════════════════════════════════════════════════

-- Auto-increment batch count on registration, auto-waitlist if full
CREATE OR REPLACE FUNCTION increment_batch_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.batch_id IS NOT NULL AND NEW.status = 'registered' THEN
    UPDATE pilates_batches
    SET current_count = current_count + 1,
        updated_at = now()
    WHERE id = NEW.batch_id
      AND current_count < capacity;

    IF NOT FOUND THEN
      NEW.status := 'waitlisted';
      NEW.batch_id := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_insert
  BEFORE INSERT ON pilates_registrations
  FOR EACH ROW
  EXECUTE FUNCTION increment_batch_count();

-- Auto-decrement batch count on cancellation
CREATE OR REPLACE FUNCTION decrement_batch_count()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'registered' AND NEW.status = 'cancelled' AND OLD.batch_id IS NOT NULL THEN
    UPDATE pilates_batches
    SET current_count = current_count - 1,
        updated_at = now()
    WHERE id = OLD.batch_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_cancel
  BEFORE UPDATE ON pilates_registrations
  FOR EACH ROW
  EXECUTE FUNCTION decrement_batch_count();

-- ═══════════════════════════════════════════════════════════
-- Seed batch data (matching current website batches)
-- ═══════════════════════════════════════════════════════════

INSERT INTO pilates_batches (name, type, schedule, days, time, capacity) VALUES
  ('Offline — 9:00 AM Batch', 'offline', 'Mon & Thu, 9:00 AM - 9:45 AM', 'Mon & Thu', '9:00 AM - 9:45 AM', 12),
  ('Offline — 10:00 AM Batch', 'offline', 'Mon & Thu, 10:00 AM - 10:45 AM', 'Mon & Thu', '10:00 AM - 10:45 AM', 12),
  ('Offline — 9:00 AM Batch', 'offline', 'Tue & Fri, 9:00 AM - 9:45 AM', 'Tue & Fri', '9:00 AM - 9:45 AM', 12),
  ('Offline — 10:00 AM Batch', 'offline', 'Tue & Fri, 10:00 AM - 10:45 AM', 'Tue & Fri', '10:00 AM - 10:45 AM', 12),
  ('Online — 8:00 AM Batch', 'online', 'Mon & Thu, 8:00 AM - 8:45 AM', 'Mon & Thu', '8:00 AM - 8:45 AM', 15),
  ('Online — 9:00 AM Batch', 'online', 'Mon & Thu, 9:00 AM - 9:45 AM', 'Mon & Thu', '9:00 AM - 9:45 AM', 15),
  ('Online — 10:00 AM Batch', 'online', 'Mon & Thu, 10:00 AM - 10:45 AM', 'Mon & Thu', '10:00 AM - 10:45 AM', 15),
  ('Online — 8:00 AM Batch', 'online', 'Tue & Fri, 8:00 AM - 8:45 AM', 'Tue & Fri', '8:00 AM - 8:45 AM', 15),
  ('Online — 9:00 AM Batch', 'online', 'Tue & Fri, 9:00 AM - 9:45 AM', 'Tue & Fri', '9:00 AM - 9:45 AM', 15),
  ('Online — 10:00 AM Batch', 'online', 'Tue & Fri, 10:00 AM - 10:45 AM', 'Tue & Fri', '10:00 AM - 10:45 AM', 15);

-- Seed admin settings
INSERT INTO pilates_admin_settings (key, value) VALUES
  ('notification_emails', 'physiosthanak@gmail.com'),
  ('waitlist_enabled', 'true');
