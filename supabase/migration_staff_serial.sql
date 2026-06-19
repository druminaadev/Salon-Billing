-- 1. Add serial_number to staff table
ALTER TABLE staff ADD COLUMN IF NOT EXISTS serial_number BIGINT;

-- 2. Create the gap-filling trigger function
CREATE OR REPLACE FUNCTION assign_staff_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.serial_number IS NULL THEN
    SELECT COALESCE(MAX(serial_number), 0) + 1 INTO NEW.serial_number FROM staff;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach the trigger to the staff table
DROP TRIGGER IF EXISTS staff_set_serial ON staff;
CREATE TRIGGER staff_set_serial
  BEFORE INSERT ON staff
  FOR EACH ROW EXECUTE FUNCTION assign_staff_serial();

-- 4. Backfill existing staff with serial numbers sequentially
WITH numbered_staff AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_serial
  FROM staff
)
UPDATE staff
SET serial_number = numbered_staff.new_serial
FROM numbered_staff
WHERE staff.id = numbered_staff.id AND staff.serial_number IS NULL;
