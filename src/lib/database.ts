import { supabase } from './supabase';
import type {
  BillingRow,
  BillingServiceRow,
  BillingWithServicesRow,
  ExpenseRow,
  BillingInsert,
  ExpenseInsert,
  StaffRow,
  StaffInsert,
} from './supabase';
import type { Billing, Expense, ServiceItem, Staff } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Type Mappers — DB rows ↔ App types
// ─────────────────────────────────────────────────────────────────────────────

function mapServiceRowToApp(row: BillingServiceRow): ServiceItem {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    quantity: row.quantity,
    serviceBy: row.service_by ?? undefined,
  };
}

function mapBillingRowToApp(row: BillingWithServicesRow): Billing {
  return {
    id: row.id,
    serialNumber: String(row.serial_number),  // DB number → string for display
    customerName: row.customer_name,
    mobileNumber: row.mobile_number,
    customerGender: row.customer_gender ?? undefined,
    services: (row.billing_services ?? []).map(mapServiceRowToApp),
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    tax: Number(row.tax),
    grandTotal: Number(row.grand_total),
    paymentMethod: row.payment_method,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExpenseRowToApp(row: ExpenseRow): Expense {
  return {
    id: row.id,
    serialNumber: String(row.serial_number),  // DB number → string for display
    title: row.title,
    description: row.description,
    amount: Number(row.amount),
    category: row.category,
    paymentMethod: row.payment_method,
    vendorName: row.vendor_name,
    date: row.date,
    notes: row.notes ?? undefined,
    priority: row.priority,
    recurrence: row.recurrence,
    receiptUrl: row.receipt_url ?? undefined,
  };
}

function mapStaffRowToApp(row: StaffRow): Staff {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    mobileNumber: row.mobile_number,
    status: row.status,
    joinDate: row.join_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBillingToInsertRow(billing: Billing): BillingInsert {
  return {
    // serial_number is GENERATED ALWAYS AS IDENTITY — DB handles it
    customer_name: billing.customerName,
    mobile_number: billing.mobileNumber,
    customer_gender: billing.customerGender ?? null,
    subtotal: billing.subtotal,
    discount: billing.discount,
    tax: billing.tax,
    grand_total: billing.grandTotal,
    payment_method: billing.paymentMethod,
    notes: billing.notes ?? null,
  };
}

function mapExpenseToInsertRow(expense: Expense): ExpenseInsert {
  return {
    // serial_number is GENERATED ALWAYS AS IDENTITY — DB handles it
    title: expense.title,
    description: expense.description,
    amount: expense.amount,
    category: expense.category,
    payment_method: expense.paymentMethod,
    vendor_name: expense.vendorName,
    date: expense.date,
    notes: expense.notes ?? null,
    priority: expense.priority,
    recurrence: expense.recurrence,
    receipt_url: expense.receiptUrl ?? null,
  };
}

function mapStaffToInsertRow(staff: Staff): StaffInsert {
  return {
    name: staff.name,
    role: staff.role,
    mobile_number: staff.mobileNumber,
    status: staff.status,
    join_date: staff.joinDate,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BILLING CRUD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all billings with their services, ordered newest first.
 */
export async function fetchBillings(): Promise<Billing[]> {
  const { data, error } = await supabase
    .from('billings')
    .select('*, billing_services(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] fetchBillings error:', error.message);
    throw new Error(error.message);
  }

  return (data as BillingWithServicesRow[]).map(mapBillingRowToApp);
}

/**
 * Insert a new billing and its service line items.
 * Returns the created Billing (with the real DB id).
 */
export async function createBilling(billing: Billing): Promise<Billing> {
  // 1. Insert billing header
  const { data: billingData, error: billingError } = await supabase
    .from('billings')
    .insert(mapBillingToInsertRow(billing) as any)
    .select()
    .single();

  if (billingError || !billingData) {
    console.error('[DB] createBilling error:', billingError?.message);
    throw new Error(billingError?.message ?? 'Failed to create billing');
  }

  const billingId = (billingData as BillingRow).id;

  // 2. Insert service line items
  if (billing.services.length > 0) {
    const serviceRows = billing.services.map((s) => ({
      billing_id: billingId,
      name: s.name,
      price: s.price,
      quantity: s.quantity,
      service_by: s.serviceBy ?? null,
    }));

    const { error: servicesError } = await supabase
      .from('billing_services')
      .insert(serviceRows as any);

    if (servicesError) {
      console.error('[DB] createBilling services error:', servicesError.message);
      throw new Error(servicesError.message);
    }
  }

  // 3. Fetch the complete record to return
  return fetchBillingById(billingId);
}

/**
 * Fetch a single billing with its services by id.
 */
export async function fetchBillingById(id: string): Promise<Billing> {
  const { data, error } = await supabase
    .from('billings')
    .select('*, billing_services(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Billing not found');
  }

  return mapBillingRowToApp(data as BillingWithServicesRow);
}

/**
 * Update an existing billing header and replace all service line items.
 */
export async function updateBilling(billing: Billing): Promise<Billing> {
  // 1. Update billing header
  const { error: billingError } = await supabase
    .from('billings')
    .update(mapBillingToInsertRow(billing) as any)
    .eq('id', billing.id);

  if (billingError) {
    console.error('[DB] updateBilling error:', billingError.message);
    throw new Error(billingError.message);
  }

  // 2. Delete old service rows and re-insert (simplest safe approach)
  const { error: deleteError } = await supabase
    .from('billing_services')
    .delete()
    .eq('billing_id', billing.id);

  if (deleteError) {
    console.error('[DB] updateBilling delete services error:', deleteError.message);
    throw new Error(deleteError.message);
  }

  if (billing.services.length > 0) {
    const serviceRows = billing.services.map((s) => ({
      billing_id: billing.id,
      name: s.name,
      price: s.price,
      quantity: s.quantity,
      service_by: s.serviceBy ?? null,
    }));

    const { error: insertError } = await supabase
      .from('billing_services')
      .insert(serviceRows as any);

    if (insertError) {
      console.error('[DB] updateBilling insert services error:', insertError.message);
      throw new Error(insertError.message);
    }
  }

  return fetchBillingById(billing.id);
}

/**
 * Delete a billing (services are cascade-deleted by the DB).
 */
export async function deleteBilling(id: string): Promise<void> {
  const { error } = await supabase.from('billings').delete().eq('id', id);
  if (error) {
    console.error('[DB] deleteBilling error:', error.message);
    throw new Error(error.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSE CRUD
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch all expenses ordered newest first.
 */
export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] fetchExpenses error:', error.message);
    throw new Error(error.message);
  }

  return (data as ExpenseRow[]).map(mapExpenseRowToApp);
}

/**
 * Insert a new expense.
 */
export async function createExpense(expense: Expense): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .insert(mapExpenseToInsertRow(expense) as any)
    .select()
    .single();

  if (error || !data) {
    console.error('[DB] createExpense error:', error?.message);
    throw new Error(error?.message ?? 'Failed to create expense');
  }

  return mapExpenseRowToApp(data as ExpenseRow);
}

/**
 * Update an existing expense.
 */
export async function updateExpense(expense: Expense): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .update(mapExpenseToInsertRow(expense) as any)
    .eq('id', expense.id)
    .select()
    .single();

  if (error || !data) {
    console.error('[DB] updateExpense error:', error?.message);
    throw new Error(error?.message ?? 'Failed to update expense');
  }

  return mapExpenseRowToApp(data as ExpenseRow);
}

/**
 * Delete an expense by id.
 */
export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) {
    console.error('[DB] deleteExpense error:', error.message);
    throw new Error(error.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchStaffs(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] fetchStaffs error:', error.message);
    throw new Error(error.message);
  }

  return (data as StaffRow[]).map(mapStaffRowToApp);
}

export async function createStaff(staff: Staff): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .insert(mapStaffToInsertRow(staff) as any)
    .select()
    .single();

  if (error || !data) {
    console.error('[DB] createStaff error:', error?.message);
    throw new Error(error?.message ?? 'Failed to create staff');
  }

  return mapStaffRowToApp(data as StaffRow);
}

export async function updateStaff(staff: Staff): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .update(mapStaffToInsertRow(staff) as any)
    .eq('id', staff.id)
    .select()
    .single();

  if (error || !data) {
    console.error('[DB] updateStaff error:', error?.message);
    throw new Error(error?.message ?? 'Failed to update staff');
  }

  return mapStaffRowToApp(data as StaffRow);
}

export async function deleteStaff(id: string): Promise<void> {
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) {
    console.error('[DB] deleteStaff error:', error.message);
    throw new Error(error.message);
  }
}
