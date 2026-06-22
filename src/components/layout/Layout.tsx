import React, { useState } from 'react';
import type { ViewState, TimeframeFilter, ThemeColor } from '../../types';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LayoutDashboard, ReceiptText, CreditCard, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  globalTimeframe: TimeframeFilter;
  setGlobalTimeframe: (timeframe: TimeframeFilter) => void;
  accentColor: ThemeColor;
  setAccentColor: (color: ThemeColor) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, currentView, onNavigate, isDarkMode, toggleTheme, globalTimeframe, setGlobalTimeframe, accentColor, setAccentColor, sidebarCollapsed, setSidebarCollapsed, onLogout 
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // For mobile sliding

  const getBottomNavStyle = (view: ViewState) => ({
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '0.25rem',
    background: 'transparent', border: 'none',
    color: currentView === view ? 'var(--primary)' : 'var(--text-secondary)',
    fontSize: '0.75rem', fontWeight: 500
  });

  return (
    <div className="app-container">
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => {
          onNavigate(view);
          setIsMobileSidebarOpen(false);
        }}
        isCollapsed={sidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="main-content" style={{ padding: 0 }}>
        <Header 
          currentView={currentView}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          globalTimeframe={globalTimeframe}
          setGlobalTimeframe={setGlobalTimeframe}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
        />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem 1rem 1rem' }}>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="bottom-nav">
        <button style={getBottomNavStyle('dashboard')} onClick={() => onNavigate('dashboard')}>
          <LayoutDashboard size={24} /> Dashboard
        </button>
        <button style={getBottomNavStyle('billings')} onClick={() => onNavigate('billings')}>
          <ReceiptText size={24} /> Billings
        </button>
        <button style={getBottomNavStyle('expenses')} onClick={() => onNavigate('expenses')}>
          <CreditCard size={24} /> Expenses
        </button>
      </div>

      {/* Floating Action Button (Mobile) */}
      {(currentView === 'dashboard' || currentView === 'billings' || currentView === 'expenses') && (
        <button
          className="fab"
          onClick={() => onNavigate(currentView === 'expenses' ? 'new-expense' : 'new-billing')}
        >
          <Plus size={24} />
        </button>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}
    </div>
  );
};
