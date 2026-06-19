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

-- 6. Add serial_number to staff and create trigger
ALTER TABLE staff ADD COLUMN IF NOT EXISTS serial_number BIGINT;

CREATE OR REPLACE FUNCTION assign_staff_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM staff;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS staff_set_serial ON staff;
CREATE TRIGGER staff_set_serial
  BEFORE INSERT ON staff
  FOR EACH ROW EXECUTE FUNCTION assign_staff_serial();

-- Backfill existing staff with serial numbers sequentially
WITH numbered_staff AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_serial
  FROM staff
)
UPDATE staff
SET serial_number = numbered_staff.new_serial
FROM numbered_staff
WHERE staff.id = numbered_staff.id AND staff.serial_number IS NULL;
