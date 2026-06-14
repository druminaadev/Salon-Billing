import React, { useEffect } from 'react';
import { isSessionValid, refreshSession, updateActivity, checkInactivity, logSecurityEvent } from '../utils/security';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onSessionExpired: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onSessionExpired }) => {
  useEffect(() => {
    // Check session validity on mount
    if (!isSessionValid()) {
      logSecurityEvent('SESSION_EXPIRED', { reason: 'Invalid or expired session' });
      onSessionExpired();
      return;
    }

    // Refresh session on mount
    refreshSession();
    updateActivity();

    // Set up activity listeners
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
      refreshSession();
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Check for inactivity every minute
    const inactivityInterval = setInterval(() => {
      if (checkInactivity(30)) { // 30 minutes timeout
        logSecurityEvent('SESSION_TIMEOUT', { reason: 'User inactive for 30 minutes' });
        onSessionExpired();
      }
    }, 60000); // Check every minute

    // Check session validity every 5 minutes
    const sessionCheckInterval = setInterval(() => {
      if (!isSessionValid()) {
        logSecurityEvent('SESSION_INVALID', { reason: 'Session check failed' });
        onSessionExpired();
      }
    }, 5 * 60000); // Check every 5 minutes

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(inactivityInterval);
      clearInterval(sessionCheckInterval);
    };
  }, [onSessionExpired]);

  // Block right-click context menu (prevent inspect element in production)
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (import.meta.env.MODE === 'production') {
        e.preventDefault();
      }
    };

    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (import.meta.env.MODE === 'production') {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
};
