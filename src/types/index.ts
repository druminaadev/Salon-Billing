export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  serviceBy?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Online Payment';
export type ExpensePriority = 'Low' | 'Medium' | 'High';
export type ExpenseRecurrence = 'One Time' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface Billing {
  id: string;
  serialNumber: string;
  customerName: string;
  mobileNumber: string;
  customerGender?: 'Male' | 'Female';
  services: ServiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Expense {
  id: string;
  serialNumber: string;
  title: string;
  description: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  vendorName: string;
  date: string; // YYYY-MM-DD
  notes?: string;
  priority: ExpensePriority;
  recurrence: ExpenseRecurrence;
  receiptUrl?: string;
}

export type ViewState = 'dashboard' | 'billings' | 'expenses' | 'new-billing' | 'new-expense' | 'view-billing' | 'edit-billing' | 'view-expense' | 'edit-expense' | 'staff' | 'new-staff' | 'edit-staff' | 'view-staff';

export type TimeframeFilter = 'today' | 'week' | 'month' | 'all';

export type StaffRole = 'Stylist' | 'Barber' | 'Therapist' | 'Manager' | 'Other';
export type StaffStatus = 'Active' | 'Inactive';

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  mobileNumber: string;
  status: StaffStatus;
  joinDate: string; // YYYY-MM-DD
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
