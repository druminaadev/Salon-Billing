import React from 'react';
import type { Billing, Expense, TimeframeFilter } from '../types';
import { TrendingUp, TrendingDown, ArrowRight, Activity, Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns';

interface DashboardProps {
  billings: Billing[];
  expenses: Expense[];
  onNavigate: (view: 'billings' | 'expenses') => void;
  timeframe: TimeframeFilter;
}

export const Dashboard: React.FC<DashboardProps> = ({ billings, expenses, onNavigate, timeframe }) => {

  const filteredBillings = billings.filter(b => {
    if (timeframe === 'all') return true;
    const date = new Date(b.createdAt);
    if (timeframe === 'today') return isToday(date);
    if (timeframe === 'week') return isThisWeek(date);
    if (timeframe === 'month') return isThisMonth(date);
    return true;
  });

  const filteredExpenses = expenses.filter(e => {
    if (timeframe === 'all') return true;
    const date = new Date(e.date);
    if (timeframe === 'today') return isToday(date);
    if (timeframe === 'week') return isThisWeek(date);
    if (timeframe === 'month') return isThisMonth(date);
    return true;
  });

  const totalRevenue = filteredBillings.reduce((sum, b) => sum + b.grandTotal, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const cashRevenue = filteredBillings.filter(b => b.paymentMethod === 'Cash').reduce((sum, b) => sum + b.grandTotal, 0);
  const cashExpenses = filteredExpenses.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + e.amount, 0);

  const availableCash = cashRevenue - cashExpenses;

  const recentBillings = [...filteredBillings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const revenueTrendData = filteredBillings.reduce((acc: any[], curr) => {
    const dateStr = format(new Date(curr.createdAt), 'MMM dd');
    const existing = acc.find(item => item.name === dateStr);
    if (existing) {
      existing.revenue += curr.grandTotal;
    } else {
      acc.push({ name: dateStr, revenue: curr.grandTotal });
    }
    return acc;
  }, []).sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  const categoryExpenseData = filteredExpenses.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.amount += curr.amount;
    } else {
      acc.push({ name: curr.category, amount: curr.amount });
    }
    return acc;
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="topbar">
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's your business at a glance.</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Revenue</h3>
            <div style={{ padding: '0.4rem', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: '8px' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--success)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expenses</h3>
            <div style={{ padding: '0.4rem', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '8px' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(totalExpenses)}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--danger)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Profit</h3>
            <div style={{ padding: '0.4rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', borderRadius: '8px' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: netProfit >= 0 ? 'var(--primary)' : 'var(--danger)' }}>
            {formatCurrency(netProfit)}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--primary)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel" style={{ padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Available Cash</h3>
            <div style={{ padding: '0.4rem', background: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary)', borderRadius: '8px' }}>
              <Wallet size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {formatCurrency(availableCash)}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: '4px', width: '100%', background: 'var(--secondary)', opacity: 0.8 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', height: '280px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Revenue Trend</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', color: 'var(--text-primary)' }} 
                  itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', height: '280px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Expenses by Category</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryExpenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-hover)' }} 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', color: 'var(--text-primary)' }} 
                  itemStyle={{ color: 'var(--secondary)', fontWeight: 600 }}
                />
                <Bar dataKey="amount" fill="var(--secondary)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Recent Billings</h3>
          <button className="btn btn-outline" onClick={() => onNavigate('billings')} style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}>
            View All <ArrowRight size={14} />
          </button>
        </div>
        
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {recentBillings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{b.serialNumber}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{format(new Date(b.createdAt), 'MMM dd, yyyy HH:mm')}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{formatCurrency(b.grandTotal)}</td>
                  <td>
                    <span className="badge badge-neutral">
                      {b.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
              {recentBillings.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '1.5rem' }}>No recent billings</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
