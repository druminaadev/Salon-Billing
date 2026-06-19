import React, { useState, useEffect } from 'react';
import type { Expense, ViewState, PaymentMethod, ExpensePriority, TimeframeFilter } from '../types';
import { Download, FileText, FileSpreadsheet, Plus, Search, Filter, X, Eye, Edit, Trash2, Wallet } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../utils/exportUtils';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import { ExpenseView } from './ExpenseView';

interface ExpensesProps {
  expenses: Expense[];
  onNavigate: (view: ViewState) => void;
  globalTimeframe: TimeframeFilter;
  currentView?: ViewState;
  selectedExpense?: Expense | null;
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const DEFAULT_CATEGORIES = [
  'Product Purchase', 'Staff Salary', 'Rent', 'Electricity', 'Water', 
  'Internet', 'Marketing', 'Equipment', 'Maintenance', 'Miscellaneous'
];

export const Expenses: React.FC<ExpensesProps> = ({ expenses, onNavigate, globalTimeframe, currentView, selectedExpense, onView, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<ExpensePriority | ''>('');
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

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = 
      e.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter ? e.category === categoryFilter : true;
    const matchesPayment = paymentFilter ? e.paymentMethod === paymentFilter : true;
    const matchesPriority = priorityFilter ? e.priority === priorityFilter : true;
    const matchesMinAmount = minAmount ? e.amount >= Number(minAmount) : true;
    const matchesMaxAmount = maxAmount ? e.amount <= Number(maxAmount) : true;

    let matchesDate = true;
    if (startDate || endDate) {
      const eDate = new Date(e.date);
      eDate.setHours(0, 0, 0, 0);
      if (startDate) {
        const sDate = new Date(startDate);
        sDate.setHours(0, 0, 0, 0);
        if (eDate < sDate) matchesDate = false;
      }
      if (endDate) {
        const enDate = new Date(endDate);
        enDate.setHours(0, 0, 0, 0);
        if (eDate > enDate) matchesDate = false;
      }
    }

    return matchesSearch && matchesCategory && matchesPayment && matchesPriority && matchesMinAmount && matchesMaxAmount && matchesDate;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getExportData = () => {
    const headers = ['Serial No', 'Date', 'Title', 'Category', 'Vendor', 'Amount', 'Payment Method', 'Priority'];
    const data = filteredExpenses.map(e => [
      e.serialNumber,
      format(new Date(e.date), 'yyyy-MM-dd'),
      e.title,
      e.category,
      e.vendorName,
      e.amount,
      e.paymentMethod,
      e.priority
    ]);
    return { headers, data };
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setPaymentFilter('');
    setPriorityFilter('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setEndDate(format(new Date(), 'yyyy-MM-dd'));
  };

  // Filename: expenses_YYYY-MM-DD  (or expenses_YYYY-MM-DD_to_YYYY-MM-DD for a range)
  const getFilename = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (startDate && endDate && startDate !== endDate) {
      return `expenses_${startDate}_to_${endDate}`;
    }
    return `expenses_${startDate || today}`;
  };

  const isSplitPane = currentView === 'view-expense' && selectedExpense;

  return (
    <div className={`animate-fade-in ${isSplitPane ? 'split-pane-container' : ''}`}>
      <div className={isSplitPane ? 'split-pane-list' : ''}>
        <div className="topbar">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Expenses Management</h1>
          <p>Track and manage your salon's outgoing costs.</p>
        </div>
        <button className="btn btn-primary" style={{ background: 'var(--danger)' }} onClick={() => onNavigate('new-expense')}>
          <Plus size={18} /> New Expense
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
                placeholder="Search by ID, Title, Vendor..." 
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
            <button className="btn btn-outline" onClick={() => exportToPDF('Expenses Report', getExportData().headers, getExportData().data, getFilename())} title="Export PDF">
              <FileText size={18} color="var(--danger)" /> PDF
            </button>
            <button className="btn btn-outline" onClick={() => exportToCSV(getExportData().headers, getExportData().data, getFilename())} title="Export CSV">
              <Download size={18} color="var(--text-secondary)" /> CSV
            </button>
            <button className="btn btn-outline" onClick={() => exportToExcel(getExportData().headers, getExportData().data, getFilename(), 'Expenses')} title="Export Excel">
              <FileSpreadsheet size={18} color="var(--success)" /> Excel
            </button>
          </div>
        </div>

        {showFilters && (
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Category</label>
              <select className="form-control" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                <option value="">All Categories</option>
                {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
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
              <label className="form-label">Priority</label>
              <select className="form-control" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as ExpensePriority | '')}>
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <div>
                <label className="form-label">Min Amount (₹)</label>
                <input type="number" className="form-control" value={minAmount} onChange={e => setMinAmount(e.target.value)} />
              </div>
              <div style={{ paddingBottom: '0.75rem', color: 'var(--text-secondary)' }}>-</div>
              <div>
                <label className="form-label">Max Amount (₹)</label>
                <input type="number" className="form-control" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
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
        {(searchTerm || categoryFilter || paymentFilter || priorityFilter || minAmount || maxAmount || startDate || endDate) && (
          <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Active Filters:</span>
            {searchTerm && <div className="filter-chip">Search: {searchTerm} <button onClick={() => setSearchTerm('')}><X size={14} /></button></div>}
            {categoryFilter && <div className="filter-chip">Category: {categoryFilter} <button onClick={() => setCategoryFilter('')}><X size={14} /></button></div>}
            {paymentFilter && <div className="filter-chip">Payment: {paymentFilter} <button onClick={() => setPaymentFilter('')}><X size={14} /></button></div>}
            {priorityFilter && <div className="filter-chip">Priority: {priorityFilter} <button onClick={() => setPriorityFilter('')}><X size={14} /></button></div>}
            {minAmount && <div className="filter-chip">Min ₹{minAmount} <button onClick={() => setMinAmount('')}><X size={14} /></button></div>}
            {maxAmount && <div className="filter-chip">Max ₹{maxAmount} <button onClick={() => setMaxAmount('')}><X size={14} /></button></div>}
            {startDate && <div className="filter-chip">From: {startDate} <button onClick={() => setStartDate('')}><X size={14} /></button></div>}
            {endDate && <div className="filter-chip">To: {endDate} <button onClick={() => setEndDate('')}><X size={14} /></button></div>}
            <button className="btn" style={{ background: 'none', color: 'var(--danger)', padding: '0.25rem 0.5rem' }} onClick={clearAllFilters}>Clear All</button>
          </div>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Date</th>
              <th>Expense Title</th>
              {!isSplitPane && <th>Vendor</th>}
              <th>Amount</th>
              {!isSplitPane && <th>Payment</th>}
              {!isSplitPane && <th>Priority</th>}
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map(e => (
              <tr key={e.id} style={{ background: isSplitPane && selectedExpense?.id === e.id ? 'var(--surface-hover)' : 'transparent' }}>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{e.serialNumber}</td>
                <td>{format(new Date(e.date), 'MMM dd, yyyy')}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{e.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{e.category}</div>
                </td>
                {!isSplitPane && <td>{e.vendorName}</td>}
                <td style={{ fontWeight: 600 }}>{formatCurrency(e.amount)}</td>
                {!isSplitPane && <td><span className="badge badge-neutral">{e.paymentMethod}</span></td>}
                {!isSplitPane && (
                  <td>
                    <span className={`badge ${e.priority === 'High' ? 'badge-danger' : e.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`}>
                      {e.priority}
                    </span>
                  </td>
                )}
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn-icon" 
                      style={{ color: 'var(--primary)' }} 
                      title="View"
                      onClick={() => onView(e)}
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="btn-icon" 
                      style={{ color: 'var(--text-secondary)' }} 
                      title="Edit"
                      onClick={() => onEdit(e)}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      className="btn-icon" 
                      style={{ color: 'var(--danger)' }} 
                      title="Delete"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
                          onDelete(e.id);
                        }
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan={isSplitPane ? 5 : 8}>
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '4rem 1rem' }}>
                    <Wallet size={48} style={{ opacity: 0.2, marginBottom: '1rem', color: 'var(--danger)' }} />
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No expenses found</h3>
                    <p style={{ marginTop: '0.5rem', maxWidth: '300px', margin: '0.5rem auto 0' }}>Try adjusting your filters or record a new expense.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      {isSplitPane && (
        <div className="split-pane-detail animate-fade-in">
          {selectedExpense ? (
            <ExpenseView expense={selectedExpense} onBack={() => onNavigate('expenses')} />
          ) : (
            <div className="split-pane-empty">
              <p>Select an expense to view details</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
