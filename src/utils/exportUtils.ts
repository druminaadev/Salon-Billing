import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (title: string, headers: string[], data: any[][], filename: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add table
  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [107, 143, 113] }, // Primary color
  });
  
  doc.save(`${filename}.pdf`);
};

export const exportToCSV = (headers: string[], data: any[][], filename: string) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// xlsx is dynamically imported — only downloads when user clicks Export Excel
export const exportToExcel = async (
  headers: string[],
  data: any[][],
  filename: string,
  sheetName: string = 'Sheet 1'
) => {
  const XLSX = await import('xlsx');

  // Combine headers and data
  const wsData = [headers, ...data];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
