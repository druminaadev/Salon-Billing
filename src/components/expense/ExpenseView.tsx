import React from 'react';
import type { Expense } from '../../types';
import { format } from 'date-fns';
import { ArrowLeft, Printer, Download, ReceiptText } from 'lucide-react';

interface ExpenseViewProps {
  expense: Expense;
  onBack: () => void;
}

export const ExpenseView: React.FC<ExpenseViewProps> = ({ expense, onBack }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  // Filename: expense_Title_YYYY-MM-DD.pdf
  const savePDF = async () => {
    const element = document.getElementById('printable-invoice-card'); // Use same ID so print media queries work perfectly
    if (!element) return;

    // Dynamic import to keep bundle small
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const dateStr = format(new Date(expense.date), 'yyyy-MM-dd');
    const safeTitle = expense.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `expense_${safeTitle}_${dateStr}.pdf`;
    
    pdf.save(filename);
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-color)' }} onClick={onBack}>
          <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Back to Expenses
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-color)' }} onClick={savePDF}>
            <Download size={18} style={{ marginRight: '6px', color: 'var(--danger)' }} /> Save PDF
          </button>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', background: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => window.print()}>
            <Printer size={18} style={{ marginRight: '6px' }} /> Print
          </button>
        </div>
      </div>

      {/* Premium Receipt Card */}
      <div id="printable-invoice-card" className="invoice-card" style={{ background: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        
        {/* Top Gradient Banner - Red theme for expenses */}
        <div style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', padding: '2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)' }}>
                <ReceiptText size={28} color="white" />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.025em' }}>EXPENSE VOUCHER</h2>
            </div>
            <div style={{ opacity: 0.9, fontSize: '1rem', marginTop: '0.5rem' }}>Voucher #: <span style={{ fontWeight: 700, letterSpacing: '0.05em', background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: '0.5rem' }}>{expense.serialNumber}</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>BELIEVER SALON</div>
            <div style={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.6 }}>
              123 Premium Street<br />
              Metro City, 400001<br />
              Contact: +91 98765 43210
            </div>
          </div>
        </div>

        <div style={{ padding: '2.5rem' }}>
          {/* Expense Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Expense Description</h4>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{expense.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Category: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{expense.category}</span></div>
                <div>Priority: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{expense.priority}</span></div>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Date Issued</h4>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{format(new Date(expense.date), 'MMMM dd, yyyy')}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Recurrence: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{expense.recurrence}</span></div>
            </div>
          </div>

          {/* Amount and Vendor Box */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
            <div style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              {expense.vendorName && expense.vendorName !== 'N/A' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Paid To</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{expense.vendorName}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Total Paid</span>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--danger)', lineHeight: 1 }}>{formatCurrency(expense.amount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '2.5rem', borderTop: '2px dashed var(--border-color)', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Payment Method</h4>
              <span className={`badge ${
                expense.paymentMethod === 'Cash' ? 'badge-cash' :
                expense.paymentMethod === 'UPI' ? 'badge-upi' :
                expense.paymentMethod === 'Card' ? 'badge-card' :
                'badge-online'
              }`} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
                {expense.paymentMethod}
              </span>
            </div>
            {expense.notes && (
              <div style={{ flex: 1, maxWidth: '400px', textAlign: 'right' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Notes</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>"{expense.notes}"</p>
              </div>
            )}
            {!expense.notes && (
              <div style={{ flex: 1, maxWidth: '400px', textAlign: 'right' }}>
                 <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Thank you for keeping our financials organized.</div>
                 <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Authorized Signature: _____________________</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
