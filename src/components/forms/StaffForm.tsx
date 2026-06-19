import React, { useState } from 'react';
import type { Staff, StaffRole, StaffStatus } from '../../types';
import { X, CheckCircle2, User, Phone, Shield, Calendar } from 'lucide-react';

interface StaffFormProps {
  onSubmit: (staff: Staff) => void;
  onCancel: () => void;
  initialData?: Staff;
}

const Field: React.FC<{ label: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ label, children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', ...style }}>
    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
    {children}
  </div>
);

export const StaffForm: React.FC<StaffFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [mobileNumber, setMobileNumber] = useState(initialData?.mobileNumber || '');
  const [role, setRole] = useState<StaffRole>(initialData?.role || 'Stylist');
  const [status, setStatus] = useState<StaffStatus>(initialData?.status || 'Active');
  const [joinDate, setJoinDate] = useState(initialData?.joinDate || new Date().toISOString().split('T')[0]);

  const handleSave = () => {
    if (!name || !mobileNumber) {
      alert('Please fill Name and Mobile Number.');
      return;
    }
    
    onSubmit({
      id: initialData?.id || `staff${Date.now()}`,
      name,
      mobileNumber,
      role,
      status,
      joinDate,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {initialData ? 'Edit Staff Member' : '✦ New Staff Member'}
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500, fontFamily: 'monospace', marginTop: '0.2rem' }}>
            {initialData ? initialData.serialNumber : 'Auto-assigned on save'}
          </div>
        </div>
        <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={onCancel}><X size={16} /></button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          
          <Field label="Full Name *">
            <div className="input-group" style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Jane Doe"
                style={{ paddingLeft: '2.5rem' }} 
              />
            </div>
          </Field>

          <Field label="Mobile Number *">
            <div className="input-group" style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                className="form-control"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </Field>

          <Field label="Role">
            <div className="input-group" style={{ position: 'relative' }}>
              <Shield size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <select 
                className="form-control" 
                value={role} 
                onChange={e => setRole(e.target.value as StaffRole)}
                style={{ paddingLeft: '2.5rem' }}
              >
                {['Stylist', 'Barber', 'Therapist', 'Manager', 'Other'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </Field>

          <Field label="Status">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['Active', 'Inactive'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  style={{
                    flex: 1, padding: '0.6rem', fontSize: '0.85rem', fontWeight: 600,
                    borderRadius: 'var(--radius-md)', border: '1px solid',
                    cursor: 'pointer', transition: 'all 0.15s',
                    borderColor: status === s ? (s === 'Active' ? 'var(--success)' : 'var(--danger)') : 'var(--border-color)',
                    background: status === s ? (s === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)') : 'transparent',
                    color: status === s ? (s === 'Active' ? 'var(--success)' : 'var(--danger)') : 'var(--text-secondary)',
                  }}
                >{s}</button>
              ))}
            </div>
          </Field>

          <Field label="Join Date">
            <div className="input-group" style={{ position: 'relative' }}>
              <Calendar size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="date" 
                className="form-control" 
                value={joinDate} 
                onChange={e => setJoinDate(e.target.value)}
                style={{ paddingLeft: '2.5rem' }} 
              />
            </div>
          </Field>

        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <CheckCircle2 size={16} style={{ marginRight: '6px' }} />
            {initialData ? 'Update Staff' : 'Save Staff'}
          </button>
        </div>
      </div>

    </div>
  );
};
