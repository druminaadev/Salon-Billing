import React, { useState } from 'react';
import type { Expense, PaymentMethod, ExpensePriority, ExpenseRecurrence } from '../../types';
import { X, CheckCircle2, Receipt, CreditCard, Hash } from 'lucide-react';
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

const Field: React.FC<{ label: string; children: React.ReactNode; span?: boolean }> = ({ label, children, span }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', gridColumn: span ? '1 / -1' : undefined }}>
    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
    {children}
  </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; accent: string; children: React.ReactNode }> = ({ icon, title, accent, children }) => (
  <div style={{
    background: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.75rem 1rem',
      borderBottom: '1px solid var(--border-color)',
      background: `linear-gradient(135deg, ${accent}10, transparent)`,
    }}>
      <span style={{ color: accent, display: 'flex', padding: '0.35rem', background: `${accent}15`, borderRadius: '8px' }}>{icon}</span>
      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</span>
    </div>
    <div style={{ padding: '1rem' }}>{children}</div>
  </div>
);

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState<number | ''>(initialData?.amount || '');
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || 'Cash');
  const [expenseDate, setExpenseDate] = useState(initialData?.date || format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState(initialData?.notes || '');

  // serial_number is GENERATED ALWAYS AS IDENTITY — DB assigns it on insert

  const handleSave = () => {
    if (!title || !amount || !category || !expenseDate) {
      alert('Please fill all required fields (Title, Amount, Category, Date).');
      return;
    }
    onSubmit({
      id: initialData?.id || `e${Date.now()}`,
      serialNumber: initialData?.serialNumber || '',  // DB assigns real number on insert
      title, description: '', amount: Number(amount),
      category, paymentMethod, vendorName: 'N/A',
      date: expenseDate, notes,
      priority: 'Medium' as ExpensePriority,
      recurrence: 'One Time' as ExpenseRecurrence,
    });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '1rem' }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1.25rem',
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {initialData ? 'Edit Expense' : '✦ New Expense'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
            <Hash size={11} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              {initialData ? `#${initialData.serialNumber}` : 'Auto-assigned on save'}
            </span>
          </div>
        </div>
        <button className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)' }} onClick={onCancel}>
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Expense Details */}
        <Section icon={<Receipt size={15} />} title="Expense Details" accent="var(--danger)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
            <Field label="Expense Title *" span>
              <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Monthly Rent" />
            </Field>
            <Field label="Amount (₹) *">
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)',
                }}>₹</span>
                <input type="number" className="form-control" min="0" value={amount}
                  onChange={e => setAmount(Number(e.target.value))} placeholder="0"
                  style={{ paddingLeft: '1.75rem' }} />
              </div>
            </Field>
            <Field label="Category *">
              <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Date *">
              <input type="date" className="form-control" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* Payment */}
        <Section icon={<CreditCard size={15} />} title="Payment Details" accent="#F59E0B">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem' }}>
            <Field label="Payment Method">
              <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}>
                {['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online Payment'].map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Notes" span>
              <textarea className="form-control" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes or reference..." style={{ resize: 'vertical' }} />
            </Field>
          </div>
        </Section>

        {/* Summary */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(245,158,11,0.04))',
          border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>Total Amount</span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)' }}>{fmt(Number(amount) || 0)}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" style={{ minWidth: '90px' }} onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}
              style={{ minWidth: '160px', padding: '0.55rem 1.25rem', background: 'var(--danger)', boxShadow: '0 4px 14px rgba(239,68,68,0.25)' }}>
              <CheckCircle2 size={15} /> {initialData ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
