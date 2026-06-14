import React from 'react';
import type { ViewState } from '../types';
import { LayoutDashboard, ReceiptText, Plus, LogOut, ChevronLeft, ChevronRight, X, Wallet } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  onLogout?: () => void;
}

const NavSection: React.FC<{ title?: string; children: React.ReactNode; isCollapsed: boolean }> = ({ title, children, isCollapsed }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
    {title && !isCollapsed && (
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.75rem 0.875rem 0.35rem', marginTop: '0.75rem' }}>
        {title}
      </div>
    )}
    {title && isCollapsed && <div style={{ height: '1rem' }} />}
    {children}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isCollapsed, isMobileOpen, onToggle, onCloseMobile, onLogout }) => {
  const isActive = (view: ViewState | ViewState[]) => Array.isArray(view) ? view.includes(currentView) : currentView === view;

  const NavButton: React.FC<{ view: ViewState | ViewState[]; icon: React.ReactNode; label: string; accent?: string; onClick?: () => void }> = ({ view, icon, label, accent, onClick }) => {
    const active = isActive(view);
    const accentColor = accent || 'var(--primary)';
    return (
      <button
        onClick={() => { onClick ? onClick() : onNavigate(Array.isArray(view) ? view[0] : view); if (isMobileOpen) onCloseMobile(); }}
        title={isCollapsed ? label : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: isCollapsed ? '0.7rem' : '0.7rem 0.875rem',
          borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent',
          color: active ? accentColor : 'var(--text-secondary)',
          fontSize: '0.85rem', fontWeight: active ? 600 : 500,
          cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
          fontFamily: 'var(--font-family)', width: '100%',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          ...(active && {
            background: `${accentColor}12`,
            color: accentColor,
            boxShadow: `inset 3px 0 0 ${accentColor}`,
          }),
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = 'var(--surface-hover)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }
        }}
      >
        <span style={{ display: 'flex', flexShrink: 0 }}>{icon}</span>
        {!isCollapsed && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>}
      </button>
    );
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        padding: isCollapsed ? '1.25rem 0.75rem' : '1.25rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        {!isCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <div style={{ overflow: 'hidden' }}>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Hair Ahmedabad</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: '0.02em', marginTop: '0.15rem' }}>Unisex Salon</div>
            </div>
          </div>
        ) : (
          <div style={{ width: '38px', height: '38px' }} />
        )}

        {/* Desktop Toggle - always visible, positioned absolutely */}
        {typeof window !== 'undefined' && window.innerWidth > 768 && (
          <button onClick={onToggle} style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
            borderRadius: '8px', padding: '0.35rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-secondary)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}

        {/* Mobile Close - only show on mobile when open */}
        {typeof window !== 'undefined' && window.innerWidth <= 768 && isMobileOpen && (
          <button onClick={onCloseMobile} style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--danger-bg)', color: 'var(--danger)',
            borderRadius: '8px', padding: '0.35rem', border: 'none', cursor: 'pointer', display: 'flex',
          }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: isCollapsed ? '1rem 0.5rem' : '1rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', overflowY: 'auto' }}>

        <NavButton view="dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />

        <NavSection title="Income" isCollapsed={isCollapsed}>
          <NavButton view={['new-billing', 'edit-billing']} icon={<Plus size={18} />} label="New Invoice" accent="#10B981" />
          <NavButton view={['billings', 'view-billing']} icon={<ReceiptText size={18} />} label="All Invoices" accent="var(--primary)" />
        </NavSection>

        <NavSection title="Expenses" isCollapsed={isCollapsed}>
          <NavButton view={['new-expense', 'edit-expense']} icon={<Plus size={18} />} label="New Expense" accent="var(--danger)" />
          <NavButton view={['expenses', 'view-expense']} icon={<Wallet size={18} />} label="All Expenses" accent="#F59E0B" />
        </NavSection>

      </nav>

      {/* Footer Profile */}
      <div style={{
        marginTop: 'auto', padding: isCollapsed ? '1rem 0.5rem' : '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, color: 'white', fontSize: '0.85rem', flexShrink: 0,
          border: '2px solid var(--surface-color)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          A
        </div>
        {!isCollapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@salon.com</div>
            </div>
            <button onClick={() => { if (window.confirm('Logout?')) { onLogout?.(); } }} style={{
              background: 'var(--danger-bg)', color: 'var(--danger)',
              border: 'none', borderRadius: '8px', padding: '0.4rem',
              cursor: 'pointer', display: 'flex', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
              title="Logout">
              <LogOut size={15} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
