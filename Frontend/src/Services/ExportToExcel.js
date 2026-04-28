import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportConnectionsToExcel = (connections, customerName = "Customer") => {
  // 1. Flatten the data so nested properties get their own columns
  const dataToExport = connections.map(conn => ({
    "FAB Circuit ID": conn.fabCircuitId,
    // "Telco Circuit ID": conn.telecoCircuitId || 'N/A',
    "Status": conn.status,
    "Service Type": conn.serviceType,
    "Bandwidth (Mbps)": conn.bandwidth,
    
    // Flattening Commercials
    "MRC": conn.commercials?.mrc,
    "Rate per MB": conn.commercials?.ratePerMb,
    "OTC": conn.commercials?.otc,
    
    // Technical Details
    "Provider": conn.technicalDetails?.telcoProvider,
    
    // Dates (Formatted for readability)
    "Acceptance Date": conn.acceptanceDate ? new Date(conn.acceptanceDate).toLocaleDateString() : 'N/A',
    "Created At": new Date(conn.createdAt).toLocaleDateString(),
    
    // Termination Info (if applicable)
    "Termination Raise Date": conn.terminationDetails?.raiseDate ? new Date(conn.terminationDetails.raiseDate).toLocaleDateString() : '',
    "Final Termination Date": conn.terminationDetails?.finalDate ? new Date(conn.terminationDetails.finalDate).toLocaleDateString() : '',
    "Termination Reason": conn.terminationDetails?.reason || ''
  }));

  // 2. Create the Excel Workbook
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
  // Optional: Set column widths so data isn't cramped
  const wscols = [
    {wch: 15}, {wch: 20}, {wch: 15}, {wch: 12}, {wch: 15}, 
    {wch: 10}, {wch: 12}, {wch: 10}, {wch: 15}, {wch: 15}
  ];
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Connections");

  // 3. Download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(dataBlob, `${customerName}_Connection_Report.xlsx`);
};