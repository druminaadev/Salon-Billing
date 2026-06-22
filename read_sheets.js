import * as xlsx from 'xlsx';

try {
  const workbook = xlsx.readFile('Bill Book.xlsx');
  console.log('Sheets:', workbook.SheetNames);
} catch(e) {
  console.error(e.message);
}
