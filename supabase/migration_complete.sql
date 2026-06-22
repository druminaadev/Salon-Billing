-- ============================================================
-- Complete Migration: Staff Split Feature + Serial Number Fix
-- Apply this ONCE to existing databases
-- ============================================================

-- ─────────────────────────────────────────
-- Part 1: Staff Split Feature
-- ─────────────────────────────────────────

-- Add staff_assignments column for split tracking
ALTER TABLE billing_services 
ADD COLUMN IF NOT EXISTS staff_assignments JSONB;

-- Add GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_billing_services_staff_assignments 
ON billing_services USING GIN (staff_assignments);

-- Update service_by length to accommodate multiple staff names
ALTER TABLE billing_services 
ALTER COLUMN service_by TYPE TEXT;

-- Remove old length constraint if exists
ALTER TABLE billing_services 
DROP CONSTRAINT IF EXISTS billing_services_service_by_check;

-- Add new constraint with increased length
ALTER TABLE billing_services 
ADD CONSTRAINT billing_services_service_by_check 
CHECK (char_length(service_by) <= 200);

-- ─────────────────────────────────────────
-- Part 2: Fix Serial Number Gaps
-- ─────────────────────────────────────────

-- Drop existing triggers
DROP TRIGGER IF EXISTS billings_set_serial ON billings;
DROP TRIGGER IF EXISTS billings_resequence_after_delete ON billings;
DROP TRIGGER IF EXISTS expenses_set_serial ON expenses;
DROP TRIGGER IF EXISTS expenses_resequence_after_delete ON expenses;
DROP TRIGGER IF EXISTS staff_set_serial ON staff;
DROP TRIGGER IF EXISTS staff_resequence_after_delete ON staff;

-- BILLINGS: Resequence function
CREATE OR REPLACE FUNCTION resequence_billing_serials()
RETURNS TRIGGER AS $$
BEGIN
  WITH numbered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) as new_serial
    FROM billings
  )
  UPDATE billings
  SET serial_number = numbered.new_serial
  FROM numbered
  WHERE billings.id = numbered.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER billings_resequence_after_delete
  AFTER DELETE ON billings
  FOR EACH STATEMENT
  EXECUTE FUNCTION resequence_billing_serials();

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

-- EXPENSES: Resequence function
CREATE OR REPLACE FUNCTION resequence_expense_serials()
RETURNS TRIGGER AS $$
BEGIN
  WITH numbered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY date, created_at, id) as new_serial
    FROM expenses
  )
  UPDATE expenses
  SET serial_number = numbered.new_serial
  FROM numbered
  WHERE expenses.id = numbered.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_resequence_after_delete
  AFTER DELETE ON expenses
  FOR EACH STATEMENT
  EXECUTE FUNCTION resequence_expense_serials();

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

-- STAFF: Resequence function
CREATE OR REPLACE FUNCTION resequence_staff_serials()
RETURNS TRIGGER AS $$
BEGIN
  WITH numbered AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY join_date, created_at, id) as new_serial
    FROM staff
  )
  UPDATE staff
  SET serial_number = numbered.new_serial
  FROM numbered
  WHERE staff.id = numbered.id;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER staff_resequence_after_delete
  AFTER DELETE ON staff
  FOR EACH STATEMENT
  EXECUTE FUNCTION resequence_staff_serials();

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

-- ─────────────────────────────────────────
-- Part 3: Fix Existing Gaps (Run Once)
-- ─────────────────────────────────────────

-- Resequence existing billings
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) as new_serial
  FROM billings
)
UPDATE billings
SET serial_number = numbered.new_serial
FROM numbered
WHERE billings.id = numbered.id;

-- Resequence existing expenses
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY date, created_at, id) as new_serial
  FROM expenses
)
UPDATE expenses
SET serial_number = numbered.new_serial
FROM numbered
WHERE expenses.id = numbered.id;

-- Resequence existing staff
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY join_date, created_at, id) as new_serial
  FROM staff
)
UPDATE staff
SET serial_number = numbered.new_serial
FROM numbered
WHERE staff.id = numbered.id;

-- ─────────────────────────────────────────
-- Verification
-- ─────────────────────────────────────────

SELECT 
  'Migration Complete' as status,
  'Billings: ' || COUNT(*) as billing_count,
  'Max Serial: ' || COALESCE(MAX(serial_number), 0) as billing_max
FROM billings
UNION ALL
SELECT 
  'Staff Assignments Added',
  'service_by max length: 200',
  'JSONB indexed'
FROM (SELECT 1) t;
