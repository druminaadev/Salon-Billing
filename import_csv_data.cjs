/**
 * CSV Data Import Script
 * Converts CSV files to database structure and generates SQL insert statements
 * 
 * Usage: node import_csv_data.js
 */

const fs = require('fs');
const path = require('path');

// Parse CSV line handling commas inside quotes
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Parse date from various formats
function parseDate(dateStr) {
  if (!dateStr || dateStr === '0' || dateStr.toLowerCase() === 'no bill') return null;
  
  // Format: D/M/YYYY or DD/MM/YYYY
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return null;
}

// Extract staff assignments from staff column
function parseStaffAssignments(staffStr, totalAmount) {
  if (!staffStr) return { serviceBy: null, staffAssignments: null };
  
  staffStr = staffStr.trim();
  
  // Check for split pattern: "sahil 350 shivani 100"
  const splitPattern = /(\w+)\s+(\d+)/g;
  const matches = [...staffStr.matchAll(splitPattern)];
  
  if (matches.length > 1) {
    // Multiple staff with amounts
    const assignments = matches.map(m => ({
      staffName: capitalizeFirst(m[1]),
      amount: parseFloat(m[2])
    }));
    
    return {
      serviceBy: assignments.map(a => a.staffName).join(', '),
      staffAssignments: JSON.stringify(assignments)
    };
  }
  
  // Check for backslash separator: "sahil\\simren" or "Afu\\shivani"
  if (staffStr.includes('\\')) {
    const names = staffStr.split('\\').map(n => capitalizeFirst(n.trim()));
    
    if (names.length > 1) {
      // Even split
      const amountPerStaff = Math.floor(totalAmount / names.length);
      const remainder = totalAmount - (amountPerStaff * names.length);
      
      const assignments = names.map((name, idx) => ({
        staffName: name,
        amount: idx === names.length - 1 ? amountPerStaff + remainder : amountPerStaff
      }));
      
      return {
        serviceBy: names.join(', '),
        staffAssignments: JSON.stringify(assignments)
      };
    }
  }
  
  // Single staff
  return {
    serviceBy: capitalizeFirst(staffStr),
    staffAssignments: null
  };
}

// Capitalize first letter
function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Clean phone number
function cleanPhone(phone) {
  if (!phone || phone === '0') return '0000000000';
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 ? cleaned : '0000000000';
}

// Parse amount
function parseAmount(amountStr) {
  if (!amountStr || amountStr === 'cash' || amountStr.toLowerCase() === 'no bill') return 0;
  const cleaned = amountStr.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}

// Determine payment method
function getPaymentMethod(cash, online) {
  const cashAmt = parseAmount(cash);
  const onlineAmt = parseAmount(online);
  
  if (cashAmt > 0 && onlineAmt > 0) return 'Cash'; // Mixed, default to Cash
  if (onlineAmt > 0) return 'UPI';
  return 'Cash';
}

// Process billings CSV
function processBillings(csvPath) {
  console.log('Processing billings...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  // Skip header
  const dataLines = lines.slice(1);
  
  const billings = [];
  let serialNumber = 1;
  
  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    const [dateStr, name, phone, service, amount, cash, online, staff] = cols;
    
    // Skip invalid rows
    const date = parseDate(dateStr);
    const customerName = name?.trim();
    const serviceName = service?.trim();
    const totalAmount = parseAmount(amount);
    
    if (!date || !customerName || !serviceName || totalAmount === 0) continue;
    if (customerName.toLowerCase() === 'no bill') continue;
    if (serviceName.toLowerCase() === 'total') continue;
    
    const mobileNumber = cleanPhone(phone);
    const paymentMethod = getPaymentMethod(cash, online);
    const staffInfo = parseStaffAssignments(staff, totalAmount);
    
    billings.push({
      serialNumber: serialNumber++,
      date,
      customerName,
      mobileNumber,
      serviceName,
      totalAmount,
      paymentMethod,
      serviceBy: staffInfo.serviceBy,
      staffAssignments: staffInfo.staffAssignments
    });
  }
  
  console.log(`✓ Processed ${billings.length} billing records`);
  return billings;
}

