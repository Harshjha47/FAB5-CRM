const ExcelJS = require('exceljs');
const { generateTemplate } = require('../services/bulkConnection.service');
const { uploadToCloudinary } = require('../services/upload.service');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');
const Connection = require('../models/connectionModel');
const Customer = require('../models/customerModel');
const ROLES = require('../constants/roles');

const downloadTemplate = async (req, res) => {
  try {
    const workbook = await generateTemplate();

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=crm-bulk-connection-template.xlsx');

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error downloading template:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate template',
    });
  }
};

const uploadBulkConnections = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(req.file.buffer);

  const worksheet = workbook.worksheets[0];

  const rows = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < 3) return;
    if (!row.getCell(1).value && !row.getCell(2).value) return;

    let mrcCellValue = row.getCell(11).value;
    let extractedMrc = mrcCellValue;
    if (mrcCellValue && typeof mrcCellValue === 'object' && mrcCellValue.result !== undefined) {
      extractedMrc = mrcCellValue.result;
    }
    row.getCell(11).value = extractedMrc;

    const getCellValue = (cell) => {
      if (!cell) return null;
      if (typeof cell.value === 'object' && cell.value !== null) {
        return cell.text || cell.value.result || cell.value.richText?.map(t => t.text).join('');
      }
      return cell.value;
    }
    rows.push({
      excelRowNumber: rowNumber,
      serviceType: getCellValue(row.getCell(1)),
      bandwidth: getCellValue(row.getCell(2)),
      AbtsId: getCellValue(row.getCell(3)),
      Aaddress: getCellValue(row.getCell(4)),
      BbtsId: getCellValue(row.getCell(5)),
      Baddress: getCellValue(row.getCell(6)),
      telcoProvider: getCellValue(row.getCell(7)),
      ratePerMb: getCellValue(row.getCell(8)),
      ipCount: getCellValue(row.getCell(9)),
      ipCost: getCellValue(row.getCell(10)),
      mrc: extractedMrc,
      otc: getCellValue(row.getCell(12)),
      advance: getCellValue(row.getCell(13)),
      remarks: getCellValue(row.getCell(14))
    });
  });

  if (rows.length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Maximum 50 rows allowed',
    });
  }

  const validRows = [];
  const invalidRows = [];

  rows.forEach((row, index) => {

    const errors = [];

    const rawServiceType = String(row.serviceType || "").trim();
    const allowedServiceTypes = ["ILL", "DNC", "Mix", "Peering"];
    const matchedType = allowedServiceTypes.find((type) => type.toLowerCase() === rawServiceType.toLowerCase());
    const serviceType = matchedType || rawServiceType;
    row.serviceType = serviceType;
    const bandwidth = Number(row.bandwidth || 0);
    const ratePerMb = Number(row.ratePerMb || 0);
    if (!ratePerMb || ratePerMb <= 0) errors.push("ratePerMb is required");
    const ipCount = Number(row.ipCount || 0);
    const ipCost = Number(row.ipCost || 0);
    const mrc = Number(row.mrc || 0);

    if (!serviceType) {
      errors.push("serviceType is required");
    } else if (!allowedServiceTypes.includes(serviceType)) {
      errors.push("Invalid service type");
    }
    if (!bandwidth) errors.push("bandwidth is required");
    if (!row.AbtsId) errors.push("AbtsId is required");
    if (!row.Aaddress) errors.push("Aaddress is required");
    if (!row.telcoProvider) errors.push("telcoProvider is required");

    if (serviceType !== "ILL") {
      if (!row.BbtsId) errors.push("BbtsId is required");
      if (!row.Baddress) errors.push("Baddress is required");
    }

    const calculatedMrc = (ratePerMb * bandwidth) + (ipCount * ipCost);
    if (Math.round(calculatedMrc) !== Math.round(mrc)) {
      errors.push("MRC mismatch");
    }

    if (errors.length) {
      invalidRows.push({
        rowNumber: row.excelRowNumber,
        errors,
        row
      });
    } else {
      validRows.push({
        ...row,
        calculatedMrc
      });
    }
  });

  res.status(200).json({
    success: true,
    totalRows: rows.length,
    validRows,
    invalidRows
  });

});

