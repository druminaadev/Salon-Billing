# CSV Data Import Guide

## What Was Done

Your CSV files have been converted to SQL INSERT statements that match your database structure!

### Files Converted:
1. **`excel data/billings.csv`** → **`import_billings.sql`**
   - 120 billing records with services
   - Staff assignments parsed correctly
   - Split amounts calculated automatically

2. **`excel data/expense.csv`** → **`import_expenses.sql`**
   - 63 expense records
   - Auto-categorized by keywords
   - Cash/Online payment methods

## Features of the Conversion

### ✅ Billings
- **Serial Numbers:** Auto-assigned (1, 2, 3...)
- **Dates:** Converted from D/M/YYYY to YYYY-MM-DD format
- **Phone Numbers:** Cleaned and validated (10 digits)
- **Payment Methods:** 
  - Cash only → 'Cash'
  - Online only → 'UPI'
  - Both → 'Cash' (default)
- **Staff Splits:** Automatically detected and converted!
  - `"Afu\shivani"` → Split evenly: Afu ₹500, Shivani ₹500
  - `"sahil 350 shivani 100"` → Custom split preserved
  - Single staff → No split (legacy format)

### ✅ Expenses
- **Auto-Categorization:**
  - Tea/Lunch/Coffee → "Food & Beverages"
  - Products/Color → "Salon Products"
  - Rapido/Petrol/Bike → "Transportation"
  - Mirror → "Equipment"
  - Adv/Recharge → "Staff Payments"
  - Others → "Other"
- **Payment Methods:** Cash or UPI
- **Dates:** Converted to proper format

## How to Import

### Step 1: Backup Your Database
```sql
-- Go to Supabase Dashboard → Database → Backups
-- Download latest backup (just in case!)
```

### Step 2: Import Billings
1. Open Supabase SQL Editor
2. Create "New Query"
3. Copy entire content from **`import_billings.sql`**
4. Click "Run"
5. Wait for completion (120 records)

### Step 3: Import Expenses
1. Create another "New Query"
2. Copy entire content from **`import_expenses.sql`**
3. Click "Run"
4. Wait for completion (63 records)

### Step 4: Verify Import
```sql
-- Check billings count
SELECT COUNT(*) as total_billings FROM billings;
-- Should show 120

-- Check expenses count
SELECT COUNT(*) as total_expenses FROM expenses;
-- Should show 63

-- Check serial numbers are sequential
SELECT serial_number FROM billings ORDER BY serial_number LIMIT 10;
-- Should be: 1, 2, 3, 4, 5...

-- Check staff splits
SELECT 
  customer_name,
  bs.name as service,
  bs.service_by,
  bs.staff_assignments
FROM billings b
JOIN billing_services bs ON b.id = bs.billing_id
WHERE bs.staff_assignments IS NOT NULL
LIMIT 5;
```

## Sample Data Examples

### Billing with Single Staff
```sql
Customer: Afsana
Service: Hair wash
Amount: ₹150
Staff: Simren (no split)
Payment: Cash
```

### Billing with Staff Split
```sql
Customer: Dr mehta
Service: Combo-2
Amount: ₹1000
Staff Split: 
  - Afu: ₹500
  - Shivani: ₹500
Payment: UPI
```

### Expense Example
```sql
Title: Tea for staff+Rapaid
Amount: ₹210
Category: Food & Beverages
Payment: UPI
Date: 2026-06-03
```

## Troubleshooting

### Error: "duplicate key value"
- You already have data with these serial numbers
- Option 1: Delete existing test data first
- Option 2: Modify serial numbers in SQL files

### Error: "invalid input syntax for type uuid"
- The script generates valid UUIDs
- If error persists, check Supabase version

### Error: "column does not exist"
- Make sure you ran `MASTER_SCHEMA.sql` first
- Or run `migration_complete.sql` on existing database

### Want to Re-Import?
```sql
-- Delete imported data (CAREFUL!)
DELETE FROM billings WHERE serial_number <= 120;
DELETE FROM expenses WHERE serial_number <= 63;

-- Then re-run import scripts
```

## Data Quality Notes

### ⚠️ Items Skipped
The script automatically skipped:
- Rows with "No Bill" entries
- Total/Summary rows
- Invalid dates or amounts
- Empty rows

### ✓ Data Cleaned
- Phone "0" → "0000000000"
- Names capitalized properly
- Dates standardized
- Amounts parsed correctly

### 📊 Staff Split Detection
Automatically handles these patterns:
1. **Backslash separator:** `"sahil\simren"` → Even split
2. **Explicit amounts:** `"sahil 350 shivani 100"` → Custom split
3. **Single staff:** `"sahil"` → No split needed

## What to Do After Import

1. **Verify in App:**
   - Run: `npm run dev`
   - Check billings list
   - View staff income calculations
   - Check expense categories

2. **Review Staff Names:**
   - Some staff names had variations (Sahil/sahil/SAHIL)
   - Script capitalized first letter
   - Check if you need to merge duplicates

3. **Update Staff Table:**
   ```sql
   -- Add staff members if not exists
   INSERT INTO staff (name, role, mobile_number, status, join_date)
   VALUES 
     ('Sahil', 'Barber', '0000000000', 'Active', '2026-06-01'),
     ('Simren', 'Stylist', '0000000000', 'Active', '2026-06-01'),
     ('Shivani', 'Stylist', '0000000000', 'Active', '2026-06-01'),
     ('Afu', 'Stylist', '0000000000', 'Active', '2026-06-01');
   ```

## Files Generated

```
✓ import_billings.sql    (120 records, ~400 lines)
✓ import_expenses.sql    (63 records, ~1000 lines)
✓ import_csv_data.cjs    (Script to re-generate if needed)
```

## Re-run the Script

If you need to regenerate SQL files:
```bash
node import_csv_data.cjs
```

This will:
- Re-read CSV files
- Generate fresh UUIDs
- Output new SQL files

## Success Checklist

- [ ] Backed up database
- [ ] Ran import_billings.sql
- [ ] Ran import_expenses.sql
- [ ] Verified record counts
- [ ] Checked staff splits display correctly
- [ ] Tested app functionality
- [ ] Added staff members to staff table

🎉 Your historical data is now in the database!
