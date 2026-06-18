import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Database Types
// Mirrors the schema defined in supabase/schema.sql
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentMethodDB = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer' | 'Online Payment';
export type ExpensePriorityDB = 'Low' | 'Medium' | 'High';
export type ExpenseRecurrenceDB = 'One Time' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
export type CustomerGenderDB = 'Male' | 'Female';
export type StaffRoleDB = 'Stylist' | 'Barber' | 'Therapist' | 'Manager' | 'Other';
export type StaffStatusDB = 'Active' | 'Inactive';

export interface BillingRow {
  id: string;
  serial_number: number;       // DB auto-increment: 1, 2, 3…
  customer_name: string;
  mobile_number: string;
  customer_gender: CustomerGenderDB | null;
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
  payment_method: PaymentMethodDB;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillingServiceRow {
  id: string;
  billing_id: string;
  name: string;
  price: number;
  quantity: number;
  service_by: string | null;
  created_at: string;
}

export interface ExpenseRow {
  id: string;
  serial_number: number;       // DB auto-increment: 1, 2, 3…
  title: string;
  description: string;
  amount: number;
  category: string;
  payment_method: PaymentMethodDB;
  vendor_name: string;
  date: string;
  notes: string | null;
  priority: ExpensePriorityDB;
  recurrence: ExpenseRecurrenceDB;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

// Full billing row with nested services (used after join)
export interface BillingWithServicesRow extends BillingRow {
  billing_services: BillingServiceRow[];
}

// Explicit Insert types (avoids Omit<> which breaks Supabase generic inference)
export interface BillingInsert {
  customer_name: string;
  mobile_number: string;
  customer_gender: CustomerGenderDB | null;
  subtotal: number;
  discount: number;
  tax: number;
  grand_total: number;
  payment_method: PaymentMethodDB;
  notes: string | null;
}

export interface BillingServiceInsert {
  billing_id: string;
  name: string;
  price: number;
  quantity: number;
  service_by: string | null;
}

export interface ExpenseInsert {
  title: string;
  description: string;
  amount: number;
  category: string;
  payment_method: PaymentMethodDB;
  vendor_name: string;
  date: string;
  notes: string | null;
  priority: ExpensePriorityDB;
  recurrence: ExpenseRecurrenceDB;
  receipt_url: string | null;
}

export interface StaffRow {
  id: string;
  name: string;
  role: StaffRoleDB;
  mobile_number: string;
  status: StaffStatusDB;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface StaffInsert {
  name: string;
  role: StaffRoleDB;
  mobile_number: string;
  status: StaffStatusDB;
  join_date: string;
}

export type Database = {
  public: {
    Tables: {
      billings: {
        Row: BillingRow;
        Insert: BillingInsert;
        Update: Partial<BillingInsert>;
      };
      billing_services: {
        Row: BillingServiceRow;
        Insert: BillingServiceInsert;
        Update: Partial<BillingServiceInsert>;
      };
      expenses: {
        Row: ExpenseRow;
        Insert: ExpenseInsert;
        Update: Partial<ExpenseInsert>;
      };
      staff: {
        Row: StaffRow;
        Insert: StaffInsert;
        Update: Partial<StaffInsert>;
      };
    };
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Client singleton
// ─────────────────────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
  console.error(
    '⚠️  VITE_SUPABASE_URL is not set. Please update your .env file.\n' +
    '   Get your URL from: https://app.supabase.com → Project Settings → API'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
  console.error(
    '⚠️  VITE_SUPABASE_ANON_KEY is not set. Please update your .env file.\n' +
    '   Get your key from: https://app.supabase.com → Project Settings → API'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // We manage our own session, so disable Supabase Auth persistence
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