const createBulkConnections = asyncHandler(async (req, res, next) => {
  const customerId = req.params.customerId;

  if (!req.files || !req.files.purchaseOrder || !req.files.purchaseOrder[0]) {
    return next(new AppError("Purchase order is required", 400));
  }
  if (!req.files || !req.files.caf || !req.files.caf[0]) {
    return next(new AppError("CAF is required", 400));
  }

  if (!req.body.connections) {
    return next(new AppError("No Connection Provided", 400));
  }

  let validRows;
  try {
    validRows = typeof req.body.connections === "string" ? JSON.parse(req.body.connections) : req.body.connections;
  } catch (error) {
    return next(new AppError("Invalid connections data format", 400));
  }

  if (!validRows || validRows.length === 0) {
    return next(new AppError("No valid connections to process", 400));
  }

  const customer = await Customer.findById(customerId);
  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  if (req.user.roles === ROLES.EMPLOYEE && !customer.managedBy.equals(req.user._id)) {
    return next(new AppError("You can only create orders for your own customers", 403));
  }

  const poUpload = await uploadToCloudinary(req.files.purchaseOrder[0], "crm/connections/purchaseOrders");
  const sharedPurchaseOrder = {
    fileName: req.files.purchaseOrder[0].originalname,
    url: poUpload.secure_url,
    publicId: poUpload.public_id
  };

  const cafUpload = await uploadToCloudinary(req.files.caf[0], "crm/connections/cafs");
  const sharedCaf = {
    fileName: req.files.caf[0].originalname,
    url: cafUpload.secure_url,
    publicId: cafUpload.public_id
  };

  let sharedBusinessAgreement = null;
  if (req.files.businessAgreement && req.files.businessAgreement[0]) {
    const baUpload = await uploadToCloudinary(req.files.businessAgreement[0], "crm/connections/businessAgreements");
    sharedBusinessAgreement = {
      fileName: req.files.businessAgreement[0].originalname,
      url: baUpload.secure_url,
      publicId: baUpload.public_id
    };
  }

  const connectionsToInsert = validRows.map(row => ({
    customer: customer._id,
    createdBy: req.user._id,
    serviceType: row.serviceType,
    bandwidth: row.bandwidth,
    remarks: row.remarks || "",
    purchaseOrder: sharedPurchaseOrder,
    caf: sharedCaf,
    businessAgreement: sharedBusinessAgreement || undefined,
    technicalDetails: {
      aEnd: {
        btsId: row.AbtsId,
        address: row.Aaddress
      },
      bEnd: {
        btsId: row.BbtsId,
        address: row.Baddress
      },
      telcoProvider: row.telcoProvider,
    },
    commercials: {
      mrc: row.calculatedMrc || row.mrc || 0,
      ratePerMb: row.ratePerMb || 0,
      otc: row.otc || 0,
      advance: row.advance || 0,
    },
    ips: {
      count: row.ipCount || 0,
      cost: row.ipCost || 0
    },
    status: "Pending",

    history: [{
      action: "CREATED",
      performedBy: req.user._id,
      date: new Date(),
      note: "Order created",
      serviceType: row.serviceType,
      bandwidth: row.bandwidth,
      technicalDetails: {
        aEnd: { btsId: row.AbtsId, address: row.Aaddress },
        bEnd: { btsId: row.BbtsId, address: row.Baddress },
        telcoProvider: row.telcoProvider,
      },
      commercials: {
        mrc: row.calculatedMrc || row.mrc || 0,
        ratePerMb: row.ratePerMb || 0,
        otc: row.otc || 0,
        advance: row.advance || 0,
      },
      ips: {
        count: row.ipCount || 0,
        cost: row.ipCost || 0
      },
    }],
  }))

  const createdConnections = await Connection.create(connectionsToInsert);

  res.status(201).json({
    success: true,
    message: "Connections created successfully",
    data: createdConnections
  });

});

module.exports = {
  downloadTemplate,
  uploadBulkConnections,
  createBulkConnections
};