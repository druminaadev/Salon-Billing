import * as xlsx from 'xlsx';
import * as fs from 'fs';

// Check if input and output filenames were provided
if (process.argv.length < 4) {
  console.log('Usage: node excel_to_csv.js <input.xlsx> <output.csv>');
  console.log('Example: node excel_to_csv.js my_data.xlsx output.csv');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = process.argv[3];

try {
  // Read the workbook
  console.log(`Reading ${inputFile}...`);
  const workbook = xlsx.readFile(inputFile);
  
  // Get the very first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert the sheet to a raw CSV string
  console.log('Converting data to CSV format...');
  const csvData = xlsx.utils.sheet_to_csv(worksheet);
  
  // Write the CSV string to the output file
  fs.writeFileSync(outputFile, csvData, 'utf8');
  
  console.log(`✅ Successfully converted! Saved to: ${outputFile}`);
} catch (error) {
  console.error('❌ Error during conversion:', error.message);
}
