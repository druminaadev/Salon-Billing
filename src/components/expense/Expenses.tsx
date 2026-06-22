import React, { useState, useEffect } from 'react';
import type { Expense, ViewState, PaymentMethod, ExpensePriority, TimeframeFilter } from '../../types';
import { Download, FileText, FileSpreadsheet, Plus, Search, Filter, X, Eye, Edit, Trash2, Wallet, ChevronLeft, ChevronRight, IndianRupee, AlertTriangle, TrendingDown } from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, paymentFilter, priorityFilter, minAmount, maxAmount, startDate, endDate, globalTimeframe]);

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
  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const avgExpense = filteredExpenses.length ? totalSpent / filteredExpenses.length : 0;
  const highPriority = filteredExpenses.filter(e => e.priority === 'High').length;
  const uniqueCategories = new Set(filteredExpenses.map(e => e.category)).size;
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Spent</h3>
              <div style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', borderRadius: '8px' }}><IndianRupee size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(totalSpent)}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--danger)', opacity: 0.8 }} />
          </div>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Entries</h3>
              <div style={{ padding: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', borderRadius: '8px' }}><TrendingDown size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{filteredExpenses.length} <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>expenses</span></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: '#6366f1', opacity: 0.8 }} />
          </div>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Expense</h3>
              <div style={{ padding: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', borderRadius: '8px' }}><Wallet size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(avgExpense)}</div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: '#f59e0b', opacity: 0.8 }} />
          </div>
          <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>High Priority</h3>
              <div style={{ padding: '0.4rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}><AlertTriangle size={18} /></div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{highPriority} <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ {uniqueCategories} cats</span></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--success)', opacity: 0.8 }} />
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
                  placeholder="Search expenses..."
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
                  <button className="btn-icon" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '36px', height: '36px' }} onClick={() => exportToPDF('Expenses Report', getExportData().headers, getExportData().data, getFilename())} title="Export PDF">
                <FileText size={16} color="var(--danger)" />
              </button>
              <button className="btn-icon" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '36px', height: '36px' }} onClick={() => exportToCSV(getExportData().headers, getExportData().data, getFilename())} title="Export CSV">
                <Download size={16} color="var(--text-secondary)" />
              </button>
              <button className="btn-icon" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', width: '36px', height: '36px' }} onClick={() => exportToExcel(getExportData().headers, getExportData().data, getFilename(), 'Expenses')} title="Export Excel">
                <FileSpreadsheet size={16} color="var(--success)" />
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

        <div className="table-container" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', border: 'none' }}>
          <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead style={{ background: 'color-mix(in srgb, var(--primary) 5%, var(--surface-color))' }}>
              <tr>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Serial No.</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Expense Title</th>
                {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Vendor</th>}
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Amount</th>
                {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Payment</th>}
                {!isSplitPane && <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Priority</th>}
                <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses.map(e => (
                <tr key={e.id}
                  style={{
                    background: isSplitPane && selectedExpense?.id === e.id ? 'var(--surface-hover)' : 'var(--surface-color)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onClick={(evt) => { if ((evt.target as HTMLElement).closest('button')) return; onView(e); }}
                >
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.875rem' }}>{e.serialNumber}</div>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{format(new Date(e.date), 'MMM dd, yyyy')}</div>
                  </td>
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{e.category}</div>
                  </td>
                  {!isSplitPane && <td style={{ padding: '1rem', verticalAlign: 'middle', color: 'var(--text-secondary)' }}>{e.vendorName}</td>}
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{formatCurrency(e.amount)}</div>
                  </td>
                  {!isSplitPane && (
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <span className="badge badge-neutral" style={{ padding: '0.3rem 0.8rem' }}>{e.paymentMethod}</span>
                    </td>
                  )}
                  {!isSplitPane && (
                    <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                      <span className={`badge ${e.priority === 'High' ? 'badge-danger' : e.priority === 'Medium' ? 'badge-warning' : 'badge-success'}`} style={{ padding: '0.3rem 0.8rem' }}>
                        {e.priority}
                      </span>
                    </td>
                  )}
                  <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" style={{ color: 'var(--primary)' }} title="View" onClick={() => onView(e)}><Eye size={18} /></button>
                      <button className="btn-icon" style={{ color: 'var(--text-secondary)' }} title="Edit" onClick={() => onEdit(e)}><Edit size={18} /></button>
                      <button className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete" onClick={() => { if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) onDelete(e.id); }}><Trash2 size={18} /></button>
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

          {filteredExpenses.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--surface-color)', borderTop: '1px solid color-mix(in srgb, var(--border-color) 40%, transparent)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredExpenses.length)} of {filteredExpenses.length}
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
