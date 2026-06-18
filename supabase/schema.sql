-- ============================================================
-- Salon Billing — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────
-- 1. ENUMS
-- ─────────────────────────────────────────

CREATE TYPE payment_method AS ENUM (
  'Cash', 'UPI', 'Card', 'Bank Transfer', 'Online Payment'
);

CREATE TYPE expense_priority AS ENUM ('Low', 'Medium', 'High');

CREATE TYPE expense_recurrence AS ENUM (
  'One Time', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'
);

CREATE TYPE customer_gender AS ENUM ('Male', 'Female');


-- ─────────────────────────────────────────
-- 2. BILLINGS TABLE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS billings (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number   BIGINT        GENERATED ALWAYS AS IDENTITY,  -- Auto: 1, 2, 3…
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

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER billings_updated_at
  BEFORE UPDATE ON billings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for fast date-based queries
CREATE INDEX IF NOT EXISTS idx_billings_created_at ON billings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_billings_serial ON billings (serial_number);


-- ─────────────────────────────────────────
-- 3. BILLING SERVICES TABLE (line items)
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS billing_services (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  billing_id  UUID          NOT NULL REFERENCES billings(id) ON DELETE CASCADE,
  name        TEXT          NOT NULL CHECK (char_length(name) <= 100),
  price       NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  quantity    INTEGER       NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 1000),
  service_by  TEXT          CHECK (char_length(service_by) <= 100),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_services_billing_id ON billing_services (billing_id);


-- ─────────────────────────────────────────
-- 4. EXPENSES TABLE
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS expenses (
  id              UUID                 PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number   BIGINT        GENERATED ALWAYS AS IDENTITY,  -- Auto: 1, 2, 3…
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

CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_expenses_date       ON expenses (date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_serial     ON expenses (serial_number);


-- ─────────────────────────────────────────
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

ALTER TABLE billings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses         ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────
-- 6. RLS POLICIES
--
-- Strategy: This is a single-salon internal tool.
-- The app is protected by its own login screen.
-- The Supabase anon key is not publicly exposed,
-- so we grant full CRUD to the anon role safely.
-- ─────────────────────────────────────────

-- --- billings ---

CREATE POLICY "Allow anon select on billings"
  ON billings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on billings"
  ON billings FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on billings"
  ON billings FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete on billings"
  ON billings FOR DELETE
  TO anon
  USING (true);

-- --- billing_services ---

CREATE POLICY "Allow anon select on billing_services"
  ON billing_services FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on billing_services"
  ON billing_services FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on billing_services"
  ON billing_services FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete on billing_services"
  ON billing_services FOR DELETE
  TO anon
  USING (true);

-- --- expenses ---

CREATE POLICY "Allow anon select on expenses"
  ON expenses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on expenses"
  ON expenses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on expenses"
  ON expenses FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete on expenses"
  ON expenses FOR DELETE
  TO anon
  USING (true);


-- ─────────────────────────────────────────
-- 7. VERIFICATION QUERIES (optional)
-- Run these to confirm everything is set up.
-- ─────────────────────────────────────────

-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- ─────────────────────────────────────────
-- 8. STAFF TABLE
-- ─────────────────────────────────────────

CREATE TYPE staff_role AS ENUM (
  'Stylist', 'Barber', 'Therapist', 'Manager', 'Other'
);

CREATE TYPE staff_status AS ENUM (
  'Active', 'Inactive'
);

CREATE TABLE IF NOT EXISTS staff (
  id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT            NOT NULL CHECK (char_length(name) <= 100),
  role            staff_role      NOT NULL DEFAULT 'Stylist',
  mobile_number   TEXT            NOT NULL CHECK (char_length(mobile_number) <= 10 AND mobile_number ~ '^[0-9]*$'),
  status          staff_status    NOT NULL DEFAULT 'Active',
  join_date       DATE            NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ     NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE TRIGGER staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon select on staff"
  ON staff FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert on staff"
  ON staff FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on staff"
  ON staff FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete on staff"
  ON staff FOR DELETE
  TO anon
  USING (true);

