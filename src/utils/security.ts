// Security utility functions for the application

// Session Management
const SESSION_KEY = 'salon_auth_session';
const SESSION_EXPIRY_KEY = 'salon_auth_expiry';
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours

export const createSession = (): void => {
  const sessionToken = generateSecureToken();
  const expiryTime = Date.now() + SESSION_DURATION;
  
  try {
    sessionStorage.setItem(SESSION_KEY, sessionToken);
    sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
  } catch (e) {
    console.error('Session creation failed');
  }
};

export const isSessionValid = (): boolean => {
  try {
    const token = sessionStorage.getItem(SESSION_KEY);
    const expiry = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    
    if (!token || !expiry) return false;
    
    const expiryTime = parseInt(expiry, 10);
    if (isNaN(expiryTime) || Date.now() > expiryTime) {
      destroySession();
      return false;
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

export const destroySession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
    sessionStorage.clear();
  } catch (e) {
    console.error('Session destruction failed');
  }
};

export const refreshSession = (): void => {
  if (isSessionValid()) {
    const expiryTime = Date.now() + SESSION_DURATION;
    try {
      sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
    } catch (e) {
      console.error('Session refresh failed');
    }
  }
};

// CSRF Token Management
let csrfToken: string | null = null;

export const generateCSRFToken = (): string => {
  csrfToken = generateSecureToken();
  return csrfToken;
};

export const validateCSRFToken = (token: string): boolean => {
  return csrfToken !== null && token === csrfToken;
};

// Secure Token Generation
const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Input Sanitization
export const sanitizeString = (input: string, maxLength: number = 500): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>'"]/g, '') // Remove XSS characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const sanitizeNumber = (input: any, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number => {
  const num = parseFloat(input);
  if (isNaN(num)) return 0;
  return Math.max(min, Math.min(max, num));
};

export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') return '';
  
  const sanitized = email
    .trim()
    .toLowerCase()
    .slice(0, 100)
    .replace(/[<>'"]/g, '');
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizePhone = (phone: string): string => {
  if (typeof phone !== 'string') return '';
  // Strip everything except digits, limit to 10 chars
  return phone.trim().replace(/\D/g, '').slice(0, 10);
};

// XSS Prevention
export const escapeHTML = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, char => map[char]);
};

// Validation Functions
export const isValidSerialNumber = (serial: string): boolean => {
  // Billing:  B240614-482  (B + YYMMDD + dash + 3 digits)
  // Expense:  EXP-240614-482
  return /^B\d{6}-\d{3}$/.test(serial) || /^EXP-\d{6}-\d{3}$/.test(serial);
};

export const isValidAmount = (amount: number): boolean => {
  return typeof amount === 'number' && 
         !isNaN(amount) && 
         isFinite(amount) && 
         amount >= 0 && 
         amount <= 10000000; // Max 1 crore
};

export const isValidDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isValidPaymentMethod = (method: string): boolean => {
  const validMethods = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online Payment'];
  return validMethods.includes(method);
};

// Data Encryption (simple obfuscation for client-side storage)
export const encodeData = (data: any): string => {
  try {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  } catch (e) {
    console.error('Encoding failed');
    return '';
  }
};

export const decodeData = (encoded: string): any => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (e) {
    console.error('Decoding failed');
    return null;
  }
};

// Content Security Policy Headers (for reference - to be implemented server-side)
export const getCSPHeaders = () => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
});

// Activity Monitoring
let lastActivityTime = Date.now();

export const updateActivity = (): void => {
  lastActivityTime = Date.now();
};

export const checkInactivity = (timeoutMinutes: number = 30): boolean => {
  const inactiveTime = Date.now() - lastActivityTime;
  return inactiveTime > timeoutMinutes * 60 * 1000;
};

// Audit Logging (client-side - for compliance)
export const logSecurityEvent = (event: string, details?: any): void => {
  const log = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
  };
  
  try {
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(log);
    // Keep only last 100 logs
    if (logs.length > 100) logs.shift();
    localStorage.setItem('security_logs', JSON.stringify(logs));
  } catch (e) {
    console.error('Logging failed');
  }
};
