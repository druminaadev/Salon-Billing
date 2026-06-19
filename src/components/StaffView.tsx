import React from 'react';
import type { Staff, Billing, TimeframeFilter } from '../types';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import { ArrowLeft, Briefcase, Scissors, TrendingUp, Calendar, Phone, ShieldCheck, UserX } from 'lucide-react';

interface StaffViewProps {
  staff: Staff;
  billings: Billing[];
  globalTimeframe: TimeframeFilter;
  onBack: () => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ staff, billings, globalTimeframe, onBack }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  // Filter billings based on globalTimeframe
  const filteredBillings = billings.filter(b => {
    if (globalTimeframe === 'all') return true;
    const bDate = new Date(b.createdAt);
    bDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (globalTimeframe === 'today') {
      return bDate.getTime() === today.getTime();
    } else if (globalTimeframe === 'week') {
      const start = startOfWeek(today, { weekStartsOn: 1 });
      return bDate >= start && bDate <= today;
    } else if (globalTimeframe === 'month') {
      const start = startOfMonth(today);
      return bDate >= start && bDate <= today;
    }
    return true;
  });

  // Calculate Performance from filtered billings
  let totalRevenue = 0;
  let servicesCompleted = 0;
  const serviceBreakdown: Record<string, { count: number; revenue: number }> = {};

  filteredBillings.forEach(billing => {
    billing.services.forEach(service => {
      // Check if this service was performed by the current staff
      if (service.serviceBy === staff.name) {
        const itemRevenue = (service.price || 0) * (service.quantity || 1);
        totalRevenue += itemRevenue;
        servicesCompleted += (service.quantity || 1);

        if (!serviceBreakdown[service.name]) {
          serviceBreakdown[service.name] = { count: 0, revenue: 0 };
        }
        serviceBreakdown[service.name].count += (service.quantity || 1);
        serviceBreakdown[service.name].revenue += itemRevenue;
      }
    });
  });

  const breakdownArray = Object.entries(serviceBreakdown)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue); // sort by revenue descending

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={onBack}>
          <ArrowLeft size={18} style={{ marginRight: '6px' }} /> Back to Staff
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Column: Staff Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--primary)' }} />
            
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold',
              margin: '0 auto 1rem auto', boxShadow: 'var(--shadow-md)'
            }}>
              {staff.name.charAt(0).toUpperCase()}
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
              {staff.name}
            </h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span className="badge badge-neutral" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>{staff.serialNumber}</span>
              <span className="badge badge-neutral" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>{staff.role}</span>
              {staff.status === 'Active' ? (
                <span className="badge badge-success" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> Active</span>
              ) : (
                <span className="badge badge-danger" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}><UserX size={14} /> Inactive</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{staff.mobileNumber}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Calendar size={16} color="var(--text-secondary)" />
                <span style={{ color: 'var(--text-secondary)' }}>Joined: {format(new Date(staff.joinDate), 'MMMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Performance Summary</h3>
            <span className="badge badge-neutral" style={{ padding: '0.4rem 0.8rem' }}>
              {globalTimeframe.charAt(0).toUpperCase() + globalTimeframe.slice(1)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), transparent)' }}>
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--primary)' }}><TrendingUp size={20} /></div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>{formatCurrency(totalRevenue)}</div>
              <div className="stat-label">Revenue Generated</div>
            </div>
            
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), transparent)' }}>
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)' }}><Scissors size={20} /></div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>{servicesCompleted}</div>
              <div className="stat-label">Services Completed</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Briefcase size={18} color="var(--text-secondary)" />
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Services Breakdown</h4>
            </div>

            {breakdownArray.length > 0 ? (
              <table className="table" style={{ background: 'transparent' }}>
                <thead>
                  <tr>
                    <th style={{ paddingLeft: 0 }}>Service Name</th>
                    <th style={{ textAlign: 'center' }}>Qty</th>
                    <th style={{ textAlign: 'right', paddingRight: 0 }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownArray.map((item, index) => (
                    <tr key={index}>
                      <td style={{ paddingLeft: 0, fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-neutral">{item.count}</span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 0, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatCurrency(item.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No services performed in the selected timeframe.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
