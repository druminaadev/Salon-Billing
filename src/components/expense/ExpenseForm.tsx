import React, { useState } from 'react';
import type { Expense, PaymentMethod, ExpensePriority, ExpenseRecurrence } from '../../types';
import { X, CheckCircle2, Wallet, CreditCard, Hash, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onSubmit: (expense: Expense) => void;
  onCancel: () => void;
  initialData?: Expense;
}

const CATEGORIES = [
  'Product Purchase', 'Staff Salary', 'Rent', 'Electricity', 'Water',
  'Internet', 'Marketing', 'Equipment', 'Maintenance', 'Miscellaneous',
];

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ label, required, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', ...style }}>
    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}{required && <span style={{ color: 'var(--danger)', marginLeft: '3px' }}>*</span>}
    </label>
    {children}
  </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; accent: string; children: React.ReactNode }> = ({ icon, title, accent, children }) => (
  <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: `linear-gradient(to right, ${accent}08, transparent)` }}>
      <div style={{ color: accent, display: 'flex', padding: '0.4rem', background: `${accent}15`, borderRadius: '10px' }}>{icon}</div>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</span>
    </div>
    <div style={{ padding: '1.25rem' }}>{children}</div>
  </div>
);

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState<number | ''>(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || 'Cash');
  const [expenseDate, setExpenseDate] = useState(initialData?.date || format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [vendorName, setVendorName] = useState(initialData?.vendorName || '');
  const [priority, setPriority] = useState<ExpensePriority>(initialData?.priority || 'Medium');
  const [recurrence, setRecurrence] = useState<ExpenseRecurrence>(initialData?.recurrence || 'One Time');

  const handleSave = () => {
    if (!title.trim() || !amount || !category || !expenseDate) {
      alert('Please fill all required fields: Title, Amount, Category, and Date.');
      return;
    }
    onSubmit({
      id: initialData?.id || `e${Date.now()}`,
      serialNumber: initialData?.serialNumber || '',
      title: title.trim(),
      description: '',
      amount: Number(amount),
      category,
      paymentMethod,
      vendorName: vendorName.trim() || 'N/A',
      date: expenseDate,
      notes,
      priority,
      recurrence,
    });
  };

  const PAYMENT_METHODS: PaymentMethod[] = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online Payment'];
  const PAYMENT_COLORS: Record<PaymentMethod, string> = {
    Cash: '#10b981',
    UPI: '#6366f1',
    Card: '#3b82f6',
    'Bank Transfer': '#f59e0b',
    'Online Payment': '#8b5cf6',
  };

  const PRIORITY_CONFIG: { value: ExpensePriority; color: string; bg: string }[] = [
    { value: 'Low', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { value: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { value: 'High', color: 'var(--danger)', bg: 'var(--danger-bg)' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto', paddingBottom: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--danger-bg)', borderRadius: '12px', color: 'var(--danger)', display: 'flex' }}>
              <Wallet size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {initialData ? 'Edit Expense' : 'New Expense'}
            </h2>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-color)', padding: '0.2rem 0.7rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', marginLeft: '0.25rem' }}>
            <Hash size={11} style={{ color: 'var(--danger)' }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, fontFamily: 'monospace' }}>
              {initialData ? initialData.serialNumber : 'Auto-assigned on save'}
            </span>
          </div>
        </div>
        <button
          className="btn-icon"
          style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '50%', padding: '0.55rem', boxShadow: 'var(--shadow-sm)' }}
          onClick={onCancel}
          title="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Expense Details */}
        <Section icon={<Wallet size={15} />} title="Expense Details" accent="var(--danger)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
            <Field label="Expense Title" required style={{ gridColumn: '1 / -1' }}>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Monthly Rent, Product Restock..."
              />
            </Field>
            <Field label="Amount" required>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem' }}>₹</span>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  style={{ paddingLeft: '1.85rem' }}
                />
              </div>
            </Field>
            <Field label="Date" required>
              <input
                type="date"
                className="form-control"
                value={expenseDate}
                onChange={e => setExpenseDate(e.target.value)}
              />
            </Field>
            <Field label="Category" required>
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Vendor / Supplier">
              <input
                type="text"
                className="form-control"
                value={vendorName}
                onChange={e => setVendorName(e.target.value)}
                placeholder="e.g. Amazon, Local Store"
              />
            </Field>
          </div>
        </Section>

        {/* Payment & Classification */}
        <Section icon={<CreditCard size={15} />} title="Payment & Classification" accent="#6366f1">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

            <Field label="Payment Method">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      border: paymentMethod === m
                        ? `1.5px solid ${PAYMENT_COLORS[m]}`
                        : '1.5px solid var(--border-color)',
                      background: paymentMethod === m
                        ? `color-mix(in srgb, ${PAYMENT_COLORS[m]} 12%, var(--surface-color))`
                        : 'var(--bg-color)',
                      color: paymentMethod === m ? PAYMENT_COLORS[m] : 'var(--text-secondary)',
                    }}
                  >{m}</button>
                ))}
              </div>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Priority">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {PRIORITY_CONFIG.map(({ value, color, bg }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPriority(value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.18s',
                        border: priority === value ? `1.5px solid ${color}` : '1.5px solid var(--border-color)',
                        background: priority === value ? bg : 'var(--bg-color)',
                        color: priority === value ? color : 'var(--text-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                      }}
                    >
                      {priority === value && <AlertTriangle size={12} />}
                      {value}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Recurrence">
                <select
                  className="form-control"
                  value={recurrence}
                  onChange={e => setRecurrence(e.target.value as ExpenseRecurrence)}
                >
                  {(['One Time', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'] as ExpenseRecurrence[]).map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Notes / Reference">
              <textarea
                className="form-control"
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Invoice number, internal reference, or any notes..."
                style={{ resize: 'vertical' }}
              />
            </Field>
          </div>
        </Section>

        {/* Summary + Actions */}
        <div style={{
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          position: 'sticky',
          bottom: '1rem',
          zIndex: 10,
        }}>
          {/* Amount summary row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: '1px solid var(--border-color)',
          }}>
            {[
              { label: 'Category', value: category, color: 'var(--text-primary)' },
              { label: 'Priority', value: priority, color: priority === 'High' ? 'var(--danger)' : priority === 'Medium' ? 'var(--warning)' : 'var(--success)' },
              { label: 'Total Amount', value: fmt(Number(amount) || 0), color: 'var(--danger)', large: true },
            ].map((row: any) => (
              <div key={row.label} style={{
                padding: '1rem 1.25rem',
                borderRight: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
                background: row.large ? 'color-mix(in srgb, var(--danger) 4%, var(--surface-color))' : undefined,
              }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: row.large ? '1.4rem' : '1rem', fontWeight: row.large ? 800 : 700, color: row.color, lineHeight: 1.1 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', padding: '1rem 1.25rem', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-outline"
              style={{ minWidth: '110px', padding: '0.65rem 1.25rem', fontWeight: 600 }}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{
                minWidth: '180px', padding: '0.65rem 1.5rem',
                fontWeight: 700, fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'var(--danger)',
                boxShadow: '0 4px 14px color-mix(in srgb, var(--danger) 30%, transparent)',
              }}
              onClick={handleSave}
            >
              <CheckCircle2 size={17} />
              {initialData ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