// Process expenses CSV
function processExpenses(csvPath) {
  console.log('Processing expenses...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  // Skip header
  const dataLines = lines.slice(1);
  
  const expenses = [];
  let serialNumber = 1;
  
  for (const line of dataLines) {
    const cols = parseCSVLine(line);
    const [dateStr, title, cash, online] = cols;
    
    // Skip invalid rows
    const date = parseDate(dateStr);
    const expenseTitle = title?.trim();
    
    if (!date || !expenseTitle) continue;
    if (expenseTitle.toLowerCase() === 'total') continue;
    
    const cashAmt = parseAmount(cash);
    const onlineAmt = parseAmount(online);
    const totalAmount = cashAmt + onlineAmt;
    
    if (totalAmount === 0) continue;
    
    const paymentMethod = onlineAmt > 0 ? 'UPI' : 'Cash';
    
    // Categorize expense
    let category = 'Other';
    const lowerTitle = expenseTitle.toLowerCase();
    if (lowerTitle.includes('tea') || lowerTitle.includes('lunch') || lowerTitle.includes('coffee')) {
      category = 'Food & Beverages';
    } else if (lowerTitle.includes('product') || lowerTitle.includes('color') || lowerTitle.includes('mehand')) {
      category = 'Salon Products';
    } else if (lowerTitle.includes('rapido') || lowerTitle.includes('petrol') || lowerTitle.includes('bike')) {
      category = 'Transportation';
    } else if (lowerTitle.includes('mirror') || lowerTitle.includes('mirrar')) {
      category = 'Equipment';
    } else if (lowerTitle.includes('adv') || lowerTitle.includes('recharge')) {
      category = 'Staff Payments';
    }
    
    expenses.push({
      serialNumber: serialNumber++,
      date,
      title: expenseTitle,
      amount: totalAmount,
      category,
      paymentMethod
    });
  }
  
  console.log(`✓ Processed ${expenses.length} expense records`);
  return expenses;
}

// Generate SQL for billings
function generateBillingsSQL(billings) {
  let sql = `-- ============================================================\n`;
  sql += `-- Billings Import SQL\n`;
  sql += `-- ${billings.length} records\n`;
  sql += `-- ============================================================\n\n`;
  
  for (const billing of billings) {
    const billingId = `'${require('crypto').randomUUID()}'`;
    const serviceId = `'${require('crypto').randomUUID()}'`;
    
    // Insert billing
    sql += `-- Billing #${billing.serialNumber}: ${billing.customerName}\n`;
    sql += `INSERT INTO billings (id, serial_number, customer_name, mobile_number, customer_gender, subtotal, discount, tax, grand_total, payment_method, notes, created_at, updated_at)\n`;
    sql += `VALUES (\n`;
    sql += `  ${billingId},\n`;
    sql += `  ${billing.serialNumber},\n`;
    sql += `  '${billing.customerName.replace(/'/g, "''")}',\n`;
    sql += `  '${billing.mobileNumber}',\n`;
    sql += `  NULL,\n`;
    sql += `  ${billing.totalAmount},\n`;
    sql += `  0,\n`;
    sql += `  0,\n`;
    sql += `  ${billing.totalAmount},\n`;
    sql += `  '${billing.paymentMethod}',\n`;
    sql += `  NULL,\n`;
    sql += `  '${billing.date}T10:00:00Z',\n`;
    sql += `  '${billing.date}T10:00:00Z'\n`;
    sql += `);\n\n`;
    
    // Insert service
    sql += `INSERT INTO billing_services (id, billing_id, name, price, quantity, service_by, staff_assignments, created_at)\n`;
    sql += `VALUES (\n`;
    sql += `  ${serviceId},\n`;
    sql += `  ${billingId},\n`;
    sql += `  '${billing.serviceName.replace(/'/g, "''")}',\n`;
    sql += `  ${billing.totalAmount},\n`;
    sql += `  1,\n`;
    sql += `  ${billing.serviceBy ? `'${billing.serviceBy.replace(/'/g, "''")}'` : 'NULL'},\n`;
    sql += `  ${billing.staffAssignments ? `'${billing.staffAssignments.replace(/'/g, "''")}'::jsonb` : 'NULL'},\n`;
    sql += `  '${billing.date}T10:00:00Z'\n`;
    sql += `);\n\n`;
  }
  
  return sql;
}

// Generate SQL for expenses
function generateExpensesSQL(expenses) {
  let sql = `-- ============================================================\n`;
  sql += `-- Expenses Import SQL\n`;
  sql += `-- ${expenses.length} records\n`;
  sql += `-- ============================================================\n\n`;
  
  for (const expense of expenses) {
    const expenseId = `'${require('crypto').randomUUID()}'`;
    
    sql += `-- Expense #${expense.serialNumber}: ${expense.title}\n`;
    sql += `INSERT INTO expenses (id, serial_number, title, description, amount, category, payment_method, vendor_name, date, notes, priority, recurrence, receipt_url, created_at, updated_at)\n`;
    sql += `VALUES (\n`;
    sql += `  ${expenseId},\n`;
    sql += `  ${expense.serialNumber},\n`;
    sql += `  '${expense.title.replace(/'/g, "''")}',\n`;
    sql += `  '',\n`;
    sql += `  ${expense.amount},\n`;
    sql += `  '${expense.category}',\n`;
    sql += `  '${expense.paymentMethod}',\n`;
    sql += `  '',\n`;
    sql += `  '${expense.date}',\n`;
    sql += `  NULL,\n`;
    sql += `  'Medium',\n`;
    sql += `  'One Time',\n`;
    sql += `  NULL,\n`;
    sql += `  '${expense.date}T10:00:00Z',\n`;
    sql += `  '${expense.date}T10:00:00Z'\n`;
    sql += `);\n\n`;
  }
  
  return sql;
}

// Main execution
function main() {
  console.log('='.repeat(60));
  console.log('CSV Data Import Script');
  console.log('='.repeat(60));
  console.log('');
  
  const billingsPath = path.join(__dirname, 'excel data', 'billings.csv');
  const expensesPath = path.join(__dirname, 'excel data', 'expense.csv');
  
  // Process billings
  const billings = processBillings(billingsPath);
  const billingsSQL = generateBillingsSQL(billings);
  fs.writeFileSync('import_billings.sql', billingsSQL);
  console.log('✓ Generated: import_billings.sql');
  
  // Process expenses
  const expenses = processExpenses(expensesPath);
  const expensesSQL = generateExpensesSQL(expenses);
  fs.writeFileSync('import_expenses.sql', expensesSQL);
  console.log('✓ Generated: import_expenses.sql');
  
  console.log('');
  console.log('='.repeat(60));
  console.log('Summary:');
  console.log(`  Billings: ${billings.length} records`);
  console.log(`  Expenses: ${expenses.length} records`);
  console.log('');
  console.log('Next Steps:');
  console.log('  1. Review generated SQL files');
  console.log('  2. Run in Supabase SQL Editor:');
  console.log('     - import_billings.sql');
  console.log('     - import_expenses.sql');
  console.log('='.repeat(60));
}

main();
