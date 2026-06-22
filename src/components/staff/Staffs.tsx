import React, { useState } from 'react';
import type { Staff, ViewState, Billing, TimeframeFilter } from '../../types';
import { Plus, Search, Eye, Edit, Trash2, ShieldCheck, UserX, Users, TrendingUp, Scissors, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import { StaffView } from './StaffView';

interface StaffsProps {
  staffs: Staff[];
  billings: Billing[];
  globalTimeframe: TimeframeFilter;
  currentView?: ViewState;
  selectedStaff?: Staff | null;
  onNavigate: (view: ViewState) => void;
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onDelete: (id: string) => void;
}

export const Staffs: React.FC<StaffsProps> = ({ staffs, billings, globalTimeframe, currentView, selectedStaff, onNavigate, onView, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredStaffs = staffs.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobileNumber.includes(searchTerm);
    const matchesRole = roleFilter ? s.role === roleFilter : true;
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    const matchesName = nameFilter ? s.name === nameFilter : true;
    return matchesSearch && matchesRole && matchesStatus && matchesName;
  });

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

  // Calculate dashboard stats based on the currently FILTERED staff
  const activeStaffCount = filteredStaffs.filter(s => s.status === 'Active').length;
  let totalRevenue = 0;
  let totalServices = 0;

  filteredBillings.forEach(b => {
    b.services.forEach(s => {
      if (s.staffAssignments && s.staffAssignments.length > 0) {
        s.staffAssignments.forEach(assign => {
          if (filteredStaffs.some(staff => staff.name === assign.staffName)) {
            totalRevenue += assign.amount;
          }
        });
        // Count service only once even if multiple staff worked on it
        if (s.staffAssignments.some(assign => filteredStaffs.some(staff => staff.name === assign.staffName))) {
          totalServices += (s.quantity || 1);
        }
      } else if (s.serviceBy && filteredStaffs.some(staff => staff.name === s.serviceBy)) {
        totalRevenue += (s.price || 0) * (s.quantity || 1);
        totalServices += (s.quantity || 1);
      }
    });
  });

  const isSplitPane = currentView === 'view-staff' && selectedStaff;
  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
  const paginatedStaffs = filteredStaffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`animate-fade-in ${isSplitPane ? 'split-pane-container' : ''}`}>
      <div className={isSplitPane ? 'split-pane-list' : ''}>
        <div className="topbar">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Staff Management</h1>
          <p>Manage your salon team and view their performance.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('new-staff')}>
          <Plus size={18} /> Add Staff
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Staff</h3>
            <div style={{ padding: '0.4rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--primary)', borderRadius: '8px' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {activeStaffCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {staffs.length} total</span>
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--primary)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff Revenue ({globalTimeframe})</h3>
            <div style={{ padding: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', borderRadius: '8px' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: '#6366f1', opacity: 0.8 }} />
        </div>

        <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services Delivered ({globalTimeframe})</h3>
            <div style={{ padding: '0.4rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}>
              <Scissors size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {totalServices}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--success)', opacity: 0.8 }} />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search staff..."
              style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)', border: '1px solid color-mix(in srgb, var(--primary) 30%, var(--border-color))', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <select className="form-control" value={nameFilter} onChange={e => setNameFilter(e.target.value)}>
              <option value="">All Staff</option>
              {staffs.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <select className="form-control" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="">All Roles</option>
              <option value="Stylist">Stylist</option>
              <option value="Barber">Barber</option>
              <option value="Therapist">Therapist</option>
              <option value="Manager">Manager</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <select className="form-control" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', border: 'none' }}>
        <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead style={{ background: 'color-mix(in srgb, var(--primary) 5%, var(--surface-color))' }}>
            <tr>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ID</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
              {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Role</th>}
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Contact</th>
              <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
              {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Joined Date</th>}
              <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStaffs.map(s => (
              <tr key={s.id}
                style={{
                  opacity: s.status === 'Inactive' ? 0.6 : 1,
                  background: isSplitPane && selectedStaff?.id === s.id ? 'var(--surface-hover)' : 'var(--surface-color)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={(evt) => { if ((evt.target as HTMLElement).closest('button')) return; onView(s); }}
              >
                <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.875rem' }}>{s.serialNumber}</div>
                </td>
                <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                </td>
                {!isSplitPane && <td style={{ padding: '1rem', verticalAlign: 'middle' }}><span className="badge badge-neutral" style={{ padding: '0.3rem 0.8rem' }}>{s.role}</span></td>}
                <td style={{ padding: '1rem', verticalAlign: 'middle', color: 'var(--text-secondary)' }}>{s.mobileNumber}</td>
                <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                  {s.status === 'Active' ? (
                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.3rem 0.8rem' }}><ShieldCheck size={12} /> Active</span>
                  ) : (
                    <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.3rem 0.8rem' }}><UserX size={12} /> Inactive</span>
                  )}
                </td>
                {!isSplitPane && <td style={{ padding: '1rem', verticalAlign: 'middle', color: 'var(--text-secondary)' }}>{format(new Date(s.joinDate), 'MMM dd, yyyy')}</td>}
                <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn-icon" style={{ color: 'var(--primary)' }} onClick={() => onView(s)} title="View Details"><Eye size={18} /></button>
                    <button className="btn-icon" style={{ color: 'var(--text-secondary)' }} onClick={() => onEdit(s)} title="Edit"><Edit size={18} /></button>
                    <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => { if (window.confirm('Are you sure you want to delete this staff member?')) onDelete(s.id); }} title="Delete"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStaffs.length === 0 && (
              <tr>
                <td colSpan={isSplitPane ? 4 : 6}>
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '4rem 1rem' }}>
                    <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem', color: 'var(--primary)' }} />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No staff members found</h3>
                    <p style={{ marginTop: '0.5rem', maxWidth: '300px', margin: '0.5rem auto 0' }}>Try adjusting your search or add a new staff member to your team.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {filteredStaffs.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--surface-color)', borderTop: '1px solid color-mix(in srgb, var(--border-color) 40%, transparent)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredStaffs.length)} of {filteredStaffs.length}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer', color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', outline: 'none' }} disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                    const isActive = currentPage === pageNum;
                    return (
                      <button key={pageNum} style={{ background: isActive ? 'var(--primary)' : 'transparent', color: isActive ? 'white' : 'var(--text-secondary)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: isActive ? 600 : 500, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s ease', outline: 'none' }} onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} style={{ color: 'var(--text-secondary)', padding: '0 4px' }}>...</span>;
                  }
                  return null;
                })}
              </div>
              <button style={{ background: 'none', border: 'none', cursor: currentPage === totalPages || totalPages === 0 ? 'default' : 'pointer', color: currentPage === totalPages || totalPages === 0 ? 'var(--text-tertiary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem', outline: 'none' }} disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      {isSplitPane && (
        <div className="split-pane-detail animate-fade-in">
          {selectedStaff ? (
            <StaffView
              staff={selectedStaff}
              billings={billings}
              globalTimeframe={globalTimeframe}
              onBack={() => onNavigate('staff')}
            />
          ) : (
            <div className="split-pane-empty">
              <p>Select a staff member to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
