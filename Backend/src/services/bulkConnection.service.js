const ExcelJS = require("exceljs");

const generateTemplate = async () => {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Template");

  // Define the column headers
  worksheet.columns = [
    { key: "serviceType", width: 12 },
    { key: "bandwidth", width: 10 },
    { key: "AbtsId", width: 15 },
    { key: "Aaddress", width: 25 },
    { key: "BbtsId", width: 15 },
    { key: "Baddress", width: 25 },
    { key: "telcoProvider", width: 15 },
    { key: "ratePerMb", width: 10 },
    { key: "ipCount", width: 10 },
    { key: "ipCost", width: 10 },
    { key: "mrc", width: 15 },
    { key: "otc", width: 15 },
    { key: "advance", width: 15 },
    { key: "remarks", width: 30 }
  ];

  const headerRow = worksheet.addRow({
    serviceType: "Service Type",
    bandwidth: "Bandwidth",
    AbtsId: "A-End BTS ID",
    Aaddress: "A-End Address",
    BbtsId: "B-End BTS ID",
    Baddress: "B-End Address",
    telcoProvider: "Telecom Provider",
    ratePerMb: "Rate Per MB",
    ipCount: "No. of IPs",
    ipCost: "Per IP Cost",
    mrc: "MRC",
    otc: "OTC",
    advance: "Advance",
    remarks: "Remarks"
  });

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    cell.protection = { locked: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // Formula for mrc
  for (let i = 2; i <= 101; i++) {
    const mrcFormula = `IF(AND(B${i}<>"", H${i}<>""), (B${i}*H${i}) + IF(AND(I${i}<>"", J${i}<>""), I${i}*J${i}, 0), "")`;
    const row = worksheet.addRow({
      mrc: {
        formula: mrcFormula,
        result: ""
      }
    });
    for (let col = 1; col <= 14; col++) {
      row.getCell(col).protection = { locked: false };
    }
    const mrcCell = row.getCell("mrc");
    mrcCell.protection = { locked: true };
  }

  await worksheet.protect('fab5', {
    selectLockedCells: false,
    selectUnlockedCells: true,
  })

  return workbook;
};

module.exports = { generateTemplate }
