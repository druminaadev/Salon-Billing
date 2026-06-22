-- ============================================================
-- CSV Import Verification Queries
-- Run these after importing to verify data integrity
-- ============================================================

-- ─────────────────────────────────────────
-- 1. COUNT VERIFICATION
-- ─────────────────────────────────────────

-- Check total records
SELECT 
  'Billings' as table_name,
  COUNT(*) as total_records,
  MIN(serial_number) as min_serial,
  MAX(serial_number) as max_serial
FROM billings
UNION ALL
SELECT 
  'Expenses',
  COUNT(*),
  MIN(serial_number),
  MAX(serial_number)
FROM expenses;

-- Expected output:
-- Billings: 120 records, serial 1-120
-- Expenses: 63 records, serial 1-63

-- ─────────────────────────────────────────
-- 2. DATE RANGE CHECK
-- ─────────────────────────────────────────

-- Check billing date range
SELECT 
  MIN(created_at::date) as first_billing,
  MAX(created_at::date) as last_billing,
  COUNT(DISTINCT created_at::date) as unique_days
FROM billings;

-- Check expense date range
SELECT 
  MIN(date) as first_expense,
  MAX(date) as last_expense,
  COUNT(DISTINCT date) as unique_days
FROM expenses;

-- ─────────────────────────────────────────
-- 3. STAFF SPLIT VERIFICATION
-- ─────────────────────────────────────────

-- Count services with staff splits
SELECT 
  COUNT(*) as total_services,
  COUNT(CASE WHEN staff_assignments IS NOT NULL THEN 1 END) as services_with_splits,
  COUNT(CASE WHEN staff_assignments IS NULL THEN 1 END) as services_single_staff
FROM billing_services;

-- Show sample staff splits
SELECT 
  b.customer_name,
  bs.name as service_name,
  bs.price as service_price,
  bs.service_by,
  bs.staff_assignments
FROM billings b
JOIN billing_services bs ON b.id = bs.billing_id
WHERE bs.staff_assignments IS NOT NULL
LIMIT 10;

-- ─────────────────────────────────────────
-- 4. PAYMENT METHOD BREAKDOWN
-- ─────────────────────────────────────────

-- Billings by payment method
SELECT 
  payment_method,
  COUNT(*) as count,
  SUM(grand_total) as total_amount
FROM billings
GROUP BY payment_method
ORDER BY count DESC;

-- Expenses by payment method
SELECT 
  payment_method,
  COUNT(*) as count,
  SUM(amount) as total_amount
FROM expenses
GROUP BY payment_method
ORDER BY count DESC;

-- ─────────────────────────────────────────
-- 5. EXPENSE CATEGORIES
-- ─────────────────────────────────────────

SELECT 
  category,
  COUNT(*) as expense_count,
  SUM(amount) as total_amount,
  ROUND(AVG(amount), 2) as avg_amount
FROM expenses
GROUP BY category
ORDER BY total_amount DESC;

-- ─────────────────────────────────────────
-- 6. TOP CUSTOMERS
-- ─────────────────────────────────────────

SELECT 
  customer_name,
  mobile_number,
  COUNT(*) as visit_count,
  SUM(grand_total) as total_spent
FROM billings
GROUP BY customer_name, mobile_number
HAVING COUNT(*) > 1
ORDER BY total_spent DESC
LIMIT 10;

-- ─────────────────────────────────────────
-- 7. STAFF PERFORMANCE (from splits)
-- ─────────────────────────────────────────

-- Extract staff names and amounts from JSONB
WITH staff_earnings AS (
  SELECT 
    jsonb_array_elements(staff_assignments)->>'staffName' as staff_name,
    (jsonb_array_elements(staff_assignments)->>'amount')::numeric as amount
  FROM billing_services
  WHERE staff_assignments IS NOT NULL
  
  UNION ALL
  
  -- Add single staff services (no splits)
  SELECT 
    service_by as staff_name,
    price * quantity as amount
  FROM billing_services
  WHERE staff_assignments IS NULL
    AND service_by IS NOT NULL
)
SELECT 
  staff_name,
  COUNT(*) as services_count,
  SUM(amount) as total_earnings
FROM staff_earnings
GROUP BY staff_name
ORDER BY total_earnings DESC;

-- ─────────────────────────────────────────
-- 8. DAILY REVENUE & EXPENSES
-- ─────────────────────────────────────────

SELECT 
  b.date as day,
  COALESCE(SUM(b.revenue), 0) as daily_revenue,
  COALESCE(SUM(e.expense), 0) as daily_expense,
  COALESCE(SUM(b.revenue), 0) - COALESCE(SUM(e.expense), 0) as daily_profit
FROM (
  SELECT created_at::date as date, SUM(grand_total) as revenue
  FROM billings
  GROUP BY created_at::date
) b
FULL OUTER JOIN (
  SELECT date, SUM(amount) as expense
  FROM expenses
  GROUP BY date
) e ON b.date = e.date
ORDER BY day;

-- ─────────────────────────────────────────
-- 9. SERIAL NUMBER GAPS CHECK
-- ─────────────────────────────────────────

-- Check for gaps in billing serial numbers
SELECT 
  'Billings' as table_name,
  COUNT(*) as total_records,
  MAX(serial_number) as max_serial,
  CASE 
    WHEN COUNT(*) = MAX(serial_number) THEN '✓ No gaps'
    ELSE '✗ Has gaps'
  END as status
FROM billings
UNION ALL
SELECT 
  'Expenses',
  COUNT(*),
  MAX(serial_number),
  CASE 
    WHEN COUNT(*) = MAX(serial_number) THEN '✓ No gaps'
    ELSE '✗ Has gaps'
  END
FROM expenses;

-- ─────────────────────────────────────────
-- 10. DATA QUALITY CHECKS
-- ─────────────────────────────────────────

-- Check for invalid phone numbers
SELECT 
  customer_name,
  mobile_number
FROM billings
WHERE LENGTH(mobile_number) != 10
   OR mobile_number !~ '^[0-9]+$'
LIMIT 10;

-- Check for zero amounts
SELECT 'Billings with ₹0' as issue, COUNT(*) as count
FROM billings WHERE grand_total = 0
UNION ALL
SELECT 'Expenses with ₹0', COUNT(*) 
FROM expenses WHERE amount = 0;

-- Check for future dates (data is from 2026)
SELECT 
  customer_name,
  created_at::date
FROM billings
WHERE created_at::date > CURRENT_DATE
LIMIT 5;

-- ─────────────────────────────────────────
-- SUCCESS MESSAGE
-- ─────────────────────────────────────────

SELECT 
  '✅ Import Verification Complete!' as status,
  'Check all queries above for data quality' as next_step;
