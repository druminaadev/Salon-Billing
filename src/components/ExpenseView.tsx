import React from 'react';
import type { Expense } from '../types';
import { format } from 'date-fns';
import { ArrowLeft, Printer, Download } from 'lucide-react';

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
    // Dynamic import — jsPDF only downloads when user clicks Save PDF
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const dateStr = format(new Date(expense.date), 'yyyy-MM-dd');
    const safeTitle = expense.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `expense_${safeTitle}_${dateStr}`;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPENSE VOUCHER', 14, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Voucher #: ${expense.serialNumber}`, 14, 32);
    doc.text(`Date: ${format(new Date(expense.date), 'MMMM dd, yyyy')}`, 14, 38);

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 44, 196, 44);

    // Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Expense Details', 14, 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Title:    ${expense.title}`, 14, 60);
    doc.text(`Category: ${expense.category}`, 14, 67);
    doc.text(`Priority: ${expense.priority}`, 14, 74);
    doc.text(`Recurrence: ${expense.recurrence}`, 14, 81);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment', 14, 92);
    doc.setFont('helvetica', 'normal');
    doc.text(`Method:  ${expense.paymentMethod}`, 14, 100);
    if (expense.vendorName && expense.vendorName !== 'N/A') {
      doc.text(`Vendor:  ${expense.vendorName}`, 14, 107);
    }

    // Amount box
    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(0.5);
    doc.rect(14, 118, 182, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total Amount Paid:', 18, 130);
    doc.setFontSize(14);
    doc.text(formatCurrency(expense.amount), 140, 130);

    // Notes
    if (expense.notes) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Notes: ${expense.notes}`, 14, 148);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Thank you for keeping our financials organized.', 14, 275);
    doc.text('Authorized Signature: _____________________', 120, 275);

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '1rem' }}>
      
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={onBack}>
          <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Back to Expenses
        </button>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={savePDF}>
            <Download size={18} style={{ marginRight: '6px' }} /> Save PDF
          </button>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => window.print()}>
            <Printer size={18} style={{ marginRight: '6px' }} /> Print
          </button>
        </div>
      </div>

      {/* Expense Receipt Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface-color)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative Top Accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--danger)' }} />

        {/* Header Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>EXPENSE VOUCHER</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Voucher #: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{expense.serialNumber}</span></div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Date: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{format(new Date(expense.date), 'MMMM dd, yyyy')}</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Salon Financials</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>123 Premium Street</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Metro City, 400001</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Contact: +91 98765 43210</div>
          </div>
        </div>

        {/* Expense Info & Vendor */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Expense Details:</h4>
            <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{expense.title}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Category: {expense.category}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Priority: <span className={`badge ${expense.priority === 'High' ? 'badge-danger' : expense.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>{expense.priority}</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {expense.vendorName && (
              <>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Paid To:</h4>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{expense.vendorName}</div>
              </>
            )}
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: expense.vendorName ? '0.25rem' : '0' }}>Payment Method: <span className="badge badge-neutral">{expense.paymentMethod}</span></div>
          </div>
        </div>

        {/* Amount Box */}
        <div style={{ background: 'var(--background-color)', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Amount Paid</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--danger)', letterSpacing: '-0.025em', lineHeight: 1 }}>{formatCurrency(expense.amount)}</div>
          </div>
          {expense.notes && (
             <div style={{ maxWidth: '50%', textAlign: 'right' }}>
               <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontStyle: 'italic' }}>Notes:</div>
               <div style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>{expense.notes}</div>
             </div>
          )}
        </div>

        {/* Footer Details */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
              Thank you for keeping our financials organized.
           </div>
           <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             Authorized Signature: _____________________
           </div>
        </div>

      </div>
    </div>
  );
};
