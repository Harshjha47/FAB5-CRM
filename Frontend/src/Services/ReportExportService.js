import * as XLSX from 'xlsx';

export const generateRoleBasedReport = (customers, connections, userRole) => {
  const isAdmin = userRole === 'admin';
  const isProjectManager = userRole === 'project_manager';
  const isEmployee = userRole === 'employee';

  // console.log(connections)

  const wb = XLSX.utils.book_new();

  // 1. FORMAT CUSTOMER DATA (Admin & Employee Only)
  if (isAdmin || isEmployee) {
    const customerSheetData = customers.map((c) => {
      const profiles = c.billingProfiles || c.billingProfile || [];
      let customerRow = {
        "Customer Name": c.name || "N/A",
        "Name": c.person || "N/A",
        "Mobile": c.mobile || "N/A",
        "Email": c.email || "N/A",
      };

      if (profiles.length === 0) {
        customerRow["GST 1"] = "N/A";
      } else {
        profiles.forEach((profile, index) => {
          customerRow[`GST ${index + 1}`] = profile.gstNumber || "N/A";
        });
      }
      return customerRow;
    });

    const wsCustomers = XLSX.utils.json_to_sheet(customerSheetData);
    wsCustomers['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsCustomers, "Customer");
  }

  // 2. FORMAT INVENTORY DATA (Role-Based Columns)
  const inventorySheetData = connections.map((conn) => {
    let row = {};

    // Common Base
    row["Customer Name"] = conn.customer?.name ||conn?.customerName || "N/A";

    // Admin & Project Manager Specific
    if (isAdmin || isProjectManager) {
      row["Sales Manager"] = conn.createdBy?.name ||conn?.salesManager|| "N/A";
      row["Airtel LSI"] = conn.telecoCircuitId || "N/A";
    }

    row["FAB Circuit ID"] = conn.fabCircuitId || conn.opportunityId || "N/A";
    row["Status"] = conn.status || "N/A";
    row["Service Type"] = conn.serviceType || "N/A";

    // Admin & Project Manager Specific (Old Bandwidth from History)
    if (isAdmin || isProjectManager) {
      const bandwidthChanges = conn.history?.filter(h => h.action === 'UPGRADE' || h.action === 'DOWNGRADE');
      const lastChange = bandwidthChanges?.[bandwidthChanges.length - 1];
      // Extracts numbers from strings like "UPGRADE: 100 → 200"
      row["Old Bandwidth"] = lastChange ? lastChange.note.split('→')[0].replace(/[^0-9]/g, '').trim() : "N/A";
    }

    row["Bandwidth (Mbps)"] = conn.bandwidth || 0;

    // Financials: Admin & Employee Only
    if (isAdmin || isEmployee) {
      row["MRC"] = conn.commercials?.mrc || 0;
      row["Rate per MB"] = conn.commercials?.ratePerMb || 0;
      row["OTC"] = conn.commercials?.otc || 0;
    }

    // Provider Cost: Admin Only
    if (isAdmin) {
      row["Airtel Rate"] = conn.providerCost?.mrc || 0;
    }

    

    // Common Trailing Fields
    row["Provider"] = conn.technicalDetails?.telcoProvider || conn?.provider ||"N/A";
    row["Acceptance Date"] = conn.acceptanceDate ? new Date(conn.acceptanceDate).toLocaleDateString() : "N/A";
    row["Created At"] = conn.createdAt ? new Date(conn.createdAt).toLocaleDateString() : "N/A";
    row["Termination Raise Date"] = conn.terminationDetails?.raiseDate ? new Date(conn.terminationDetails.raiseDate).toLocaleDateString() : "N/A";
    row["Final Termination Date"] = conn.terminationDetails?.finalDate ? new Date(conn.terminationDetails.finalDate).toLocaleDateString() : "N/A";
    row["Termination Reason"] = conn.terminationDetails?.reason || "N/A";
    row["A BTS ID"] = conn.technicalDetails?.aEnd?.btsId || "N/A";
    row["B BTS ID"] = conn.technicalDetails?.bEnd?.btsId || "N/A";

    return row;
  });

  const wsInventory = XLSX.utils.json_to_sheet(inventorySheetData);
  wsInventory['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsInventory, "Inventory");

  // 3. TRIGGER DOWNLOAD
  const timestamp = new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb, `FAB5_Report_${userRole.toUpperCase()}_${timestamp}.xlsx`);
};