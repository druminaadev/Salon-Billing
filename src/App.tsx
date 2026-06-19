import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { Layout } from './components/Layout';
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
import { Billings } from './components/Billings';
import { Expenses } from './components/Expenses';
import { BillingForm } from './components/forms/BillingForm';
import { ExpenseForm } from './components/forms/ExpenseForm';
import { Staffs } from './components/Staffs';
import { StaffForm } from './components/forms/StaffForm';
import { SlideOver } from './components/SlideOver';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import type { ViewState, Billing, Expense, TimeframeFilter, Staff, ThemeColor } from './types';
import {
  createSession,
  destroySession,
  isSessionValid,
  logSecurityEvent,
  sanitizeString,
  sanitizeNumber,
  sanitizePhone,
  isValidAmount,
  isValidPaymentMethod,
} from './utils/security';
import {
  fetchBillings,
  createBilling,
  updateBilling,
  deleteBilling,
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  fetchStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
} from './lib/database';

import { Toaster, toast } from 'react-hot-toast';

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [globalTimeframe, setGlobalTimeframe] = useState<TimeframeFilter>('today');

  // Data state — starts empty, loaded from Supabase
  const [billings, setBillings] = useState<Billing[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(() => isSessionValid());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState<ThemeColor>('purple');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  // ── Security: session check on visibility change ────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isSessionValid()) {
        handleLogout('Session expired');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // ── Dark mode class ─────────────────────────────────────────────────────
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // ── Accent Color class ──────────────────────────────────────────────────
  useEffect(() => {
    document.body.setAttribute('data-theme', accentColor);
  }, [accentColor]);

  // ── Load data from Supabase on auth ─────────────────────────────────────
  const loadData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [billingsData, expensesData, staffsData] = await Promise.all([
        fetchBillings(),
        fetchExpenses(),
        fetchStaffs(),
      ]);
      setBillings(billingsData);
      setExpenses(expensesData);
      setStaffs(staffsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      console.error('[App] loadData error:', message);
      toast.error('Could not load data from database. Check your Supabase configuration.');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // ── Auth handlers ────────────────────────────────────────────────────────
  const handleLogin = () => {
    createSession();
    logSecurityEvent('LOGIN_SUCCESS', { timestamp: new Date().toISOString() });
    setIsAuthenticated(true);
  };

  const handleLogout = (reason?: string) => {
    destroySession();
    logSecurityEvent('LOGOUT', { reason: reason || 'User initiated', timestamp: new Date().toISOString() });
    setIsAuthenticated(false);
    setBillings([]);
    setExpenses([]);
    setStaffs([]);
    setCurrentView('dashboard');
    toast.error(reason || 'Logged out successfully');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // ── Security: sanitize before DB write ──────────────────────────────────
  const sanitizeBilling = (billing: Billing): Billing => ({
    ...billing,
    serialNumber: sanitizeString(billing.serialNumber, 14),
    customerName: sanitizeString(billing.customerName, 100),
    mobileNumber: sanitizePhone(billing.mobileNumber),
    notes: sanitizeString(billing.notes || '', 500),
    services: billing.services.map((s) => ({
      ...s,
      name: sanitizeString(s.name, 100),
      serviceBy: sanitizeString(s.serviceBy || '', 100),
      price: sanitizeNumber(s.price, 0, 1_000_000),
      quantity: sanitizeNumber(s.quantity, 1, 1_000),
    })),
    subtotal: sanitizeNumber(billing.subtotal, 0, 10_000_000),
    discount: sanitizeNumber(billing.discount, 0, 10_000_000),
    tax: sanitizeNumber(billing.tax, 0, 10_000_000),
    grandTotal: sanitizeNumber(billing.grandTotal, 0, 10_000_000),
    paymentMethod: isValidPaymentMethod(billing.paymentMethod) ? billing.paymentMethod : 'Cash',
  });

  const sanitizeExpense = (expense: Expense): Expense => ({
    ...expense,
    serialNumber: sanitizeString(expense.serialNumber, 20),
    title: sanitizeString(expense.title, 100),
    description: sanitizeString(expense.description, 500),
    category: sanitizeString(expense.category, 50),
    vendorName: sanitizeString(expense.vendorName, 100),
    notes: sanitizeString(expense.notes || '', 500),
    amount: sanitizeNumber(expense.amount, 0, 10_000_000),
    paymentMethod: isValidPaymentMethod(expense.paymentMethod) ? expense.paymentMethod : 'Cash',
  });

  // ── Billing handlers ─────────────────────────────────────────────────────
  const handleCreateBilling = async (newBilling: Billing) => {
    const sanitized = sanitizeBilling(newBilling);
    if (!isValidAmount(sanitized.grandTotal)) {
      toast.error('Invalid amount');
      return;
    }
    const loadingToast = toast.loading('Saving invoice...');
    try {
      const created = await createBilling(sanitized);
      setBillings((prev) => [created, ...prev]);
      setCurrentView('billings');
      logSecurityEvent('BILLING_CREATED', { id: created.id });
      toast.success('Invoice Created Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save invoice';
      toast.error(message, { id: loadingToast });
    }
  };

  const handleUpdateBilling = async (updatedBilling: Billing) => {
    const sanitized = sanitizeBilling(updatedBilling);
    if (!isValidAmount(sanitized.grandTotal)) {
      toast.error('Invalid amount');
      return;
    }
    const loadingToast = toast.loading('Updating invoice...');
    try {
      const updated = await updateBilling(sanitized);
      setBillings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setCurrentView('billings');
      logSecurityEvent('BILLING_UPDATED', { id: updated.id });
      toast.success('Invoice Updated Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update invoice';
      toast.error(message, { id: loadingToast });
    }
  };

  const handleDeleteBilling = async (id: string) => {
    const loadingToast = toast.loading('Deleting invoice...');
    try {
      await deleteBilling(id);
      setBillings((prev) => prev.filter((b) => b.id !== id));
      logSecurityEvent('BILLING_DELETED', { id });
      toast.success('Invoice Deleted Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete invoice';
      toast.error(message, { id: loadingToast });
    }
  };

  // ── Expense handlers ─────────────────────────────────────────────────────
  const handleCreateExpense = async (newExpense: Expense) => {
    const sanitized = sanitizeExpense(newExpense);
    if (!isValidAmount(sanitized.amount)) {
      toast.error('Invalid amount');
      return;
    }
    const loadingToast = toast.loading('Saving expense...');
    try {
      const created = await createExpense(sanitized);
      setExpenses((prev) => [created, ...prev]);
      setCurrentView('expenses');
      logSecurityEvent('EXPENSE_CREATED', { id: created.id });
      toast.success('Expense Recorded!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save expense';
      toast.error(message, { id: loadingToast });
    }
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    const sanitized = sanitizeExpense(updatedExpense);
    if (!isValidAmount(sanitized.amount)) {
      toast.error('Invalid amount');
      return;
    }
    const loadingToast = toast.loading('Updating expense...');
    try {
      const updated = await updateExpense(sanitized);
      setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      setCurrentView('expenses');
      logSecurityEvent('EXPENSE_UPDATED', { id: updated.id });
      toast.success('Expense Updated Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update expense';
      toast.error(message, { id: loadingToast });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const loadingToast = toast.loading('Deleting expense...');
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      logSecurityEvent('EXPENSE_DELETED', { id });
      toast.success('Expense Deleted Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete expense';
      toast.error(message, { id: loadingToast });
    }
  };

  // ── Staff handlers ───────────────────────────────────────────────────────
  const handleCreateStaff = async (newStaff: Staff) => {
    const loadingToast = toast.loading('Saving staff member...');
    try {
      const created = await createStaff(newStaff);
      setStaffs((prev) => [created, ...prev]);
      setCurrentView('staff');
      logSecurityEvent('STAFF_CREATED', { id: created.id });
      toast.success('Staff Member Added Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add staff member';
      toast.error(message, { id: loadingToast });
    }
  };

  const handleUpdateStaff = async (updatedStaff: Staff) => {
    const loadingToast = toast.loading('Updating staff member...');
    try {
      const updated = await updateStaff(updatedStaff);
      setStaffs((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setCurrentView('staff');
      logSecurityEvent('STAFF_UPDATED', { id: updated.id });
      toast.success('Staff Member Updated Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update staff member';
      toast.error(message, { id: loadingToast });
    }
  };

  const handleDeleteStaff = async (id: string) => {
    const loadingToast = toast.loading('Deleting staff member...');
    try {
      await deleteStaff(id);
      setStaffs((prev) => prev.filter((s) => s.id !== id));
      logSecurityEvent('STAFF_DELETED', { id });
      toast.success('Staff Member Deleted Successfully!', { id: loadingToast });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete staff member';
      toast.error(message, { id: loadingToast });
    }
  };

  // ── Loading screen ───────────────────────────────────────────────────────
  if (isAuthenticated && isLoadingData) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--bg-color, #0f0f0f)',
          color: 'var(--text-primary, #fff)',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: 'var(--font-family, sans-serif)',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid var(--border-color, #333)',
            borderTopColor: 'var(--accent-color, #a78bfa)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ opacity: 0.6, fontSize: 14 }}>Loading salon data…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── View renderer ────────────────────────────────────────────────────────
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            billings={billings}
            expenses={expenses}
            onNavigate={setCurrentView}
            timeframe={globalTimeframe}
          />
        );

      case 'billings':
      case 'new-billing':
      case 'edit-billing':
      case 'view-billing':
        return (
          <>
            <Billings
              billings={billings}
              staffs={staffs}
              onNavigate={setCurrentView}
              globalTimeframe={globalTimeframe}
              currentView={currentView}
              selectedBilling={selectedBilling}
              onView={(billing) => {
                setSelectedBilling(billing);
                setCurrentView('view-billing');
              }}
              onEdit={(billing) => {
                setSelectedBilling(billing);
                setCurrentView('edit-billing');
              }}
              onDelete={handleDeleteBilling}
            />
            <SlideOver 
              isOpen={currentView === 'new-billing' || currentView === 'edit-billing'} 
              onClose={() => setCurrentView('billings')} 
              title={currentView === 'new-billing' ? 'Create New Invoice' : 'Edit Invoice'}
            >
              {currentView === 'new-billing' && (
                <BillingForm onSubmit={handleCreateBilling} onCancel={() => setCurrentView('billings')} staffs={staffs} />
              )}
              {currentView === 'edit-billing' && selectedBilling && (
                <BillingForm initialData={selectedBilling} onSubmit={handleUpdateBilling} onCancel={() => setCurrentView('billings')} staffs={staffs} />
              )}
            </SlideOver>
          </>
        );

      case 'expenses':
      case 'new-expense':
      case 'edit-expense':
      case 'view-expense':
        return (
          <>
            <Expenses
              expenses={expenses}
              onNavigate={setCurrentView}
              globalTimeframe={globalTimeframe}
              currentView={currentView}
              selectedExpense={selectedExpense}
              onView={(expense) => {
                setSelectedExpense(expense);
                setCurrentView('view-expense');
              }}
              onEdit={(expense) => {
                setSelectedExpense(expense);
                setCurrentView('edit-expense');
              }}
              onDelete={handleDeleteExpense}
            />
            <SlideOver 
              isOpen={currentView === 'new-expense' || currentView === 'edit-expense'} 
              onClose={() => setCurrentView('expenses')} 
              title={currentView === 'new-expense' ? 'Record Expense' : 'Edit Expense'}
            >
              {currentView === 'new-expense' && (
                <ExpenseForm onSubmit={handleCreateExpense} onCancel={() => setCurrentView('expenses')} />
              )}
              {currentView === 'edit-expense' && selectedExpense && (
                <ExpenseForm initialData={selectedExpense} onSubmit={handleUpdateExpense} onCancel={() => setCurrentView('expenses')} />
              )}
            </SlideOver>
          </>
        );

      case 'staff':
      case 'new-staff':
      case 'edit-staff':
      case 'view-staff':
        return (
          <>
            <Staffs
              staffs={staffs}
              billings={billings}
              globalTimeframe={globalTimeframe}
              onNavigate={setCurrentView}
              currentView={currentView}
              selectedStaff={selectedStaff}
              onView={(staff) => {
                setSelectedStaff(staff);
                setCurrentView('view-staff');
              }}
              onEdit={(staff) => {
                setSelectedStaff(staff);
                setCurrentView('edit-staff');
              }}
              onDelete={handleDeleteStaff}
            />
            <SlideOver 
              isOpen={currentView === 'new-staff' || currentView === 'edit-staff'} 
              onClose={() => setCurrentView('staff')} 
              title={currentView === 'new-staff' ? 'Add Staff Member' : 'Edit Staff Member'}
            >
              {currentView === 'new-staff' && (
                <StaffForm onSubmit={handleCreateStaff} onCancel={() => setCurrentView('staff')} />
              )}
              {currentView === 'edit-staff' && selectedStaff && (
                <StaffForm initialData={selectedStaff} onSubmit={handleUpdateStaff} onCancel={() => setCurrentView('staff')} />
              )}
            </SlideOver>
          </>
        );

      default:
        return (
          <Dashboard
            billings={billings}
            expenses={expenses}
            onNavigate={setCurrentView}
            timeframe={globalTimeframe}
          />
        );
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--surface-color)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            fontFamily: 'var(--font-family)',
          },
        }}
      />
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ProtectedRoute onSessionExpired={() => handleLogout('Session expired due to inactivity')}>
          <Layout
            currentView={currentView}
            onNavigate={setCurrentView}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            globalTimeframe={globalTimeframe}
            setGlobalTimeframe={setGlobalTimeframe}
            onLogout={() => handleLogout('User initiated logout')}
          >
            <Suspense fallback={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ width: 32, height: 32, border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                <span style={{ fontSize: '0.875rem' }}>Loading...</span>
              </div>
            }>
              {renderView()}
            </Suspense>
          </Layout>
        </ProtectedRoute>
      )}
    </>
  );
}

export default App;
