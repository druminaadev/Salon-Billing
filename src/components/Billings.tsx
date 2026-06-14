import React, { useState, useEffect } from 'react';
import type { Billing, ViewState, PaymentMethod, TimeframeFilter } from '../types';
import { Download, FileText, FileSpreadsheet, Plus, Search, Filter, X, Eye, Edit, Trash2 } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { format, startOfWeek, startOfMonth } from 'date-fns';

interface BillingsProps {
  billings: Billing[];
  onNavigate: (view: ViewState) => void;
  globalTimeframe: TimeframeFilter;
  onView: (billing: Billing) => void;
  onEdit: (billing: Billing) => void;
  onDelete: (id: string) => void;
}

export const Billings: React.FC<BillingsProps> = ({ billings, onNavigate, globalTimeframe, onView, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | ''>('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredBillings = billings.filter(b => {
    const matchesSearch = 
      b.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.mobileNumber.includes(searchTerm) ||
      b.services.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPayment = paymentFilter ? b.paymentMethod === paymentFilter : true;
    const matchesMinAmount = minAmount ? b.grandTotal >= Number(minAmount) : true;
    const matchesMaxAmount = maxAmount ? b.grandTotal <= Number(maxAmount) : true;

    let matchesDate = true;
    if (startDate || endDate) {
      const bDate = new Date(b.createdAt);
      bDate.setHours(0, 0, 0, 0);
      if (startDate) {
        const sDate = new Date(startDate);
        sDate.setHours(0, 0, 0, 0);
        if (bDate < sDate) matchesDate = false;
      }
      if (endDate) {
        const eDate = new Date(endDate);
        eDate.setHours(0, 0, 0, 0);
        if (bDate > eDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesPayment && matchesMinAmount && matchesMaxAmount && matchesDate;
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

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Billings Management</h1>
          <p>Manage your salon's invoices and daily income.</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('new-billing')}>
          <Plus size={18} /> New Billing
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
            <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by ID, Name, Mobile, or Service..." 
                style={{ paddingLeft: '2.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={18} /> Filters
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => exportToPDF('Billings Report', getExportData().headers, getExportData().data, getFilename())} title="Export PDF">
              <FileText size={18} color="var(--danger)" /> PDF
            </button>
            <button className="btn btn-outline" onClick={() => exportToCSV(getExportData().headers, getExportData().data, getFilename())} title="Export CSV">
              <Download size={18} color="var(--text-secondary)" /> CSV
            </button>
            <button className="btn btn-outline" onClick={() => exportToExcel(getExportData().headers, getExportData().data, getFilename(), 'Billings')} title="Export Excel">
              <FileSpreadsheet size={18} color="var(--success)" /> Excel
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
        {(paymentFilter || minAmount || maxAmount || searchTerm || startDate || endDate) && (
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Active Filters:</span>
            {searchTerm && <div className="filter-chip">Search: {searchTerm} <button onClick={() => setSearchTerm('')}><X size={14} /></button></div>}
            {paymentFilter && <div className="filter-chip">Payment: {paymentFilter} <button onClick={() => setPaymentFilter('')}><X size={14} /></button></div>}
            {minAmount && <div className="filter-chip">Min ₹{minAmount} <button onClick={() => setMinAmount('')}><X size={14} /></button></div>}
            {maxAmount && <div className="filter-chip">Max ₹{maxAmount} <button onClick={() => setMaxAmount('')}><X size={14} /></button></div>}
            {startDate && <div className="filter-chip">From: {startDate} <button onClick={() => setStartDate('')}><X size={14} /></button></div>}
            {endDate && <div className="filter-chip">To: {endDate} <button onClick={() => setEndDate('')}><X size={14} /></button></div>}
            <button className="btn" style={{ background: 'none', color: 'var(--primary)', padding: '0.25rem 0.5rem' }} onClick={clearAllFilters}>Clear All</button>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Date & Time</th>
              <th>Customer</th>
              <th>Services</th>
              <th>Amount</th>
              <th>Payment</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBillings.map(b => (
              <tr key={b.id}>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{b.serialNumber}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{format(new Date(b.createdAt), 'MMM dd, yyyy')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{format(new Date(b.createdAt), 'HH:mm')}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{b.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{b.mobileNumber}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {b.services.map(s => (
                      <span key={s.id} className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{s.name} (x{s.quantity})</span>
                    ))}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(b.grandTotal)}</td>
                <td><span className="badge badge-neutral">{b.paymentMethod}</span></td>
                <td style={{ textAlign: 'right' }}>
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
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                  No billings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
