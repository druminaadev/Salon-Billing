-- ============================================================
-- SALON BILLING — DATABASE RESET SCRIPT
-- ⚠️  Run this FIRST to wipe everything, then run schema.sql
-- Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- 1. Drop triggers (must drop before tables)
DROP TRIGGER IF EXISTS billings_updated_at ON billings;
DROP TRIGGER IF EXISTS expenses_updated_at  ON expenses;

-- 2. Drop tables (CASCADE removes foreign keys & indexes automatically)
DROP TABLE IF EXISTS billing_services CASCADE;
DROP TABLE IF EXISTS billings         CASCADE;
DROP TABLE IF EXISTS expenses         CASCADE;

-- 3. Drop the helper function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 4. Drop custom ENUM types
DROP TYPE IF EXISTS payment_method     CASCADE;
DROP TYPE IF EXISTS expense_priority   CASCADE;
DROP TYPE IF EXISTS expense_recurrence CASCADE;
DROP TYPE IF EXISTS customer_gender    CASCADE;

-- ✅ Done — now run schema.sql to recreate everything fresh
