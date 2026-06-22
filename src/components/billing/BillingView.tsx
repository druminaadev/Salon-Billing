import React from 'react';
import type { Billing } from '../../types';
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
    const element = document.getElementById('printable-invoice-card');
    if (!element) return;

    // Dynamic import to keep bundle small
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);

    // Add a temporary class or style if needed, but html2canvas usually captures it well
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // A4 height is 297, calculate image height proportional to pdfWidth
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    const dateStr = format(new Date(billing.createdAt), 'yyyy-MM-dd');
    const safeName = billing.customerName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `billing_${safeName}_${dateStr}.pdf`;
    
    pdf.save(filename);
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', margin: '0 auto', paddingBottom: '2rem' }}>
      
      {/* Header Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-color)' }} onClick={onBack}>
          <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Back to Billings
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', background: 'var(--surface-color)' }} onClick={savePDF}>
            <Download size={18} style={{ marginRight: '6px', color: 'var(--primary)' }} /> Save PDF
          </button>
          <button className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)' }} onClick={() => window.print()}>
            <Printer size={18} style={{ marginRight: '6px' }} /> Print
          </button>
        </div>
      </div>

      {/* Premium Receipt Card */}
      <div id="printable-invoice-card" className="invoice-card" style={{ background: 'var(--surface-color)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        
        {/* Top Gradient Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)' }}>
                <Printer size={28} color="white" />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.025em' }}>INVOICE</h2>
            </div>
            <div style={{ opacity: 0.9, fontSize: '1rem', marginTop: '0.5rem' }}>Invoice #: <span style={{ fontWeight: 700, letterSpacing: '0.05em', background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '4px', marginLeft: '0.5rem' }}>{billing.serialNumber}</span></div>
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
          {/* Customer & Date Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Billed To</h4>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{billing.customerName}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Mobile: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{billing.mobileNumber}</span></div>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Date of Issue</h4>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{format(new Date(billing.createdAt), 'MMMM dd, yyyy')}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Time: <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{format(new Date(billing.createdAt), 'hh:mm a')}</span></div>
            </div>
          </div>

          {/* Services Table */}
          <div style={{ marginBottom: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'color-mix(in srgb, var(--primary) 5%, var(--surface-color))', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Staff</th>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Rate</th>
                  <th style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {billing.services.map((s, idx) => (
                  <tr key={s.id} style={{ borderTop: idx !== 0 ? '1px solid var(--border-color)' : 'none', background: idx % 2 === 0 ? 'var(--surface-color)' : 'var(--bg-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-primary)', fontWeight: 600, verticalAlign: 'middle', lineHeight: 1.4 }}>{s.name}</td>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', textAlign: 'center', verticalAlign: 'middle' }}>
                      {s.staffAssignments && s.staffAssignments.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
                          {s.staffAssignments.map((assign, i) => (
                            <span key={i} style={{ background: 'var(--surface-hover)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                              {assign.staffName} ({formatCurrency(assign.amount)})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ background: 'var(--surface-hover)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>{s.serviceBy || '-'}</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-primary)', textAlign: 'center', fontWeight: 600, verticalAlign: 'middle' }}>{s.quantity}</td>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-secondary)', textAlign: 'right', verticalAlign: 'middle' }}>{formatCurrency(s.price)}</td>
                    <td style={{ padding: '1.25rem 1rem', color: 'var(--text-primary)', textAlign: 'right', fontWeight: 700, verticalAlign: 'middle', fontSize: '1.05rem' }}>{formatCurrency(s.price * s.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
            <div style={{ width: '100%', maxWidth: '380px', background: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(billing.subtotal)}</span>
              </div>
              {billing.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Discount</span>
                  <span style={{ color: 'var(--danger)', fontWeight: 600, background: 'var(--danger-bg)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>-{formatCurrency(billing.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-secondary)', paddingBottom: '1.25rem', borderBottom: '1px dashed var(--border-color)' }}>
                <span>Tax Amount</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>+{formatCurrency(billing.tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Grand Total</span>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{formatCurrency(billing.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: '2.5rem', borderTop: '2px dashed var(--border-color)', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Payment Method</h4>
              <span className={`badge ${
                billing.paymentMethod === 'Cash' ? 'badge-cash' :
                billing.paymentMethod === 'UPI' ? 'badge-upi' :
                billing.paymentMethod === 'Card' ? 'badge-card' :
                'badge-online'
              }`} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', boxShadow: 'var(--shadow-sm)' }}>
                {billing.paymentMethod}
              </span>
            </div>
            {billing.notes && (
              <div style={{ flex: 1, maxWidth: '400px', textAlign: 'right' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Notes</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>"{billing.notes}"</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
