-- ============================================================
-- Rollback: Remove Serial Number Resequencing
-- Run this if you need to remove the auto-resequencing feature
-- ============================================================

-- Drop resequence triggers
DROP TRIGGER IF EXISTS billings_resequence_after_delete ON billings;
DROP TRIGGER IF EXISTS expenses_resequence_after_delete ON expenses;
DROP TRIGGER IF EXISTS staff_resequence_after_delete ON staff;

-- Drop resequence functions
DROP FUNCTION IF EXISTS resequence_billing_serials();
DROP FUNCTION IF EXISTS resequence_expense_serials();
DROP FUNCTION IF EXISTS resequence_staff_serials();

-- The insert triggers remain active
-- Serial numbers will still be assigned on new records
-- But gaps from deletions will no longer be fixed

SELECT 'Resequencing disabled. Gaps will remain after deletions.' as status;
