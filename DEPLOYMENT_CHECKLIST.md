# Deployment Checklist - Staff Split Feature

## ✅ Pre-Deployment
- [x] Code cleanup completed
- [x] Build successful (no errors/warnings)
- [x] TypeScript compilation passed
- [x] Unused imports removed
- [x] Debug code removed
- [x] Documentation consolidated

## 📋 Database Migration Steps

### For NEW Databases
```bash
# Use the complete schema
Run: supabase/schema.sql in Supabase SQL Editor
```

### For EXISTING Databases
```bash
# Apply the migration
Run: supabase/migration_complete.sql in Supabase SQL Editor

# This will:
✓ Add staff_assignments JSONB column
✓ Create GIN index for performance
✓ Update service_by length to 200 chars
```

## 🔍 Post-Migration Verification

Run this query to verify:
```sql
SELECT 
  column_name, 
  data_type, 
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'billing_services' 
  AND column_name IN ('service_by', 'staff_assignments');
```

Expected result:
```
service_by         | text | 200
staff_assignments  | jsonb| null
```

## 🚀 Deployment Steps

1. **Backup Database**
   ```bash
   # Download backup from Supabase Dashboard
   Project Settings → Database → Backups
   ```

2. **Run Migration**
   ```bash
   # Copy content from migration_complete.sql
   # Paste in Supabase SQL Editor
   # Click "Run"
   ```

3. **Deploy Frontend**
   ```bash
   npm run build
   # Upload dist/ folder to your hosting
   ```

4. **Test Core Features**
   - [ ] Create billing with single staff
   - [ ] Create billing with 2 staff (auto-split)
   - [ ] Create billing with 3+ staff (manual split)
   - [ ] View invoice with staff splits
   - [ ] Check staff income calculation
   - [ ] Verify old billings still work

## 🎯 Feature Highlights

### Auto-Split (2 Staff)
- Set Ravi: ₹550 → Priya auto-adjusts to ₹250

### Manual Split (3+ Staff)
- Set each amount individually
- Validation ensures total = service price

### Income Tracking
- Each staff sees only their split amount
- Old data works without migration

## 📚 Documentation
- Read: `STAFF_SPLIT_README.md`
- Summary: `CLEANUP_SUMMARY.md`

## ⚡ Performance
- GIN index on JSONB (fast queries)
- Auto-sync service_by (no redundancy)
- Optimized bundle size
- Code-split for heavy libraries

## 🔄 Rollback Plan
If issues occur:
```sql
-- Remove the new column (data in service_by remains)
ALTER TABLE billing_services DROP COLUMN staff_assignments;
DROP INDEX idx_billing_services_staff_assignments;

-- Redeploy previous frontend version
```

## ✅ Success Criteria
- [ ] Migration runs without errors
- [ ] Build deploys successfully
- [ ] Staff splits display correctly
- [ ] Income calculations accurate
- [ ] No console errors in browser
- [ ] Old invoices display properly

## 📞 Support
Check logs in:
- Browser Console (F12)
- Supabase Dashboard → Logs
- Network tab for API errors
