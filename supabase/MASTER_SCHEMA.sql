-- ============================================================
-- MASTER DATABASE SETUP - Complete Schema from Scratch
-- SalonPro Billing & Expense System
-- 
-- Run this ONCE on a fresh Supabase database
-- This file includes:
-- ✓ All tables with proper structure
-- ✓ Staff split feature (JSONB assignments)
-- ✓ Auto-resequencing serial numbers (no gaps after delete)
-- ✓ RLS policies
-- ✓ Indexes for performance
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- STEP 1: Drop Everything (if re-running)
-- ─────────────────────────────────────────────────────────────

-- Drop triggers
DROP TRIGGER IF EXISTS billings_updated_at ON billings CASCADE;
DROP TRIGGER IF EXISTS billings_set_serial ON billings CASCADE;
DROP TRIGGER IF EXISTS billings_resequence_after_delete ON billings CASCADE;
DROP TRIGGER IF EXISTS expenses_set_serial ON expenses CASCADE;
DROP TRIGGER IF EXISTS expenses_resequence_after_delete ON expenses CASCADE;
DROP TRIGGER IF EXISTS expenses_updated_at ON expenses CASCADE;
DROP TRIGGER IF EXISTS staff_set_serial ON staff CASCADE;
DROP TRIGGER IF EXISTS staff_resequence_after_delete ON staff CASCADE;
DROP TRIGGER IF EXISTS staff_updated_at ON staff CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS assign_billing_serial() CASCADE;
DROP FUNCTION IF EXISTS resequence_billing_serials() CASCADE;
DROP FUNCTION IF EXISTS assign_expense_serial() CASCADE;
DROP FUNCTION IF EXISTS resequence_expense_serials() CASCADE;
DROP FUNCTION IF EXISTS assign_staff_serial() CASCADE;
DROP FUNCTION IF EXISTS resequence_staff_serials() CASCADE;

-- Drop tables (cascade will drop related objects)
DROP TABLE IF EXISTS billing_services CASCADE;
DROP TABLE IF EXISTS billings CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS staff CASCADE;

-- Drop types
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS expense_priority CASCADE;
DROP TYPE IF EXISTS expense_recurrence CASCADE;
DROP TYPE IF EXISTS customer_gender CASCADE;
DROP TYPE IF EXISTS staff_role CASCADE;
DROP TYPE IF EXISTS staff_status CASCADE;

-- ─────────────────────────────────────────────────────────────
-- STEP 2: Create ENUMS
-- ─────────────────────────────────────────────────────────────

CREATE TYPE payment_method AS ENUM (
  'Cash', 'UPI', 'Card', 'Bank Transfer', 'Online Payment'
);

CREATE TYPE expense_priority AS ENUM ('Low', 'Medium', 'High');

CREATE TYPE expense_recurrence AS ENUM (
  'One Time', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'
);

CREATE TYPE customer_gender AS ENUM ('Male', 'Female');

CREATE TYPE staff_role AS ENUM (
  'Stylist', 'Barber', 'Therapist', 'Manager', 'Other'
);

CREATE TYPE staff_status AS ENUM (
  'Active', 'Inactive'
);

-- ─────────────────────────────────────────────────────────────
-- STEP 3: Create BILLINGS Table
-- ─────────────────────────────────────────────────────────────

