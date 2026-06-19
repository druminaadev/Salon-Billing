import React, { useState } from 'react';
import type { Billing, ServiceItem, PaymentMethod, Staff } from '../../types';
import { X, Plus, Trash2, CheckCircle2, User, Scissors, CreditCard, Hash } from 'lucide-react';
import { ServiceSelect } from './ServiceSelect';
import type { Gender } from '../../data/services';

interface BillingFormProps {
  onSubmit: (billing: Billing) => void;
  onCancel: () => void;
  initialData?: Billing;
  staffs: Staff[];
}

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const Field: React.FC<{ label: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ label, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', ...style }}>
    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
    {children}
  </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; accent: string; action?: React.ReactNode; children: React.ReactNode }> = ({ icon, title, accent, action, children }) => (
  <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', borderBottom: '1px solid var(--border-color)', background: `linear-gradient(135deg, ${accent}12, transparent)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ color: accent, display: 'flex', padding: '0.3rem', background: `${accent}18`, borderRadius: '7px' }}>{icon}</span>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</span>
      </div>
      {action}
    </div>
    <div style={{ padding: '1rem' }}>{children}</div>
  </div>
);

export const BillingForm: React.FC<BillingFormProps> = ({ onSubmit, onCancel, initialData, staffs }) => {
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || '');
  const [customerGender, setCustomerGender] = useState<Gender>(initialData?.customerGender || 'Male');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialData?.paymentMethod || 'Cash');
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [taxPercentage, setTaxPercentage] = useState(() => {
    if (initialData && initialData.subtotal > 0)
      return Math.round((initialData.tax / (initialData.subtotal - initialData.discount)) * 100);
    return 0;
  });
  const [services, setServices] = useState<ServiceItem[]>(
    initialData?.services.length ? initialData.services : [{ id: `s${Date.now()}`, name: '', price: 0, quantity: 1 }]
  );

  // serial number is auto-assigned by the DB (GENERATED ALWAYS AS IDENTITY)

  const addService = () => setServices([...services, { id: `s${Date.now()}`, name: '', price: 0, quantity: 1 }]);
  const removeService = (id: string) => services.length > 1 && setServices(services.filter(s => s.id !== id));
  const updateService = (id: string, field: keyof ServiceItem, value: any) =>
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));

  const subtotal = services.reduce((sum, s) => sum + (s.price || 0) * (s.quantity || 1), 0);
  const taxAmount = (subtotal - (discount || 0)) * ((taxPercentage || 0) / 100);
  const grandTotal = Math.max(0, subtotal - (discount || 0) + taxAmount);

  const handleSave = () => {
    if (!customerName || !mobileNumber || services.some(s => !s.name)) {
      alert('Please fill Customer Name, Mobile, and all Service Names.');
      return;
    }
    onSubmit({
      id: initialData?.id || `b${Date.now()}`,
      serialNumber: initialData?.serialNumber || '',  // DB assigns real number on insert
      customerName, mobileNumber, customerGender,
      services: services.filter(s => s.name.trim()),
      subtotal, discount: discount || 0, tax: taxAmount, grandTotal,
      paymentMethod, notes,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {initialData ? 'Edit Invoice' : '✦ New Billing'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <Hash size={11} style={{ color: 'var(--text-tertiary)' }} />
            <span style={{ fontSize: '0.73rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              {initialData ? initialData.serialNumber : 'Auto-assigned on save'}
            </span>
          </div>
        </div>
        <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={onCancel}><X size={16} /></button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Customer */}
        <Section icon={<User size={14} />} title="Customer" accent="var(--primary)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            <Field label="Full Name *">
              <input type="text" className="form-control" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Jane Doe" />
            </Field>
            <Field label="Mobile *">
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                className="form-control"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
              />
            </Field>
            <Field label="Gender">
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['Male', 'Female'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setCustomerGender(g)}
                    style={{
                      flex: 1, padding: '0.45rem', fontSize: '0.82rem', fontWeight: 600,
                      borderRadius: 'var(--radius-md)', border: '1px solid',
                      cursor: 'pointer', transition: 'all 0.15s',
                      borderColor: customerGender === g ? 'var(--primary)' : 'var(--border-color)',
                      background: customerGender === g ? 'var(--primary)' : 'transparent',
                      color: customerGender === g ? 'white' : 'var(--text-secondary)',
                    }}
                  >{g}</button>
                ))}
              </div>
            </Field>
          </div>
        </Section>

        {/* Services */}
        <Section
          icon={<Scissors size={14} />} title="Services" accent="#10B981"
          action={
            <button className="btn" onClick={addService} style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '0.3rem 0.75rem', fontSize: '0.78rem', gap: '0.3rem', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Plus size={13} /> Add Service
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {services.map(service => (
              <div key={service.id} style={{
                display: 'flex', flexDirection: 'column', gap: '1rem',
                background: 'var(--bg-color)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '1rem',
              }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Field label="Service Name">
                      <ServiceSelect gender={customerGender} value={service.name} onChange={(name, price) => {
                        setServices(prev => prev.map(s => s.id === service.id
                          ? { ...s, name, price: s.price === 0 ? price : s.price }
                          : s
                        ));
                      }} />
                    </Field>
                  </div>
                  {services.length > 1 ? (
                    <div style={{ paddingTop: '1.25rem' }}>
                      <button type="button" onClick={() => removeService(service.id)} style={{
                        background: 'var(--danger-bg)', color: 'var(--danger)', border: 'none',
                        padding: '0.6rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : null}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem', alignItems: 'flex-end' }}>
                  <Field label="Staff / Stylist" style={{ gridColumn: 'span 2' }}>
                    <select className="form-control" value={service.serviceBy || ''}
                      onChange={e => updateService(service.id, 'serviceBy', e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                      <option value="">Select Staff</option>
                      {staffs.filter(s => s.status === 'Active').map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                      {/* Fallback for existing data where staff might be inactive or custom */}
                      {service.serviceBy && !staffs.some(s => s.name === service.serviceBy && s.status === 'Active') && (
                        <option value={service.serviceBy}>{service.serviceBy}</option>
                      )}
                    </select>
                  </Field>
                  <Field label="Price">
                    <div className="input-group" style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>₹</span>
                      <input type="number" className="form-control" placeholder="0" min="0"
                        value={service.price === 0 ? '' : service.price}
                        onChange={e => updateService(service.id, 'price', Number(e.target.value))}
                        style={{ padding: '0.5rem 0.5rem 0.5rem 1.75rem', fontSize: '0.85rem' }} />
                    </div>
                  </Field>
                  <Field label="Qty">
                    <input type="number" className="form-control" placeholder="1" min="1"
                      value={service.quantity || ''}
                      onChange={e => updateService(service.id, 'quantity', Number(e.target.value))}
                      style={{ padding: '0.5rem', fontSize: '0.85rem', textAlign: 'center' }} />
                  </Field>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', padding: '0.3rem 0' }}>
                      {fmt((service.price || 0) * (service.quantity || 1))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Payment */}
        <Section icon={<CreditCard size={14} />} title="Payment & Adjustments" accent="var(--secondary)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.75rem' }}>
            <Field label="Discount (₹)">
              <input type="number" className="form-control" min="0" value={discount || ''} onChange={e => setDiscount(Number(e.target.value))} placeholder="0" />
            </Field>
            <Field label="Tax (%)">
              <input type="number" className="form-control" min="0" max="100" value={taxPercentage || ''} onChange={e => setTaxPercentage(Number(e.target.value))} placeholder="0" />
            </Field>
            <Field label="Payment Method">
              <select className="form-control" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}>
                {['Cash', 'UPI', 'Card', 'Bank Transfer', 'Online Payment'].map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Notes" style={{ gridColumn: '1 / -1' }}>
              <textarea className="form-control" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Special requests or notes..." style={{ resize: 'vertical' }} />
            </Field>
          </div>
        </Section>

        {/* Summary */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(236,72,153,0.04))',
          border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Subtotal', value: fmt(subtotal), color: 'var(--text-primary)' },
              { label: 'Discount', value: `-${fmt(discount)}`, color: 'var(--danger)' },
              { label: `Tax (${taxPercentage}%)`, value: `+${fmt(taxAmount)}`, color: 'var(--warning)' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: row.color, fontSize: '0.9rem' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Grand Total</span>
              <span style={{ fontSize: '1.7rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {fmt(grandTotal)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button className="btn btn-outline" style={{ minWidth: '80px' }} onClick={onCancel}>Cancel</button>
              <button className="btn btn-primary" style={{ minWidth: '150px' }} onClick={handleSave}>
                <CheckCircle2 size={15} /> {initialData ? 'Update' : 'Save Billing'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
