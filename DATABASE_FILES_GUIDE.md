# Database Files - Quick Reference

## 🎯 Which File Should I Use?

### Starting Fresh? → `MASTER_SCHEMA.sql`
✓ New Supabase project  
✓ No existing data  
✓ Complete setup in one file  
✓ Includes all features  

### Already Have Data? → Choose One:

#### `migration_complete.sql`
Use if you want BOTH:
- Staff split feature
- Serial number gap fix

#### `migration_fix_serial_gaps.sql`
Use if you ONLY want:
- Serial number gap fix
- Keep everything else as-is

## 📁 File List

```
supabase/
├── MASTER_SCHEMA.sql              ⭐ USE THIS FOR NEW DATABASES
├── schema.sql                     ❌ Deprecated (use MASTER instead)
├── migration_complete.sql         ✓ Upgrade existing databases
├── migration_fix_serial_gaps.sql  ✓ Serial fix only
└── rollback_serial_fix.sql        ✓ Remove serial fix if needed
```

## 🔍 Quick Decision Tree

```
Do you have existing data?
│
├─ NO  → Run MASTER_SCHEMA.sql
│        You're done! ✓
│
└─ YES → Do you need staff splits?
         │
         ├─ YES → Run migration_complete.sql
         │        (Adds splits + fixes serials)
         │
         └─ NO  → Run migration_fix_serial_gaps.sql
                  (Only fixes serial gaps)
```

## 📋 What Each File Contains

| File | Tables | Staff Splits | Serial Fix | RLS | Use Case |
|------|--------|--------------|------------|-----|----------|
| **MASTER_SCHEMA.sql** | ✓ | ✓ | ✓ | ✓ | Fresh database |
| **migration_complete.sql** | - | ✓ | ✓ | - | Add features |
| **migration_fix_serial_gaps.sql** | - | - | ✓ | - | Fix gaps only |
| **schema.sql** | ✓ | ✓ | ✓ | ✓ | Same as MASTER (backup) |

## ⚡ Common Commands

### Check if tables exist
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### Check serial number gaps
```sql
SELECT COUNT(*) as records, MAX(serial_number) as max 
FROM billings;
-- If records = max, no gaps!
```

### Check staff_assignments column
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'billing_services';
```

## 🚨 Troubleshooting

### "Table already exists"
→ You have data. Use migration files, not MASTER_SCHEMA.sql

### "Trigger already exists"
→ Follow steps in MIGRATION_GUIDE.md

### "Want to start over?"
→ MASTER_SCHEMA.sql drops everything first, then recreates

## 📖 Detailed Guides

- **DATABASE_SETUP.md** - Complete setup instructions
- **MIGRATION_GUIDE.md** - Fix migration errors
- **FEATURES_README.md** - What features are included

## 💡 Pro Tips

1. **Always backup** before running migrations
2. **Test queries** in SQL editor first
3. **Verify** after each migration with test queries
4. **Use MASTER_SCHEMA.sql** for development/testing databases
5. **Use migrations** for production databases with data
