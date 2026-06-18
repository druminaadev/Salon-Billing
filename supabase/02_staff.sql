-- ============================================================
-- Salon Billing — Staff Table Migration
-- Run this file in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─────────────────────────────────────────
-- 1. ENUMS
-- ─────────────────────────────────────────

CREATE TYPE staff_role AS ENUM (
  'Stylist', 'Barber', 'Therapist', 'Manager', 'Other'
);

CREATE TYPE staff_status AS ENUM (
  'Active', 'Inactive'
);

-- ─────────────────────────────────────────
-- 2. STAFF TABLE
-- ─────────────────────────────────────────

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

-- Auto-update updated_at on row change
-- (Note: 'update_updated_at_column' function should already exist from the main schema.sql)
CREATE TRIGGER staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────
-- 4. RLS POLICIES
-- ─────────────────────────────────────────

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
