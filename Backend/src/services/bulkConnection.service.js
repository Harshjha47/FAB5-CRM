const ExcelJS = require("exceljs");

const generateTemplate = async () => {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Template");

  worksheet.columns = [
    { key: "serviceType",  width: 12 },
    { key: "bandwidth",    width: 10 },
    { key: "AbtsId",       width: 15 },
    { key: "Aaddress",     width: 25 },
    { key: "Alatitude",    width: 15 }, // ✅ new - col E
    { key: "Alongitude",   width: 15 }, // ✅ new - col F
    { key: "BbtsId",       width: 15 },
    { key: "Baddress",     width: 25 },
    { key: "Blatitude",    width: 15 }, // ✅ new - col I
    { key: "Blongitude",   width: 15 }, // ✅ new - col J
    { key: "telcoProvider",width: 15 },
    { key: "ratePerMb",    width: 10 }, // col L
    { key: "ipCount",      width: 10 }, // col M
    { key: "ipCost",       width: 10 }, // col N
    { key: "mrc",          width: 15 }, // col O
    { key: "otc",          width: 15 },
    { key: "advance",      width: 15 },
    { key: "remarks",      width: 30 },
  ];

  const headerRow = worksheet.addRow({
    serviceType:   "Service Type",
    bandwidth:     "Bandwidth",
    AbtsId:        "A-End BTS ID",
    Aaddress:      "A-End Address",
    Alatitude:     "A-End Latitude",  // ✅ new
    Alongitude:    "A-End Longitude", // ✅ new
    BbtsId:        "B-End BTS ID",
    Baddress:      "B-End Address",
    Blatitude:     "B-End Latitude",  // ✅ new
    Blongitude:    "B-End Longitude", // ✅ new
    telcoProvider: "Telecom Provider",
    ratePerMb:     "Rate Per MB",
    ipCount:       "No. of IPs",
    ipCost:        "Per IP Cost",
    mrc:           "MRC",
    otc:           "OTC",
    advance:       "Advance",
    remarks:       "Remarks",
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

  // B=bandwidth, L=ratePerMb, M=ipCount, N=ipCost, O=mrc
  for (let i = 2; i <= 101; i++) {
    const mrcFormula = `IF(AND(B${i}<>"", L${i}<>""), (B${i}*L${i}) + IF(AND(M${i}<>"", N${i}<>""), M${i}*N${i}, 0), "")`;
    const row = worksheet.addRow({
      mrc: { formula: mrcFormula, result: "" }
    });
    for (let col = 1; col <= 18; col++) { // ✅ updated from 14 to 18
      row.getCell(col).protection = { locked: false };
    }
    row.getCell("mrc").protection = { locked: true };
  }

  await worksheet.protect('fab5', {
    selectLockedCells: false,
    selectUnlockedCells: true,
  });

  return workbook;
};

module.exports = { generateTemplate };