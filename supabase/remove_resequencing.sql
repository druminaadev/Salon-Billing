-- ============================================================
-- Disable Serial Number Resequencing
-- Run this script to remove the auto-resequencing feature from
-- your live database to ensure financial auditability.
-- ============================================================

-- Drop resequence triggers
DROP TRIGGER IF EXISTS billings_resequence_after_delete ON billings;
DROP TRIGGER IF EXISTS expenses_resequence_after_delete ON expenses;
DROP TRIGGER IF EXISTS staff_resequence_after_delete ON staff;

-- Drop resequence functions
DROP FUNCTION IF EXISTS resequence_billing_serials();
DROP FUNCTION IF EXISTS resequence_expense_serials();
DROP FUNCTION IF EXISTS resequence_staff_serials();

SELECT 'Auto-resequencing successfully disabled. Serial gaps from deletions will now remain.' as status;
