import type { Billing, Expense } from '../types';
import { subDays, format } from 'date-fns';

const today = new Date();

export const mockBillings: Billing[] = [
  {
    id: 'b1',
    serialNumber: 'SR-000001',
    customerName: 'Sarah Jenkins',
    mobileNumber: '9876543210',
    services: [{ id: 's1', name: 'Haircut & Styling', price: 120.00, quantity: 1 }],
    subtotal: 120.00,
    discount: 0,
    tax: 0,
    grandTotal: 120.00,
    paymentMethod: 'Online Payment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b2',
    serialNumber: 'SR-000002',
    customerName: 'Michael Chen',
    mobileNumber: '8765432109',
    services: [{ id: 's2', name: 'Beard Trim', price: 35.00, quantity: 1 }],
    subtotal: 35.00,
    discount: 5.00,
    tax: 0,
    grandTotal: 30.00,
    paymentMethod: 'Cash',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'b3',
    serialNumber: 'SR-000003',
    customerName: 'Emma Watson',
    mobileNumber: '7654321098',
    services: [
      { id: 's3', name: 'Coloring', price: 200.00, quantity: 1 },
      { id: 's4', name: 'Hair Treatment', price: 50.00, quantity: 1 }
    ],
    subtotal: 250.00,
    discount: 0,
    tax: 0,
    grandTotal: 250.00,
    paymentMethod: 'Card',
    createdAt: subDays(today, 1).toISOString(),
    updatedAt: subDays(today, 1).toISOString(),
  },
];

export const mockExpenses: Expense[] = [
  {
    id: 'e1',
    serialNumber: 'EXP-000001',
    title: 'Restock Hair Color',
    description: 'Bought L\'Oreal colors in bulk.',
    amount: 345.50,
    category: 'Product Purchase',
    paymentMethod: 'Card',
    vendorName: 'Sally Beauty Supply',
    date: format(subDays(today, 1), 'yyyy-MM-dd'),
    priority: 'Medium',
    recurrence: 'One Time'
  },
  {
    id: 'e2',
    serialNumber: 'EXP-000002',
    title: 'Monthly Electricity',
    description: 'Electricity bill for June.',
    amount: 180.00,
    category: 'Electricity',
    paymentMethod: 'Bank Transfer',
    vendorName: 'City Power & Light',
    date: format(subDays(today, 2), 'yyyy-MM-dd'),
    priority: 'High',
    recurrence: 'Monthly'
  },
];
