-- ============================================================
-- MIGRATION: Update Serial Number Generation
-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- This avoids resetting your database and preserves existing data.
-- ============================================================

-- 1. Remove the IDENTITY property from the serial_number columns
ALTER TABLE billings ALTER COLUMN serial_number DROP IDENTITY IF EXISTS;
ALTER TABLE expenses ALTER COLUMN serial_number DROP IDENTITY IF EXISTS;

-- 2. Create trigger function for billings
CREATE OR REPLACE FUNCTION assign_billing_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM billings;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach trigger to billings
DROP TRIGGER IF EXISTS billings_set_serial ON billings;
CREATE TRIGGER billings_set_serial
  BEFORE INSERT ON billings
  FOR EACH ROW EXECUTE FUNCTION assign_billing_serial();

-- 4. Create trigger function for expenses
CREATE OR REPLACE FUNCTION assign_expense_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM expenses;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Attach trigger to expenses
DROP TRIGGER IF EXISTS expenses_set_serial ON expenses;
CREATE TRIGGER expenses_set_serial
  BEFORE INSERT ON expenses
  FOR EACH ROW EXECUTE FUNCTION assign_expense_serial();
