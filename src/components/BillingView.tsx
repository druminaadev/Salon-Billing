import React from 'react';
import type { Billing } from '../types';
import { format } from 'date-fns';
import { ArrowLeft, Printer, Download } from 'lucide-react';

interface BillingViewProps {
  billing: Billing;
  onBack: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ billing, onBack }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  // Filename: billing_CustomerName_YYYY-MM-DD.pdf
  const savePDF = async () => {
    // Dynamic import — jsPDF only downloads when user clicks Save PDF
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable'),
    ]);
    const doc = new jsPDF();
    const dateStr = format(new Date(billing.createdAt), 'yyyy-MM-dd');
    const safeName = billing.customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `billing_${safeName}_${dateStr}`;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${billing.serialNumber}`, 14, 32);
    doc.text(`Date: ${format(new Date(billing.createdAt), 'MMMM dd, yyyy')}`, 14, 38);
    doc.text(`Customer: ${billing.customerName}`, 14, 44);
    doc.text(`Mobile: ${billing.mobileNumber}`, 14, 50);
    if (billing.customerGender) doc.text(`Gender: ${billing.customerGender}`, 14, 56);

    // Services table
    autoTable(doc, {
      startY: 65,
      head: [['Service', 'Staff', 'Qty', 'Unit Price', 'Amount']],
      body: billing.services.map(s => [
        s.name,
        s.serviceBy || '-',
        s.quantity,
        formatCurrency(s.price),
        formatCurrency(s.price * s.quantity),
      ]),
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 9 },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Subtotal: ${formatCurrency(billing.subtotal)}`, 140, finalY);
    doc.text(`Discount: -${formatCurrency(billing.discount)}`, 140, finalY + 6);
    doc.text(`Tax: +${formatCurrency(billing.tax)}`, 140, finalY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Grand Total: ${formatCurrency(billing.grandTotal)}`, 140, finalY + 22);

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Payment: ${billing.paymentMethod}`, 14, finalY + 22);
    if (billing.notes) doc.text(`Notes: ${billing.notes}`, 14, finalY + 30);

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '1rem' }}>
      
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={onBack}>
          <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Back to Billings
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

      {/* Receipt Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--surface-color)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative Top Accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--primary)' }} />

        {/* Header Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>INVOICE</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Invoice #: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{billing.serialNumber}</span></div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Date: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{format(new Date(billing.createdAt), 'MMMM dd, yyyy')}</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Salon Financials</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>123 Premium Street</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Metro City, 400001</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Contact: +91 98765 43210</div>
          </div>
        </div>

        {/* Customer Details */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Bill To:</h4>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{billing.customerName}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Mobile: {billing.mobileNumber}</div>
        </div>

        {/* Services Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>Service Description</th>
                <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem' }}>Service By</th>
                <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Unit Price</th>
                <th style={{ padding: '0.75rem 0', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.875rem', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {billing.services.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-primary)' }}>{s.serviceBy || '-'}</td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-primary)', textAlign: 'center' }}>{s.quantity}</td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-primary)', textAlign: 'right' }}>{formatCurrency(s.price)}</td>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-primary)', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(s.price * s.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <div style={{ width: '300px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{formatCurrency(billing.subtotal)}</span>
            </div>
            {billing.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                <span>Discount:</span>
                <span style={{ color: 'var(--danger)' }}>-{formatCurrency(billing.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-secondary)', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span>Tax Amount:</span>
              <span style={{ color: 'var(--text-primary)' }}>+{formatCurrency(billing.tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>Grand Total:</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(billing.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Payment Method</h4>
            <span className="badge badge-neutral" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>{billing.paymentMethod}</span>
          </div>
          {billing.notes && (
            <div style={{ maxWidth: '400px', textAlign: 'right' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Notes</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{billing.notes}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
