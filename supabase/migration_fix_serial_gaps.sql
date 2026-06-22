-- ============================================================
-- Fix Serial Number Gaps After Deletion
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop existing triggers that only assign on insert
DROP TRIGGER IF EXISTS billings_set_serial ON billings;
DROP TRIGGER IF EXISTS billings_resequence_after_delete ON billings;
DROP TRIGGER IF EXISTS expenses_set_serial ON expenses;
DROP TRIGGER IF EXISTS expenses_resequence_after_delete ON expenses;
DROP TRIGGER IF EXISTS staff_set_serial ON staff;
DROP TRIGGER IF EXISTS staff_resequence_after_delete ON staff;

-- ─────────────────────────────────────────
-- BILLINGS: Resequence after delete
-- ─────────────────────────────────────────

-- Function to resequence billing serial numbers
CREATE OR REPLACE FUNCTION resequence_billing_serials()
RETURNS TRIGGER AS $$
BEGIN
  -- Reorder all serial numbers to be sequential starting from 1
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

-- Trigger after delete to resequence
CREATE TRIGGER billings_resequence_after_delete
  AFTER DELETE ON billings
  FOR EACH STATEMENT
  EXECUTE FUNCTION resequence_billing_serials();

-- Keep the insert trigger for new records
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

-- ─────────────────────────────────────────
-- EXPENSES: Resequence after delete
-- ─────────────────────────────────────────

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

-- ─────────────────────────────────────────
-- STAFF: Resequence after delete
-- ─────────────────────────────────────────

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
-- Fix existing gaps (optional - run once)
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

-- Verify the fix
SELECT 'Billings' as table_name, COUNT(*) as total, MAX(serial_number) as max_serial FROM billings
UNION ALL
SELECT 'Expenses', COUNT(*), MAX(serial_number) FROM expenses
UNION ALL
SELECT 'Staff', COUNT(*), MAX(serial_number) FROM staff;
