import React, { useState, useEffect } from 'react';
import type { Billing, ViewState, PaymentMethod, TimeframeFilter, Staff } from '../../types';
import { Download, FileText, FileSpreadsheet, Plus, Search, Filter, X, Eye, Edit, Trash2, ReceiptText, ChevronLeft, ChevronRight, IndianRupee, Receipt, TrendingUp, CreditCard } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import { BillingView } from './BillingView';

interface BillingsProps {
  billings: Billing[];
  staffs: Staff[];
  onNavigate: (view: ViewState) => void;
  globalTimeframe: TimeframeFilter;
  currentView?: ViewState;
  selectedBilling?: Billing | null;
  onView: (billing: Billing) => void;
  onEdit: (billing: Billing) => void;
  onDelete: (id: string) => void;
}

export const Billings: React.FC<BillingsProps> = ({ billings, staffs, onNavigate, globalTimeframe, currentView, selectedBilling, onView, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | ''>('');
  const [staffFilter, setStaffFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, paymentFilter, staffFilter, minAmount, maxAmount, startDate, endDate, globalTimeframe]);

  useEffect(() => {
    const today = new Date();
    if (globalTimeframe === 'today') {
      setStartDate(format(today, 'yyyy-MM-dd'));
      setEndDate(format(today, 'yyyy-MM-dd'));
    } else if (globalTimeframe === 'week') {
      setStartDate(format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'));
      setEndDate(format(today, 'yyyy-MM-dd'));
    } else if (globalTimeframe === 'month') {
      setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
      setEndDate(format(today, 'yyyy-MM-dd'));
    } else if (globalTimeframe === 'all') {
      setStartDate('');
      setEndDate('');
    }
  }, [globalTimeframe]);

  const getDateOnly = (value: string) => value.slice(0, 10);

  const filteredBillings = billings.filter(b => {
    const matchesSearch =
      b.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobileNumber.includes(searchTerm) ||
      b.services.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPayment = paymentFilter ? b.paymentMethod === paymentFilter : true;

    const matchesStaff = staffFilter ? b.services.some(s => {
      if (s.staffAssignments && s.staffAssignments.length > 0) {
        return s.staffAssignments.some(a => a.staffName === staffFilter);
      }
      return s.serviceBy === staffFilter;
    }) : true;

    const matchesMinAmount = minAmount ? b.grandTotal >= Number(minAmount) : true;
    const matchesMaxAmount = maxAmount ? b.grandTotal <= Number(maxAmount) : true;

    let matchesDate = true;
    if (startDate || endDate) {
      const invoiceDate = getDateOnly(b.createdAt);
      if (startDate && invoiceDate < startDate) matchesDate = false;
      if (endDate && invoiceDate > endDate) matchesDate = false;
    }

    return matchesSearch && matchesPayment && matchesStaff && matchesMinAmount && matchesMaxAmount && matchesDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getExportData = () => {
    const headers = ['Serial No', 'Date', 'Time', 'Customer', 'Mobile', 'Services', 'Amount', 'Payment Method'];
    const data = filteredBillings.map(b => [
      b.serialNumber,
      format(new Date(b.createdAt), 'yyyy-MM-dd'),
      format(new Date(b.createdAt), 'HH:mm'),
      b.customerName,
      b.mobileNumber,
      b.services.map(s => s.name).join(', '),
      b.grandTotal,
      b.paymentMethod
    ]);
    return { headers, data };
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setPaymentFilter('');
    setStaffFilter('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
  };

  // Filename: billings_YYYY-MM-DD  (or billings_YYYY-MM-DD_to_YYYY-MM-DD for a range)
  const getFilename = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (startDate && endDate && startDate !== endDate) {
      return `billings_${startDate}_to_${endDate}`;
    }
    return `billings_${startDate || today}`;
  };

  const totalRevenue = filteredBillings.reduce((sum, b) => sum + b.grandTotal, 0);
  const avgInvoice = filteredBillings.length ? totalRevenue / filteredBillings.length : 0;
  const cashCount = filteredBillings.filter(b => b.paymentMethod === 'Cash').length;
  const upiCount = filteredBillings.filter(b => b.paymentMethod === 'UPI').length;

  const isSplitPane = currentView === 'view-billing' && selectedBilling;

  const totalPages = Math.ceil(filteredBillings.length / itemsPerPage);
  const paginatedBillings = filteredBillings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`animate-fade-in ${isSplitPane ? 'split-pane-container' : ''}`}>
      <div className={isSplitPane ? 'split-pane-list' : ''}>
        <div className="topbar">
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>Billings Management</h1>
            <p>Manage your salon's invoices and daily income.</p>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('new-billing')}>
            <Plus size={18} /> New Billing
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Revenue</h3>
              <div style={{ padding: '0.4rem', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--primary)', borderRadius: '8px' }}><IndianRupee size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(totalRevenue)}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--primary)', opacity: 0.8 }} />
          </div>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Invoices</h3>
              <div style={{ padding: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', borderRadius: '8px' }}><Receipt size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{filteredBillings.length} <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>invoices</span></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: '#6366f1', opacity: 0.8 }} />
          </div>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Invoice</h3>
              <div style={{ padding: '0.4rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}><TrendingUp size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(avgInvoice)}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--success)', opacity: 0.8 }} />
          </div>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cash / UPI</h3>
              <div style={{ padding: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderRadius: '8px' }}><CreditCard size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cashCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {upiCount} UPI</span></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: '#f59e0b', opacity: 0.8 }} />
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>

            <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: '350px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search invoices..."
                  style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)', border: '1px solid color-mix(in srgb, var(--primary) 30%, var(--border-color))', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.25rem' }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} /> Filters
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-icon" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '36px', height: '36px' }} onClick={() => exportToPDF('Billings Report', getExportData().headers, getExportData().data, getFilename())} title="Export PDF">
                <FileText size={16} color="var(--danger)" />
              </button>
              <button className="btn-icon" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '36px', height: '36px' }} onClick={() => exportToCSV(getExportData().headers, getExportData().data, getFilename())} title="Export CSV">
                <Download size={16} color="var(--text-secondary)" />
              </button>
              <button className="btn-icon" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '36px', height: '36px' }} onClick={() => exportToExcel(getExportData().headers, getExportData().data, getFilename(), 'Billings')} title="Export Excel">
                <FileSpreadsheet size={16} color="var(--success)" />
              </button>
            </div>
          </div>

          {showFilters && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div>
                <label className="form-label">Payment Method</label>
                <select className="form-control" value={paymentFilter} onChange={e => setPaymentFilter(e.target.value as PaymentMethod | '')}>
                  <option value="">All Methods</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Online Payment">Online Payment</option>
                </select>
              </div>
              <div>
                <label className="form-label">Staff Member</label>
                <select className="form-control" value={staffFilter} onChange={e => setStaffFilter(e.target.value)}>
                  <option value="">All Staff</option>
                  {staffs.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div>
                  <label className="form-label">Min Amount (₹)</label>
                  <input type="number" className="form-control" style={{ width: '120px' }} value={minAmount} onChange={e => setMinAmount(e.target.value)} />
                </div>
                <div style={{ paddingBottom: '0.75rem', color: 'var(--text-secondary)' }}>-</div>
                <div>
                  <label className="form-label">Max Amount (₹)</label>
                  <input type="number" className="form-control" style={{ width: '120px' }} value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div>
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div style={{ paddingBottom: '0.75rem', color: 'var(--text-secondary)' }}>-</div>
                <div>
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Chips */}
          {(paymentFilter || staffFilter || minAmount || maxAmount || searchTerm || startDate || endDate) && (
            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Active Filters:</span>
              {searchTerm && <div className="filter-chip">Search: {searchTerm} <button onClick={() => setSearchTerm('')}><X size={14} /></button></div>}
              {paymentFilter && <div className="filter-chip">Payment: {paymentFilter} <button onClick={() => setPaymentFilter('')}><X size={14} /></button></div>}
              {staffFilter && <div className="filter-chip">Staff: {staffFilter} <button onClick={() => setStaffFilter('')}><X size={14} /></button></div>}
              {minAmount && <div className="filter-chip">Min ₹{minAmount} <button onClick={() => setMinAmount('')}><X size={14} /></button></div>}
              {maxAmount && <div className="filter-chip">Max ₹{maxAmount} <button onClick={() => setMaxAmount('')}><X size={14} /></button></div>}
              {startDate && <div className="filter-chip">From: {startDate} <button onClick={() => setStartDate('')}><X size={14} /></button></div>}
              {endDate && <div className="filter-chip">To: {endDate} <button onClick={() => setEndDate('')}><X size={14} /></button></div>}
              <button className="btn" style={{ background: 'none', color: 'var(--primary)', padding: '0.25rem 0.5rem' }} onClick={clearAllFilters}>Clear All</button>
            </div>
          )}
        </div>

        <div className="table-container" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', border: 'none' }}>
          <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead style={{ background: 'color-mix(in srgb, var(--primary) 5%, var(--surface-color))' }}>
              <tr>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Invoice</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date & Time</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Customer</th>
                {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Staff</th>}
                {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Services</th>}
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Amount</th>
                {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Payment</th>}
                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBillings.map(b => (
                <tr key={b.id} style={{
                  background: isSplitPane && selectedBilling?.id === b.id ? 'var(--surface-hover)' : 'var(--surface-color)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                  onClick={(e) => {
                    // Ignore clicks on buttons so they don't trigger row selection unexpectedly
                    if ((e.target as HTMLElement).closest('button')) return;
                    onView(b);
                  }}
                  className="hover:bg-opacity-80"
                >
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.875rem' }}>{b.serialNumber}</div>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{format(new Date(b.createdAt), 'MMM dd, yyyy')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{format(new Date(b.createdAt), 'hh:mm a')}</div>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{b.mobileNumber}</div>
                  </td>
                  {!isSplitPane && (
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {Array.from(new Set(
                          b.services.flatMap(s => {
                            if (s.staffAssignments && s.staffAssignments.length > 0) {
                              return s.staffAssignments.map(a => a.staffName);
                            }
                            return s.serviceBy ? [s.serviceBy] : [];
                          })
                        )).map((staffName, i) => (
                          <span key={i} className="badge" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', background: 'var(--surface-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                            {staffName}
                          </span>
                        ))}
                        {b.services.every(s => !s.serviceBy && (!s.staffAssignments || s.staffAssignments.length === 0)) && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>-</span>
                        )}
                      </div>
                    </td>
                  )}
                  {!isSplitPane && (
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {b.services.map(s => (
                          <span key={s.id} title={s.name} className="badge badge-neutral" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', border: '1px solid color-mix(in srgb, var(--primary) 15%, var(--border-color))', background: 'color-mix(in srgb, var(--primary) 2%, transparent)', maxWidth: '200px', display: 'inline-flex', alignItems: 'center' }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
                            <span style={{ opacity: 0.6, marginLeft: '4px', flexShrink: 0 }}>x{s.quantity}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{formatCurrency(b.grandTotal)}</div>
                  </td>
                  {!isSplitPane && (
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${b.paymentMethod === 'Cash' ? 'badge-cash' :
                        b.paymentMethod === 'UPI' ? 'badge-upi' :
                          b.paymentMethod === 'Card' ? 'badge-card' :
                            'badge-online'
                        }`} style={{ padding: '0.3rem 0.8rem' }}>
                        {b.paymentMethod}
                      </span>
                    </td>
                  )}
                  <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--primary)' }}
                        title="View"
                        onClick={() => onView(b)}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Edit"
                        onClick={() => onEdit(b)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        style={{ color: 'var(--danger)' }}
                        title="Delete"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
                            onDelete(b.id);
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBillings.length === 0 && (
                <tr>
                  <td colSpan={isSplitPane ? 5 : 8}>
                    <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '4rem 1rem' }}>
                      <ReceiptText size={48} style={{ opacity: 0.2, marginBottom: '1rem', color: 'var(--primary)' }} />
                      <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No invoices found</h3>
                      <p style={{ marginTop: '0.5rem', maxWidth: '300px', margin: '0.5rem auto 0' }}>Try adjusting your filters or create a new invoice to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {filteredBillings.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem 1.5rem',
              background: 'var(--surface-color)',
              borderTop: '1px solid color-mix(in srgb, var(--border-color) 40%, transparent)',
            }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredBillings.length)} of {filteredBillings.length}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  style={{
                    background: 'none', border: 'none', cursor: currentPage === 1 ? 'default' : 'pointer',
                    color: currentPage === 1 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem',
                    outline: 'none'
                  }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      const isActive = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          style={{
                            background: isActive ? 'var(--primary)' : 'transparent',
                            color: isActive ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none'
                          }}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} style={{ color: 'var(--text-secondary)', padding: '0 4px' }}>...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  style={{
                    background: 'none', border: 'none', cursor: currentPage === totalPages || totalPages === 0 ? 'default' : 'pointer',
                    color: currentPage === totalPages || totalPages === 0 ? 'var(--text-tertiary)' : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.25rem',
                    outline: 'none'
                  }}
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSplitPane && (
        <div className="split-pane-detail animate-fade-in">
          {selectedBilling ? (
            <BillingView billing={selectedBilling} onBack={() => onNavigate('billings')} />
          ) : (
            <div className="split-pane-empty">
              <p>Select an invoice to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
