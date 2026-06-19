import React from 'react';
import type { ViewState, TimeframeFilter, ThemeColor } from '../types';
import { Menu, Moon, Sun, Bell, Search, CalendarDays } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  currentView: ViewState;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onOpenMobileSidebar: () => void;
  globalTimeframe: TimeframeFilter;
  setGlobalTimeframe: (timeframe: TimeframeFilter) => void;
  accentColor: ThemeColor;
  setAccentColor: (color: ThemeColor) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, isDarkMode, toggleTheme, onOpenMobileSidebar, globalTimeframe, setGlobalTimeframe, accentColor, setAccentColor 
}) => {
  const handleNotificationClick = () => {
    toast('No new notifications', {
      icon: '🔔',
    });
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard';
      case 'billings': return 'All Invoices';
      case 'expenses': return 'All Expenses';
      case 'new-billing': return 'New Invoice';
      case 'new-expense': return 'Record Expense';
      default: return 'Dashboard';
    }
  };

  const getSubtitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Welcome back, Admin';
      case 'billings': return 'Manage and track customer payments';
      case 'expenses': return 'Monitor salon operational costs';
      case 'new-billing': return 'Create a new customer invoice';
      case 'new-expense': return 'Log a new vendor or utility expense';
      default: return '';
    }
  };

  return (
    <header className="glass-panel" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      marginBottom: '2rem',
      padding: '1rem 1.5rem',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'color-mix(in srgb, var(--surface-color) 80%, transparent)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn-icon"
          onClick={onOpenMobileSidebar}
          style={{ display: window.innerWidth <= 768 ? 'block' : 'none' }}
        >
          <Menu size={24} />
        </button>
        
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {getTitle()}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
            {getSubtitle()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Global Time Filter */}
        <div style={{ position: 'relative', marginRight: '0.5rem' }}>
           <CalendarDays size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
           <select 
             className="form-control" 
             style={{ width: '140px', paddingLeft: '2.25rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', fontSize: '0.85rem' }}
             value={globalTimeframe}
             onChange={e => setGlobalTimeframe(e.target.value as TimeframeFilter)}
           >
             <option value="today">Today</option>
             <option value="week">This Week</option>
             <option value="month">This Month</option>
             <option value="all">All Time</option>
           </select>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.25rem' }}></div>

        {/* Quick Actions */}
        <button className="btn-icon" title="Search">
          <Search size={20} />
        </button>
        <button className="btn-icon" onClick={handleNotificationClick} title="Notifications" style={{ position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--surface-color)' }}></span>
        </button>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>

        {/* Theme Color Selector */}
        <div style={{ position: 'relative' }}>
           <select 
             className="form-control" 
             style={{ width: '110px', padding: '0.5rem', fontSize: '0.85rem', textTransform: 'capitalize' }}
             value={accentColor}
             onChange={e => setAccentColor(e.target.value as ThemeColor)}
           >
             <option value="purple">Purple</option>
             <option value="emerald">Emerald</option>
             <option value="blue">Blue</option>
             <option value="orange">Orange</option>
           </select>
        </div>

        {/* Theme Toggle */}
        <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
          {isDarkMode ? <Sun size={20} color="var(--warning)" /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};
