# Staff Split Feature + Serial Number Fix

## Quick Overview
1. **Staff Splits:** Track exact rupee amounts when multiple staff work on same service
2. **Serial Numbers:** Auto-resequence after deletion (no gaps!)

## Database Structure

### billing_services table
```sql
service_by          TEXT      -- Staff names (auto-populated, for display)
staff_assignments   JSONB     -- Split amounts (source of truth)
```

**Example:**
```json
{
  "service_by": "Ravi, Priya",
  "staff_assignments": [
    {"staffName": "Ravi", "amount": 500},
    {"staffName": "Priya", "amount": 300}
  ]
}
```

## Serial Number Fix

### Problem Solved
**Before:** Delete invoice #5 → Sequence becomes 1, 2, 3, 4, 6, 7, 8 (gap at 5)
**After:** Delete invoice #5 → Auto-resequences to 1, 2, 3, 4, 5, 6, 7 (continuous!)

**How it works:**
- Delete trigger automatically renumbers all records
- Maintains chronological order (by created_at/date)
- Applies to: Billings, Expenses, Staff

## Migration

**For new databases:** Use `supabase/schema.sql`

**For existing databases:** Run `supabase/migration_complete.sql` in Supabase SQL Editor

This will:
- ✓ Add staff_assignments column
- ✓ Create GIN index
- ✓ Fix service_by length (200 chars)
- ✓ Add resequencing triggers
- ✓ Fix existing gaps in serial numbers

## Staff Split Usage

### 1. Creating Splits (BillingForm)
- Select 2+ staff for a service
- Split amounts auto-calculated evenly
- Adjust manually as needed
- **Smart:** For 2 staff, changing one auto-adjusts the other

### 2. Validation
- All amounts must be positive
- Total must equal (price × quantity)
- Alert shown if invalid

### 3. Income Calculation
```typescript
// Checks staff_assignments first, falls back to service_by
if (service.staffAssignments) {
  const mine = service.staffAssignments.find(a => a.staffName === myName);
  revenue += mine.amount;
} else if (service.serviceBy === myName) {
  revenue += service.price * service.quantity;
}
```

## Backward Compatibility
✓ Old billings (only service_by) work perfectly
✓ New billings use both fields
✓ Mixed data handled automatically
✓ No data migration needed

## UI Changes
- **BillingForm:** Split amount inputs with auto-calculation
- **BillingView:** Shows "Ravi (₹500) / Priya (₹300)"
- **Billings:** Staff column shows all names
- **StaffView:** Correct income from splits

## Performance
- GIN index on JSONB for fast queries
- service_by kept for simple text queries
- Auto-sync eliminates duplicate data entry
- Resequencing happens automatically after delete

## Testing

After migration, test:
1. Create new billing → Check serial number
2. Delete a billing → Verify numbers resequence
3. Create billing with 2 staff → Check split calculation
4. View staff income → Verify correct amounts
