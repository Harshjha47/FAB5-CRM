import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportConnectionsToExcel = (connections, customerName = "Customer") => {
  const getUserName = (userField) => {
    if (!userField) return 'N/A';
    return userField.name || userField.email || userField.toString();
  };
  // 1. Flatten the data so nested properties get their own columns
  const dataToExport = connections.map(conn => ({
    "Opportunity ID": conn.opportunityId,// 1
    "Status": conn.status,// 2
    "Service Type": conn.serviceType,// 3
    "Bandwidth (Mbps)": conn.bandwidth,// 4

    // Technical Details
    "A-End BTS ID": conn.technicalDetails?.aEnd?.btsId || 'N/A', // 5
    "A-End Address": conn.technicalDetails?.aEnd?.address || 'N/A',// 6
    "B-End BTS ID": conn.technicalDetails?.bEnd?.btsId || 'N/A',// 7
    "B-End Address": conn.technicalDetails?.bEnd?.address || 'N/A',// 8
    "Provider": conn.technicalDetails?.telcoProvider,// 9

    // Flattening Commercials
    "MRC": conn.commercials?.mrc || 0,// 10
    "Rate per MB": conn.commercials?.ratePerMb || 0,// 11
    "OTC": conn.commercials?.otc || 0,// 12
    "IP Count": conn.ips?.count || 0,// 13
    "IP Cost": conn.ips?.cost || 0,// 14
    
    // Dates (Formatted for readability)
    "Acceptance Date": conn.acceptanceDate ? new Date(conn.acceptanceDate).toLocaleDateString() : 'N/A',// 15
    "Created At": conn.createdAt ? new Date(conn.createdAt).toLocaleDateString() : 'N/A',// 16
    
    // Termination Info (if applicable)
    "Termination Raise Date": conn.terminationDetails?.raiseDate ? new Date(conn.terminationDetails.raiseDate).toLocaleDateString() : '',// 17
    "Final Termination Date": conn.terminationDetails?.finalDate ? new Date(conn.terminationDetails.finalDate).toLocaleDateString() : '',// 18
    "Termination Reason": conn.terminationDetails?.reason || ''// 19
  }));

  // 2. Create the Excel Workbook
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
  // Optional: Set column widths so data isn't cramped
  const wscols = [
    {wch: 18}, {wch: 12}, {wch: 12}, {wch: 10},
    {wch: 12}, {wch: 35}, {wch: 12}, {wch: 35}, {wch: 15}, // Tech Details
    {wch: 10}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 10}, // Commercals
    {wch: 15}, {wch: 15}, // Dates
    {wch: 15}, {wch: 15}, {wch: 15} // Termination Details
  ];
  worksheet['!cols'] = wscols;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Connections");

  // 3. Download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  saveAs(dataBlob, `${customerName}_Connection_Report.xlsx`);
};
