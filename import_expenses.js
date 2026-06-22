import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseDate(dateStr) {
  // Expected format: d/m/yyyy or dd/mm/yyyy
  const parts = dateStr.trim().split('/');
  if (parts.length === 3) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split('T')[0];
}

function getCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('tea') || t.includes('coffee') || t.includes('lunch') || t.includes('pani') || t.includes('food')) return 'Refreshments';
  if (t.includes('rapido') || t.includes('petrol') || t.includes('bike')) return 'Travel';
  if (t.includes('product') || t.includes('color') || t.includes('mehand') || t.includes('tissu')) return 'Inventory';
  if (t.includes('mirrar') || t.includes('salon')) return 'Equipment';
  if (t.includes('adv')) return 'Salary Advance';
  return 'General';
}

async function run() {
  const content = fs.readFileSync('expense.csv', 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  // Skip header
  const dataLines = lines.slice(1);
  
  const inserts = [];
  
  for (const line of dataLines) {
    // Some titles might have commas if not careful, but looks like simple CSV without quotes
    const parts = line.split(',');
    if (parts.length >= 4) {
      const dateRaw = parts[0];
      const titleRaw = parts[1];
      const cashRaw = parts[2];
      const onlineRaw = parts[3];
      
      const date = parseDate(dateRaw);
      const title = titleRaw.trim() || 'Unknown Expense';
      const cash = parseFloat(cashRaw) || 0;
      const online = parseFloat(onlineRaw) || 0;
      
      const category = getCategory(title);
      
      if (cash > 0) {
        inserts.push({
          title: title,
          description: `Imported cash expense on ${date}`,
          amount: cash,
          category: category,
          payment_method: 'Cash',
          vendor_name: 'N/A',
          date: date,
          priority: 'Low',
          recurrence: 'One Time',
          notes: 'Imported from expense.csv'
        });
      }
      
      if (online > 0) {
        inserts.push({
          title: title,
          description: `Imported online expense on ${date}`,
          amount: online,
          category: category,
          payment_method: 'Online Payment',
          vendor_name: 'N/A',
          date: date,
          priority: 'Low',
          recurrence: 'One Time',
          notes: 'Imported from expense.csv'
        });
      }
    }
  }
  
  console.log(`Prepared ${inserts.length} expense records for insertion.`);
  
  if (inserts.length === 0) {
    console.log("No valid records found.");
    return;
  }
  
  // Insert into Supabase
  console.log("Inserting into Supabase...");
  const { data, error } = await supabase
    .from('expenses')
    .insert(inserts)
    .select();
    
  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log(`Successfully inserted ${data.length} records!`);
  }
}

run();
