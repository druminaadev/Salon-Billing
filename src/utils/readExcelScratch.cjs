const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../../Bill Book.xlsx');

try {
  const workbook = xlsx.readFile(filePath);
  console.log('--- EXCEL FILE INFO ---');
  console.log('Sheet Names:', workbook.SheetNames);
  
  // Read the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert to JSON
  const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" }); // defval ensures empty cells are included as empty strings
  
  console.log(`\n--- First 3 Rows of "${firstSheetName}" ---`);
  console.log(JSON.stringify(data.slice(0, 3), null, 2));
  
  console.log(`\nTotal Rows in "${firstSheetName}":`, data.length);
  
  // Get columns from the first row object if data exists
  if (data.length > 0) {
    console.log(`\nColumns detected:`, Object.keys(data[0]));
  }

} catch (error) {
  console.error('Error reading Excel file:', error.message);
}
