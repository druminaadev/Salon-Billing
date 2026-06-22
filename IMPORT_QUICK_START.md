# CSV Import - Quick Reference Card

## 📋 Files to Import

```
1. import_billings.sql  (79 KB, 120 records)
2. import_expenses.sql  (28 KB, 63 records)
```

## ⚡ 3-Step Import

### Step 1: Supabase SQL Editor
```
Dashboard → SQL Editor → New Query
```

### Step 2: Run Billings
```
Copy: import_billings.sql
Paste in SQL Editor
Click: Run
Wait: ~10 seconds
```

### Step 3: Run Expenses
```
Copy: import_expenses.sql
Paste in SQL Editor  
Click: Run
Wait: ~5 seconds
```

## ✅ Verify

```sql
SELECT COUNT(*) FROM billings;  -- Should be 120
SELECT COUNT(*) FROM expenses;  -- Should be 63
```

## 🔍 What Was Converted

### Billings (120)
- Dates: 2026-06-02 to 2026-06-18
- Customers: Afsana, Manas, Mandeep, etc.
- Services: Hair cut, Combo-1, Threading, etc.
- Staff: Sahil, Simren, Shivani, Afu, etc.
- Payments: Cash (60), UPI (60)

### Staff Splits Detected
```
"sahil\simren" → Even split
"sahil 350 shivani 100" → Custom amounts
Single staff → No split
```

### Expenses (63)
- Categories: 
  - Food & Beverages (15)
  - Salon Products (10)
  - Transportation (18)
  - Equipment (3)
  - Staff Payments (10)
  - Other (7)

## 🚨 Common Issues

### "duplicate key"
→ Serial numbers exist, delete old data first

### "column not found"
→ Run MASTER_SCHEMA.sql first

### "invalid uuid"
→ Script generates valid UUIDs automatically

## 📊 After Import

### Check in App
```bash
npm run dev
# Browse to billings and expenses
```

### Add Staff Members
```sql
INSERT INTO staff (name, role, mobile_number, status, join_date)
VALUES 
  ('Sahil', 'Barber', '0000000000', 'Active', '2026-06-01'),
  ('Simren', 'Stylist', '0000000000', 'Active', '2026-06-01');
```

## 📖 Full Docs

- **CSV_IMPORT_GUIDE.md** - Complete guide
- **verify_import.sql** - Verification queries
- **CSV_IMPORT_COMPLETE.md** - Summary

## 🔄 Re-generate SQL

```bash
node import_csv_data.cjs
# Creates fresh SQL with new UUIDs
```

## ✨ Success!

Your historical data is now database-ready!
Just run the two SQL files in Supabase. 🎉
