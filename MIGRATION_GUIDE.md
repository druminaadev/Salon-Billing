# Migration Guide - Serial Number Fix

## If You See Error: "trigger already exists"

This means you ran the migration twice. Follow these steps:

### Option 1: Clean Install (Recommended)

```sql
-- Step 1: Drop all existing triggers
DROP TRIGGER IF EXISTS billings_set_serial ON billings;
DROP TRIGGER IF EXISTS billings_resequence_after_delete ON billings;
DROP TRIGGER IF EXISTS expenses_set_serial ON expenses;
DROP TRIGGER IF EXISTS expenses_resequence_after_delete ON expenses;
DROP TRIGGER IF EXISTS staff_set_serial ON staff;
DROP TRIGGER IF EXISTS staff_resequence_after_delete ON staff;

-- Step 2: Drop old functions
DROP FUNCTION IF EXISTS resequence_billing_serials();
DROP FUNCTION IF EXISTS resequence_expense_serials();
DROP FUNCTION IF EXISTS resequence_staff_serials();

-- Step 3: Now run the complete migration
-- Copy and paste content from: supabase/migration_complete.sql
```

### Option 2: Fresh Start (If Option 1 Fails)

```sql
-- 1. Check what exists
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_name LIKE '%serial%' OR trigger_name LIKE '%resequence%';

-- 2. Manually drop each one shown
DROP TRIGGER IF EXISTS [trigger_name] ON [table_name];

-- 3. Run migration again
```

## Success Verification

After running migration, verify:

```sql
-- Check triggers exist
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE event_object_table IN ('billings', 'expenses', 'staff')
ORDER BY event_object_table, trigger_name;

-- Should show:
-- billings_set_serial           | billings
-- billings_resequence_after_delete | billings
-- expenses_set_serial           | expenses
-- expenses_resequence_after_delete | expenses
-- staff_set_serial              | staff
-- staff_resequence_after_delete | staff

-- Check serial numbers are sequential
SELECT 'Billings' as table_name, 
  COUNT(*) as total_records, 
  MAX(serial_number) as max_serial,
  CASE WHEN COUNT(*) = MAX(serial_number) THEN '✓ No gaps' ELSE '✗ Has gaps' END as status
FROM billings
UNION ALL
SELECT 'Expenses', COUNT(*), MAX(serial_number),
  CASE WHEN COUNT(*) = MAX(serial_number) THEN '✓ No gaps' ELSE '✗ Has gaps' END
FROM expenses
UNION ALL
SELECT 'Staff', COUNT(*), MAX(serial_number),
  CASE WHEN COUNT(*) = MAX(serial_number) THEN '✓ No gaps' ELSE '✗ Has gaps' END
FROM staff;
```

## Test the Fix

```sql
-- 1. Get current count
SELECT COUNT(*) FROM billings;

-- 2. Create a test billing (note the serial number)
INSERT INTO billings (customer_name, mobile_number, subtotal, grand_total, payment_method)
VALUES ('Test Customer', '1234567890', 100, 100, 'Cash');

-- 3. Get the ID and serial
SELECT id, serial_number FROM billings ORDER BY created_at DESC LIMIT 1;

-- 4. Delete it
DELETE FROM billings WHERE customer_name = 'Test Customer';

-- 5. Check if numbers resequenced
SELECT serial_number FROM billings ORDER BY serial_number;
-- Should be continuous: 1, 2, 3, 4... (no gaps)
```

## Troubleshooting

### Error: "function already exists"
```sql
DROP FUNCTION IF EXISTS resequence_billing_serials() CASCADE;
DROP FUNCTION IF EXISTS resequence_expense_serials() CASCADE;
DROP FUNCTION IF EXISTS resequence_staff_serials() CASCADE;
```

### Error: "relation does not exist"
Check table names are correct:
```sql
\dt billings
\dt expenses
\dt staff
```

### Rollback
If you want to remove the feature:
```sql
-- Run: supabase/rollback_serial_fix.sql
```
