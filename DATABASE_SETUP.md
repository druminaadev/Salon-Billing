# Master Database Setup Guide

## Quick Start - Fresh Database

If you're starting from scratch, use this ONE file:

### `MASTER_SCHEMA.sql`

**What it includes:**
- ✓ All tables (billings, expenses, staff, billing_services)
- ✓ Staff split feature (JSONB assignments)
- ✓ Auto-resequencing serial numbers (no gaps!)
- ✓ RLS policies for security
- ✓ All indexes for performance
- ✓ Complete triggers and functions

### How to Use

1. **Open Supabase Dashboard**
   - Go to your project
   - Click "SQL Editor"

2. **Run Master Schema**
   - Create "New Query"
   - Copy entire content from `supabase/MASTER_SCHEMA.sql`
   - Click "Run"

3. **Verify Success**
   - You'll see summary at the end
   - Tables created: billings, billing_services, expenses, staff
   - Triggers: 9 total
   - RLS: Enabled on all tables

## For Existing Databases

If you already have data, use migration files instead:

### Option 1: Complete Migration
**File:** `supabase/migration_complete.sql`
- Adds staff split feature
- Fixes serial number gaps
- Updates existing records

### Option 2: Serial Fix Only
**File:** `supabase/migration_fix_serial_gaps.sql`
- Only fixes serial number gaps
- Doesn't modify existing structure

## What Each File Does

| File | Purpose | When to Use |
|------|---------|-------------|
| `MASTER_SCHEMA.sql` | Complete database from scratch | New Supabase project |
| `schema.sql` | Original schema (deprecated) | Don't use, replaced by MASTER |
| `migration_complete.sql` | Add features to existing DB | Upgrading existing database |
| `migration_fix_serial_gaps.sql` | Fix serial gaps only | Already have staff splits |
| `rollback_serial_fix.sql` | Remove serial fix | Issues with auto-resequencing |

## Features Included in Master Schema

### 1. Staff Split Tracking
```sql
-- Example in billing_services table:
staff_assignments: [
  {"staffName": "Ravi", "amount": 500},
  {"staffName": "Priya", "amount": 300}
]
```

### 2. Auto-Resequencing Serial Numbers
- Delete invoice #5 → Others renumber automatically
- Sequence: 1, 2, 3, 4, 5, 6, 7 (always continuous)
- Applies to: Billings, Expenses, Staff

### 3. Row Level Security (RLS)
- Enabled on all tables
- Policies grant full access to `anon` role
- Suitable for internal salon app

### 4. Performance Indexes
- `created_at` indexes for fast date queries
- `serial_number` indexes
- GIN index on JSONB for staff_assignments

## Verification Queries

After running master schema:

```sql
-- Check all tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check serial number gaps
SELECT 'Billings' as table_name, 
  COUNT(*) as records, 
  MAX(serial_number) as max_serial,
  CASE WHEN COUNT(*) = MAX(serial_number) THEN '✓ No gaps' 
       ELSE '✗ Has gaps' END as status
FROM billings;

-- Check staff_assignments column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'billing_services' 
  AND column_name = 'staff_assignments';

-- Check triggers
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers 
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

## Test the Setup

```sql
-- 1. Create test staff
INSERT INTO staff (name, role, mobile_number, status, join_date)
VALUES ('Test Staff', 'Stylist', '9999999999', 'Active', CURRENT_DATE);

-- 2. Create test billing
INSERT INTO billings (customer_name, mobile_number, subtotal, grand_total, payment_method)
VALUES ('Test Customer', '1234567890', 500, 500, 'Cash');

-- 3. Check serial numbers
SELECT serial_number, customer_name FROM billings ORDER BY serial_number;

-- 4. Delete test billing
DELETE FROM billings WHERE customer_name = 'Test Customer';

-- 5. Verify resequencing happened
SELECT serial_number, customer_name FROM billings ORDER BY serial_number;
-- Should be 1, 2, 3... (continuous)

-- 6. Cleanup
DELETE FROM staff WHERE name = 'Test Staff';
```

## Troubleshooting

### Error: "relation already exists"
You already have tables. Use migration files instead:
- Run `migration_complete.sql` for existing databases
- Don't run `MASTER_SCHEMA.sql` on existing databases

### Error: "trigger already exists"
```sql
-- Drop all triggers first
DROP TRIGGER IF EXISTS billings_set_serial ON billings CASCADE;
DROP TRIGGER IF EXISTS billings_resequence_after_delete ON billings CASCADE;
-- (repeat for expenses and staff)

-- Then re-run MASTER_SCHEMA.sql
```

### Start Over Completely
The master schema includes cleanup at the top. Just re-run it:
- It drops all existing objects first
- Then recreates everything fresh

## Environment Variables

After database setup, configure your app:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Get these from:
- Supabase Dashboard → Project Settings → API

## Next Steps

1. ✓ Run MASTER_SCHEMA.sql
2. ✓ Verify with queries above
3. ✓ Configure .env file
4. ✓ Start your app: `npm run dev`
5. ✓ Test creating billings with staff splits

## Support

If you encounter issues:
1. Check verification queries above
2. Review `MIGRATION_GUIDE.md` for common errors
3. Use `rollback_serial_fix.sql` to disable auto-resequencing if needed
