import React, { useState } from 'react';
import type { Billing, ServiceItem, PaymentMethod, Staff } from '../../types';
import { X, Plus, Trash2, CheckCircle2, User, Scissors, CreditCard, Hash, Receipt } from 'lucide-react';
import { ServiceSelect } from './ServiceSelect';
import { format } from 'date-fns';

interface BillingFormProps {
  onSubmit: (billing: Billing) => void;
  onCancel: () => void;
  initialData?: Billing;
  staffs: Staff[];
}

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n || 0);

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ label, required, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', ...style }}>
    <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}{required && <span style={{ color: 'var(--danger)', marginLeft: '3px' }}>*</span>}
    </label>
    {children}
  </div>
);

const Section: React.FC<{ icon: React.ReactNode; title: string; accent: string; action?: React.ReactNode; children: React.ReactNode }> = ({ icon, title, accent, action, children }) => (
  <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-color)', background: `linear-gradient(to right, ${accent}08, transparent)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ color: accent, display: 'flex', padding: '0.4rem', background: `${accent}15`, borderRadius: '10px' }}>{icon}</div>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</span>
      </div>
      {action}
    </div>
    <div style={{ padding: '1.25rem' }}>{children}</div>
  </div>
);

export const BillingForm: React.FC<BillingFormProps> = ({ onSubmit, onCancel, initialData, staffs }) => {
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || '');
  const [billingDate, setBillingDate] = useState(
    initialData?.createdAt ? format(new Date(initialData.createdAt), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
  );
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
  const [staffSplits, setStaffSplits] = useState<{ [serviceId: string]: { [staffName: string]: number } }>(() => {
    if (!initialData) return {};
    const splits: { [serviceId: string]: { [staffName: string]: number } } = {};
    initialData.services.forEach(s => {
      if (s.staffAssignments && s.staffAssignments.length > 1) {
        splits[s.id] = Object.fromEntries(s.staffAssignments.map(a => [a.staffName, a.amount]));
      }
    });
    return splits;
  });

  const addService = () => setServices(prev => [...prev, { id: `s${Date.now()}`, name: '', price: 0, quantity: 1 }]);
  const removeService = (id: string) => services.length > 1 && setServices(prev => prev.filter(s => s.id !== id));
  const updateService = (id: string, field: keyof ServiceItem, value: any) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const subtotal = services.reduce((sum, s) => sum + (s.price || 0) * (s.quantity || 1), 0);
  const taxAmount = (subtotal - (discount || 0)) * ((taxPercentage || 0) / 100);
  const grandTotal = Math.max(0, subtotal - (discount || 0) + taxAmount);

  const handleSave = () => {
    if (!customerName.trim() || !mobileNumber.trim() || services.some(s => !s.name.trim())) {
      alert('Please fill Customer Name, Mobile, and all Service Names.');
      return;
    }
    const dateISO = new Date(billingDate).toISOString();
    const processedServices = services.filter(s => s.name.trim()).map(s => {
      const selected = s.serviceBy ? s.serviceBy.split(',').map(n => n.trim()).filter(Boolean) : [];
      const splits = staffSplits[s.id];
      
      if (selected.length > 1 && splits) {
        const total = Object.values(splits).reduce((sum, amt) => sum + amt, 0);
        const serviceTotal = s.price * s.quantity;
        if (Math.abs(total - serviceTotal) > 0.01) {
          alert(`Service "${s.name}" staff amounts must total ${fmt(serviceTotal)} (currently ${fmt(total)})`);
          throw new Error('Invalid split');
        }
        return {
          ...s,
          staffAssignments: selected.map(name => ({ staffName: name, amount: splits[name] || 0 }))
        };
      }
      return s;
    });
    
    onSubmit({
      id: initialData?.id || `b${Date.now()}`,
      serialNumber: initialData?.serialNumber || '',
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      services: processedServices,
      subtotal,
      discount: discount || 0,
      tax: taxAmount,
      grandTotal,
      paymentMethod,
      notes,
      createdAt: initialData?.createdAt ? initialData.createdAt : dateISO,
      updatedAt: new Date().toISOString(),
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

  return (
    <div className="animate-fade-in" style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '2rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <div style={{ padding: '0.5rem', background: 'color-mix(in srgb, var(--primary) 12%, transparent)', borderRadius: '12px', color: 'var(--primary)', display: 'flex' }}>
              <Receipt size={20} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {initialData ? 'Edit Invoice' : 'New Invoice'}
            </h2>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'var(--bg-color)', padding: '0.2rem 0.7rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', marginLeft: '0.25rem' }}>
            <Hash size={11} style={{ color: 'var(--primary)' }} />
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

        {/* Customer Details */}
        <Section icon={<User size={15} />} title="Customer Details" accent="var(--primary)">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem' }}>
            <Field label="Full Name" required>
              <input
                type="text"
                className="form-control"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Priya Sharma"
              />
            </Field>
            <Field label="Mobile Number" required>
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
            <Field label="Date">
              <input
                type="date"
                className="form-control"
                value={billingDate}
                onChange={e => setBillingDate(e.target.value)}
              />
            </Field>

          </div>
        </Section>

        {/* Services */}
        <Section
          icon={<Scissors size={15} />}
          title="Services Rendered"
          accent="#10b981"
          action={
            <button
              type="button"
              onClick={addService}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)',
                background: 'rgba(16,185,129,0.1)', color: '#10b981',
                border: '1px solid rgba(16,185,129,0.25)', cursor: 'pointer',
                fontSize: '0.78rem', fontWeight: 700, transition: 'all 0.18s',
              }}
            >
              <Plus size={14} /> Add Service
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {services.map((service, index) => (
              <div
                key={service.id}
                style={{
                  background: 'var(--bg-color)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.1rem',
                  position: 'relative',
                }}
              >
                {/* Row label + remove */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Service #{index + 1}
                  </span>
                  {services.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      style={{
                        background: 'var(--danger-bg)', color: 'var(--danger)',
                        border: '1px solid color-mix(in srgb, var(--danger) 20%, transparent)',
                        padding: '0.3rem 0.6rem', borderRadius: 'var(--radius-md)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.72rem', fontWeight: 600,
                      }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>

                {/* Service name */}
                <div style={{ marginBottom: '0.875rem' }}>
                  <ServiceSelect
                    value={service.name}
                    onChange={(name, price) => {
                      setServices(prev => prev.map(s =>
                        s.id === service.id ? { ...s, name, price } : s
                      ));
                      
                      // Also update staff splits if there are multiple staff selected
                      const selected = service.serviceBy ? service.serviceBy.split(',').map(n => n.trim()).filter(Boolean) : [];
                      if (selected.length > 1) {
                        const serviceTotal = price * (service.quantity || 1);
                        const evenSplit = Math.floor(serviceTotal / selected.length);
                        setStaffSplits(prev => ({
                          ...prev,
                          [service.id]: Object.fromEntries(
                            selected.map((n, i) => [n, i === selected.length - 1 ? serviceTotal - (evenSplit * (selected.length - 1)) : evenSplit])
                          )
                        }));
                      }
                    }}
                  />
                </div>

                {/* Price, Qty, Total + Staff */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  <Field label="Unit Price (₹)">
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>₹</span>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="0"
                        min="0"
                        value={service.price === 0 ? '' : service.price}
                        onChange={e => {
                          const newPrice = Number(e.target.value);
                          updateService(service.id, 'price', newPrice);
                          
                          const selected = service.serviceBy ? service.serviceBy.split(',').map(n => n.trim()).filter(Boolean) : [];
                          if (selected.length > 1) {
                            const serviceTotal = newPrice * (service.quantity || 1);
                            const evenSplit = Math.floor(serviceTotal / selected.length);
                            setStaffSplits(prev => ({
                              ...prev,
                              [service.id]: Object.fromEntries(
                                selected.map((n, i) => [n, i === selected.length - 1 ? serviceTotal - (evenSplit * (selected.length - 1)) : evenSplit])
                              )
                            }));
                          }
                        }}
                        style={{ paddingLeft: '1.75rem' }}
                      />
                    </div>
                  </Field>
                  <Field label="Quantity">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="1"
                      min="1"
                      value={service.quantity || ''}
                      onChange={e => {
                        const newQty = Number(e.target.value);
                        updateService(service.id, 'quantity', newQty);
                        
                        const selected = service.serviceBy ? service.serviceBy.split(',').map(n => n.trim()).filter(Boolean) : [];
                        if (selected.length > 1) {
                          const serviceTotal = (service.price || 0) * newQty;
                          const evenSplit = Math.floor(serviceTotal / selected.length);
                          setStaffSplits(prev => ({
                            ...prev,
                            [service.id]: Object.fromEntries(
                              selected.map((n, i) => [n, i === selected.length - 1 ? serviceTotal - (evenSplit * (selected.length - 1)) : evenSplit])
                            )
                          }));
                        }
                      }}
                      style={{ textAlign: 'center' }}
                    />
                  </Field>
                  <Field label="Item Total">
                    <div style={{
                      height: '100%', display: 'flex', alignItems: 'center',
                      background: 'color-mix(in srgb, #10b981 6%, var(--surface-color))',
                      border: '1px solid color-mix(in srgb, #10b981 20%, var(--border-color))',
                      borderRadius: 'var(--radius-md)',
                      padding: '0 0.85rem',
                      minHeight: '42px',
                    }}>
                      <span style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                        {fmt((service.price || 0) * (service.quantity || 1))}
                      </span>
                    </div>
                  </Field>
                </div>

                {/* Staff selector */}
                <Field label="Performed By">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.1rem' }}>
                    {staffs.filter(s => s.status === 'Active').map(s => {
                      const selected = service.serviceBy ? service.serviceBy.split(',').map(n => n.trim()).filter(Boolean) : [];
                      const isSelected = selected.includes(s.name);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            const newSelected = isSelected
                              ? selected.filter(n => n !== s.name)
                              : [...selected, s.name];
                            updateService(service.id, 'serviceBy', newSelected.join(', '));
                            
                            if (newSelected.length > 1) {
                              const serviceTotal = (service.price || 0) * (service.quantity || 1);
                              const evenSplit = Math.floor(serviceTotal / newSelected.length);
                              setStaffSplits(prev => ({
                                ...prev,
                                [service.id]: Object.fromEntries(
                                  newSelected.map((n, i) => [n, i === newSelected.length - 1 ? serviceTotal - (evenSplit * (newSelected.length - 1)) : evenSplit])
                                )
                              }));
                            } else {
                              setStaffSplits(prev => {
                                const { [service.id]: _, ...rest } = prev;
                                return rest;
                              });
                            }
                          }}
                          style={{
                            padding: '0.35rem 0.8rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: isSelected ? '1.5px solid var(--primary)' : '1.5px solid var(--border-color)',
                            background: isSelected ? 'color-mix(in srgb, var(--primary) 10%, var(--surface-color))' : 'var(--surface-color)',
                            color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                            transition: 'all 0.18s',
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                          }}
                        >
                          {isSelected && <CheckCircle2 size={12} />}
                          {s.name}
                        </button>
                      );
                    })}
                    {/* Show inactive staff that were already selected */}
                    {service.serviceBy && service.serviceBy.split(',').map(n => n.trim()).filter(n =>
                      n && !staffs.some(s => s.name === n && s.status === 'Active')
                    ).map(name => (
                      <button
                        key={`inactive-${name}`}
                        type="button"
                        onClick={() => {
                          const sel = service.serviceBy ? service.serviceBy.split(',').map(n => n.trim()).filter(Boolean) : [];
                          updateService(service.id, 'serviceBy', sel.filter(n => n !== name).join(', '));
                        }}
                        style={{
                          padding: '0.35rem 0.8rem', borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                          border: '1.5px solid var(--text-tertiary)',
                          background: 'color-mix(in srgb, var(--text-tertiary) 8%, transparent)',
                          color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.3rem',
                        }}
                        title="Inactive staff"
                      >
                        <CheckCircle2 size={12} /> {name} (Inactive)
                      </button>
                    ))}
                    {staffs.filter(s => s.status === 'Active').length === 0 && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No active staff members</span>
                    )}
                  </div>
                  
                  {(() => {
                    const selected = service.serviceBy ? service.serviceBy.split(',').map(n => n.trim()).filter(Boolean) : [];
                    if (selected.length <= 1) return null;
                    const splits = staffSplits[service.id] || {};
                    const total = Object.values(splits).reduce((sum, amt) => sum + amt, 0);
                    const serviceTotal = (service.price || 0) * (service.quantity || 1);
                    return (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--surface-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Split Amount (₹)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                          {selected.map((name) => (
                            <div key={name}>
                              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem', fontWeight: 600 }}>{name}</label>
                              <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.75rem' }}>₹</span>
                                <input
                                  type="number"
                                  className="form-control"
                                  min="0"
                                  max={serviceTotal}
                                  step="1"
                                  value={splits[name] || 0}
                                  onChange={e => {
                                    const newValue = Math.min(serviceTotal, Math.max(0, Number(e.target.value)));
                                    const otherStaff = selected.filter(n => n !== name);
                                    
                                    if (otherStaff.length === 1) {
                                      // Auto-calculate for the other staff member
                                      setStaffSplits(prev => ({
                                        ...prev,
                                        [service.id]: {
                                          [name]: newValue,
                                          [otherStaff[0]]: serviceTotal - newValue
                                        }
                                      }));
                                    } else {
                                      // More than 2 staff, just update this one
                                      setStaffSplits(prev => ({
                                        ...prev,
                                        [service.id]: { ...prev[service.id], [name]: newValue }
                                      }));
                                    }
                                  }}
                                  style={{ paddingLeft: '1.75rem', textAlign: 'center' }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', fontWeight: 600, color: Math.abs(total - serviceTotal) < 0.01 ? '#10b981' : 'var(--danger)' }}>Total: {fmt(total)} {Math.abs(total - serviceTotal) >= 0.01 && `(must = ${fmt(serviceTotal)})`}</div>
                      </div>
                    );
                  })()}
                </Field>
              </div>
            ))}
          </div>
        </Section>

        {/* Payment Details */}
        <Section icon={<CreditCard size={15} />} title="Payment & Notes" accent="#6366f1">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <Field label="Discount (₹)">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>₹</span>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  value={discount || ''}
                  onChange={e => setDiscount(Number(e.target.value))}
                  placeholder="0"
                  style={{ paddingLeft: '1.75rem' }}
                />
              </div>
            </Field>
            <Field label="Tax (%)">
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  max="100"
                  value={taxPercentage || ''}
                  onChange={e => setTaxPercentage(Number(e.target.value))}
                  placeholder="0"
                  style={{ paddingRight: '2rem' }}
                />
                <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '0.85rem', fontWeight: 600 }}>%</span>
              </div>
            </Field>
            <Field label="Payment Method" style={{ gridColumn: 'span 2' }}>
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
            <Field label="Notes / Remarks" style={{ gridColumn: '1 / -1' }}>
              <textarea
                className="form-control"
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Special requests, allergies, or remarks..."
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
          {/* Breakdown row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderBottom: '1px solid var(--border-color)',
          }}>
            {[
              { label: 'Subtotal', value: fmt(subtotal), color: 'var(--text-primary)' },
              { label: 'Discount', value: `−${fmt(discount || 0)}`, color: 'var(--danger)' },
              { label: `Tax (${taxPercentage || 0}%)`, value: `+${fmt(taxAmount)}`, color: 'var(--warning)' },
              { label: 'Grand Total', value: fmt(grandTotal), color: 'var(--primary)', large: true },
            ].map((row: any) => (
              <div key={row.label} style={{
                padding: '1rem 1.25rem',
                borderRight: '1px solid var(--border-color)',
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
                background: row.large ? 'color-mix(in srgb, var(--primary) 4%, var(--surface-color))' : undefined,
              }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: row.large ? '1.4rem' : '1.05rem', fontWeight: row.large ? 800 : 700, color: row.color, lineHeight: 1.1 }}>{row.value}</span>
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
              style={{ minWidth: '180px', padding: '0.65rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handleSave}
            >
              <CheckCircle2 size={17} />
              {initialData ? 'Update Invoice' : 'Confirm & Save'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