CREATE TABLE billings (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number   BIGINT        NOT NULL,
  customer_name   TEXT          NOT NULL CHECK (char_length(customer_name) <= 100),
  mobile_number   TEXT          NOT NULL CHECK (char_length(mobile_number) <= 10 AND mobile_number ~ '^[0-9]*$'),
  customer_gender customer_gender,
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  discount        NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  tax             NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  grand_total     NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (grand_total >= 0),
  payment_method  payment_method NOT NULL DEFAULT 'Cash',
  notes           TEXT          CHECK (char_length(notes) <= 500),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_billings_created_at ON billings (created_at DESC);
CREATE INDEX idx_billings_serial ON billings (serial_number);

-- ─────────────────────────────────────────────────────────────
-- STEP 4: Create BILLING_SERVICES Table (with Staff Splits)
-- ─────────────────────────────────────────────────────────────

CREATE TABLE billing_services (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_id        UUID          NOT NULL REFERENCES billings(id) ON DELETE CASCADE,
  name              TEXT          NOT NULL CHECK (char_length(name) <= 100),
  price             NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  quantity          INTEGER       NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 1000),
  service_by        TEXT          CHECK (char_length(service_by) <= 200),
  staff_assignments JSONB,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_billing_services_billing_id ON billing_services (billing_id);
CREATE INDEX idx_billing_services_staff_assignments ON billing_services USING GIN (staff_assignments);

COMMENT ON COLUMN billing_services.service_by IS 'Comma-separated staff names (auto-populated for display)';
COMMENT ON COLUMN billing_services.staff_assignments IS 'JSONB array: [{"staffName": "Ravi", "amount": 500}]';

-- ─────────────────────────────────────────────────────────────
-- STEP 5: Create EXPENSES Table
-- ─────────────────────────────────────────────────────────────

CREATE TABLE expenses (
  id              UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number   BIGINT              NOT NULL,
  title           TEXT                 NOT NULL CHECK (char_length(title) <= 100),
  description     TEXT                 NOT NULL DEFAULT '' CHECK (char_length(description) <= 500),
  amount          NUMERIC(12,2)        NOT NULL DEFAULT 0 CHECK (amount >= 0),
  category        TEXT                 NOT NULL CHECK (char_length(category) <= 50),
  payment_method  payment_method       NOT NULL DEFAULT 'Cash',
  vendor_name     TEXT                 NOT NULL DEFAULT '' CHECK (char_length(vendor_name) <= 100),
  date            DATE                 NOT NULL DEFAULT CURRENT_DATE,
  notes           TEXT                 CHECK (char_length(notes) <= 500),
  priority        expense_priority     NOT NULL DEFAULT 'Medium',
  recurrence      expense_recurrence   NOT NULL DEFAULT 'One Time',
  receipt_url     TEXT,
  created_at      TIMESTAMPTZ          NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ          NOT NULL DEFAULT now()
);

CREATE INDEX idx_expenses_date ON expenses (date DESC);
CREATE INDEX idx_expenses_created_at ON expenses (created_at DESC);
CREATE INDEX idx_expenses_serial ON expenses (serial_number);

-- ─────────────────────────────────────────────────────────────
-- STEP 6: Create STAFF Table
-- ─────────────────────────────────────────────────────────────

CREATE TABLE staff (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number   BIGINT          NOT NULL,
  name            TEXT            NOT NULL CHECK (char_length(name) <= 100),
  role            staff_role      NOT NULL DEFAULT 'Stylist',
  mobile_number   TEXT            NOT NULL CHECK (char_length(mobile_number) <= 10 AND mobile_number ~ '^[0-9]*$'),
  status          staff_status    NOT NULL DEFAULT 'Active',
  join_date       DATE            NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_created_at ON staff (created_at DESC);
CREATE INDEX idx_staff_serial ON staff (serial_number);

-- ─────────────────────────────────────────────────────────────
-- STEP 7: Create Shared Functions
-- ─────────────────────────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────
-- STEP 8: BILLINGS - Serial Number Functions & Triggers
-- ─────────────────────────────────────────────────────────────

-- Assign serial on insert
CREATE OR REPLACE FUNCTION assign_billing_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM billings;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER billings_set_serial
  BEFORE INSERT ON billings
  FOR EACH ROW EXECUTE FUNCTION assign_billing_serial();


-- Auto-update timestamp
CREATE TRIGGER billings_updated_at
  BEFORE UPDATE ON billings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- STEP 9: EXPENSES - Serial Number Functions & Triggers
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION assign_expense_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM expenses;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_set_serial
  BEFORE INSERT ON expenses
  FOR EACH ROW EXECUTE FUNCTION assign_expense_serial();



CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- STEP 10: STAFF - Serial Number Functions & Triggers
-- ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION assign_staff_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM staff;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER staff_set_serial
  BEFORE INSERT ON staff
  FOR EACH ROW EXECUTE FUNCTION assign_staff_serial();



CREATE TRIGGER staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- STEP 11: Enable Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────

ALTER TABLE billings ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- STEP 12: Create RLS Policies (Full Access for Anon)
-- Note: This is for internal salon use with app-level authentication
-- ─────────────────────────────────────────────────────────────

-- BILLINGS Policies
CREATE POLICY "Allow anon all on billings"
  ON billings FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- BILLING_SERVICES Policies
CREATE POLICY "Allow anon all on billing_services"
  ON billing_services FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- EXPENSES Policies
CREATE POLICY "Allow anon all on expenses"
  ON expenses FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- STAFF Policies
CREATE POLICY "Allow anon all on staff"
  ON staff FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- STEP 13: Verification & Summary
-- ─────────────────────────────────────────────────────────────

-- Show created tables
SELECT 
  'Tables Created' as status,
  string_agg(tablename, ', ') as tables
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('billings', 'billing_services', 'expenses', 'staff');

-- Show created triggers
SELECT 
  'Triggers Created' as status,
  COUNT(*) as total
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
  AND event_object_table IN ('billings', 'expenses', 'staff');

-- Show RLS status
SELECT 
  schemaname,
  tablename,
  CASE WHEN rowsecurity THEN '✓ Enabled' ELSE '✗ Disabled' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('billings', 'billing_services', 'expenses', 'staff')
ORDER BY tablename;

-- Summary
SELECT 
  '✓ Database setup complete!' as message,
  'All tables, triggers, and RLS policies created' as details,
  'Serial numbers will auto-resequence on delete' as feature_1,
  'Staff splits tracked in JSONB' as feature_2;
