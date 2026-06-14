## 🛡️ Security Quick Reference

### Default Credentials
```
Email: admin@salon.com
Password: admin123
```

### Key Security Files
```
src/utils/security.ts          - Core security utilities
src/components/ProtectedRoute.tsx - Route protection wrapper
src/components/Login.tsx       - Secure authentication
SECURITY.md                    - Full documentation
```

### Session Info
- **Duration**: 8 hours
- **Inactivity**: 30 minutes auto-logout
- **Storage**: SessionStorage (clears on browser close)

### Protection Summary
✅ SQL Injection - Hardcoded auth, no DB queries
✅ XSS - Input sanitization + HTML escaping  
✅ CSRF - Token validation
✅ Brute Force - 5 attempts → 15min lockout
✅ Session Hijacking - Secure tokens + expiry
✅ Timing Attacks - Constant-time comparison

### How It Works
1. User logs in → Session created with random token
2. Every page wrapped in ProtectedRoute
3. Session validated every 5 minutes
4. Activity tracked (mouse/keyboard/scroll)
5. 30min idle → auto-logout
6. All inputs sanitized before processing
7. All actions logged to security audit trail

### Input Limits
- Strings: 500 chars max
- Email: 100 chars max  
- Phone: 20 chars max
- Amount: ₹0 - ₹1 crore

### Test Security
Try these to verify protection works:
- SQL: `' OR 1=1 --` in login
- XSS: `<script>alert('xss')</script>` in inputs
- Brute Force: 6+ wrong login attempts
- Session: Wait 30min idle → should auto-logout
