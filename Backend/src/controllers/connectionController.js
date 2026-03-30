const Connection = require("../models/connectionModel");
const Customer = require("../models/customerModel");
const { uploadToCloudinary } = require("../services/upload.service");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const { sendConnectionEmail, sendChangeEmail } = require("../services/sendEmail")
const ROLES = require("../constants/roles");
const User = require("../models/userModel");

const buildSnapshot = (connection) => ({
  serviceType: connection.serviceType,
  bandwidth: connection.bandwidth,
  technicalDetails: connection.technicalDetails,
  commercials: connection.commercials,
  ips: connection.ips,
  terminationDetails: connection.terminationDetails || {},
});

const createConnection = asyncHandler(async (req, res, next) => {
  const customerId = req.params.customerId;
  const {
    AbtsId, Aaddress,
    BbtsId, Baddress,
    telcoProvider,
    serviceType, bandwidth,
    mrc, otc, advance, ratePerMb,
    ipCount, ipCost,
  } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) return next(new AppError("Customer not found", 404));

  if (req.user.role === ROLES.EMPLOYEE && !customer.managedBy.equals(req.user._id)) {
    return next(new AppError("You can only create orders for your own customers", 403));
  }

  let purchaseOrder = null;
  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file, "crm/connections");
    purchaseOrder = {
      fileName: req.file.originalname,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
    };
  }

  const connection = await Connection.create({
    customer: customerId,
    createdBy: req.user._id,
    serviceType,
    bandwidth,
    purchaseOrder,
    technicalDetails: {
      aEnd: { btsId: AbtsId, address: Aaddress },
      bEnd: { btsId: BbtsId, address: Baddress },
      telcoProvider,
    },
    commercials: {
      mrc: mrc || 0,
      ratePerMb: ratePerMb || 0,
      otc: otc || 0,
      advance: advance || 0,
    },
    ips: {
      count: ipCount || 0,
      cost: ipCost || 0
    },
    status: "Pending",
    history: [{
      action: "CREATED",
      performedBy: req.user._id,
      date: new Date(),
      note: "Order created",
      serviceType,
      bandwidth,
      technicalDetails: {
        aEnd: { btsId: AbtsId, address: Aaddress },
        bEnd: { btsId: BbtsId, address: Baddress },
        telcoProvider,
      },
      commercials: {
        mrc: mrc || 0,
        ratePerMb: ratePerMb || 0,
        otc: otc || 0,
        advance: advance || 0,
      },
      ips: {
        count: ipCount || 0,
        cost: ipCost || 0
      },
    }],
  });

  logger.info("Connection created", {
    opportunityId: connection.opportunityId,
    customerId,
    createdBy: req.user._id,
  });

  try {
    await sendConnectionEmail("WELCOME", connection, req.user);
  } catch (error) {
    logger.error("Failed to send WELCOME email", {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    connection,
  });
});

const connectionByCustomer = asyncHandler(async (req, res, next) => {

  const customer = await Customer.findById(req.params.customerId);
  if (!customer) return next(new AppError("Customer not found", 404));

  if (req.user.role === ROLES.EMPLOYEE && !customer.managedBy.equals(req.user._id)) {
    return next(new AppError("You can only view your own customers", 403));
  }

  const connections = await Connection.find({ customer: req.params.customerId }).sort({ createdAt: -1 }).populate("customer");

  res.status(200).json({
    success: true,
    count: connections.length,
    connections,
  });
}); // DONE

const getConnectionById = asyncHandler(async (req, res, next) => {

  const connection = await Connection.findById(req.params.id)
    .populate("customer", "name email mobile person")
    .populate("createdBy", "name email role")
    .populate("approvedBy", "name email role")
    .populate("activatedBy", "name email role")
    .populate("history.performedBy", "name email role");

  if (!connection) return next(new AppError("Connection not found", 404));

  res.status(200).json({ success: true, connection });
}); // DONE

const getConnectionsByStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const validStatuses = ["Pending", "Approved", "Generation", "Active", "Notice Period", "Disconnected", "Rejected"];
  if (!validStatuses.includes(status)) {
    return next(new AppError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400));
  }

  if (req.user.role === ROLES.ORDER_GENERATION && status !== "Approved") {
    return next(new AppError("Order Generation can only view Approved orders", 403));
  }
  if (req.user.role === ROLES.PROJECT_MANAGER && status !== "Generation") {
    return next(new AppError("Project Manager can only view Generation orders", 403));
  }

  let query = { status };
  if (req.user.role === ROLES.EMPLOYEE) {
    const myCustomers = await Customer.find({ managedBy: req.user._id }, { _id: 1 });
    query.customer = { $in: myCustomers.map((c) => c._id) };
  }

  const [connections, total] = await Promise.all([
    Connection.find(query)
      .populate("customer", "name email mobile person managedBy")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Connection.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    status,
    total,
    page,
    pages: Math.ceil(total / limit),
    connections,
  });
}); // DONE

const approveConnection = asyncHandler(async (req, res, next) => {
  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status !== "Pending") {
    return next(new AppError(`Cannot approve — current status is ${connection.status}`, 400));
  }
  if (connection.status === "Cancelled") {
    return next(new AppError(`Cannot approve a cancelled connection`, 400));
  }

  connection.status = "Approved";
  connection.approvedBy = req.user._id;
  connection.history.push({
    action: "APPROVED",
    performedBy: req.user._id,
    note: req.body.note || "Approved",
    ...buildSnapshot(connection),
  })
  await connection.save();

  logger.info("Connection Approved", {
    opportunityId: connection.opportunityId,
    approvedBy: req.user._id,
  })

  try {
    await sendConnectionEmail("ORDER_APPROVED", connection, req.user);
  } catch (error) {
    logger.error("Failed to send ORDER_APPROVED email", {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Connection Approved Successfully",
    opportunityId: connection.opportunityId,
    status: connection.status,
  });
}); // DONE

const rejectConnection = asyncHandler(async (req, res, next) => {
  const { reason } = req.body
  if (!reason) return next(new AppError("Rejection reason is required", 400));

  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  const nonRejectableStatuses = ["Active", "Notice Period", "Disconnected", "Rejected"];
  if (nonRejectableStatuses.includes(connection.status)) {
    return next(new AppError(`Cannot reject a connection with status: ${connection.status}`, 400));
  }

  connection.status = "Rejected";
  connection.rejectionDetails = {
    reason,
    rejectedBy: req.user._id,
    rejectedAt: new Date(),
  };
  connection.history.push({
    action: "REJECTED",
    performedBy: req.user._id,
    note: reason,
    ...buildSnapshot(connection),
  });
  await connection.save();

  logger.info("Connection Rejected", {
    opportunityId: connection.opportunityId,
    rejectedBy: req.user._id,
    reason,
  })

  try {
    await sendConnectionEmail("ORDER_REJECTED", connection, req.user);
  } catch (error) {
    logger.error("Failed to send ORDER_REJECTED email", {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Connection rejected",
    opportunityId: connection.opportunityId,
    status: connection.status,
  });
}); // DONE

const markAsGeneration = asyncHandler(async (req, res, next) => {
  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status !== "Approved") {
    return next(new AppError(`Cannot mark as Generation — current status is ${connection.status}`, 400));
  }

  connection.status = "Generation";
  connection.history.push({
    action: "GENERATION",
    performedBy: req.user._id,
    note: req.body.note || "Under provisioning",
    ...buildSnapshot(connection),
  });

  await connection.save();

  logger.info("Connection marked as Generation", {
    opportunityId: connection.opportunityId,
    by: req.user._id,
  });

  try {
    await sendConnectionEmail("ORDER_GENERATED", connection, req.user);
  } catch (error) {
    logger.error("Failed to send ORDER_GENERATED email", {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Order marked as Generation — awaiting Project Manager activation",
    opportunityId: connection.opportunityId,
    status: connection.status,
  });
}) // DONE

const activateConnection = asyncHandler(async (req, res, next) => {
  const { telecoCircuitId, acceptanceDate } = req.body;

  if (!telecoCircuitId) return next(new AppError("Telecom Circuit ID (LSI ID) is required", 400));
  if (!acceptanceDate) return next(new AppError("Acceptance date is required", 400));

  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status !== "Generation") {
    return next(new AppError(`Cannot activate — current status is ${connection.status}`, 400));
  }

  connection.status = "Active";
  connection.telecoCircuitId = telecoCircuitId;
  connection.acceptanceDate = new Date(acceptanceDate);
  connection.activatedBy = req.user._id;
  connection.history.push({
    action: "ACTIVATED",
    performedBy: req.user._id,
    note: `Activated`,
    ...buildSnapshot(connection),
  });

  await connection.save();

  logger.info("Connection activated", {
    opportunityId: connection.opportunityId,
    telecoCircuitId,
    activatedBy: req.user._id,
  });

  try {
    await sendConnectionEmail("ACTIVATED", connection, req.user);
  } catch (error) {
    logger.error("Failed to send ACTIVATED email", {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Connection activated successfully",
    opportunityId: connection.opportunityId,
    fabCircuitId: connection.fabCircuitId,
    telecoCircuitId: connection.telecoCircuitId,
    status: connection.status,
  });
}); // DONE

const editConnection = asyncHandler(async (req, res, next) => {
  const { serviceType, bandwidth, mrc, ratePerMb } = req.body;

  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status !== "Active") {
    return next(new AppError("Cannot only edit an active connections", 400));
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only edit your own customers' connections", 403));
    }
  }

  const oldBandwidth = connection.bandwidth;
  const newBandwidth = bandwidth || connection.bandwidth;
  const actionType = bandwidth && connection.bandwidth > bandwidth ? "DOWNGRADE" : "UPGRADE";

  connection.history.push({
    action: actionType,
    performedBy: req.user._id,
    date: new Date(),
    note: `${actionType}: ${connection.bandwidth} → ${bandwidth || connection.bandwidth}`,
    ...buildSnapshot(connection),
  });

  if (serviceType) connection.serviceType = serviceType;
  if (bandwidth) connection.bandwidth = bandwidth;
  if (mrc) connection.commercials.mrc = mrc;
  if (ratePerMb) connection.commercials.ratePerMb = ratePerMb;

  connection.status = "Pending";
  await connection.save();

  logger.info("Connection edited", {
    opportunityId: connection.opportunityId,
    createdBy: req.user._id,
    action: actionType
  })

  try {
    await sendChangeEmail(actionType, {
      opportunityId: connection.opportunityId,
      oldBandwidth,
      newBandwidth,
    }, req.user);
  } catch (error) {
    logger.error(`Failed to send ${actionType} email`, {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: `${actionType} request submitted — awaiting approval`,
    opportunityId: connection.opportunityId,
  });
}); // DONE

const editRejectedConnection = asyncHandler(async (req, res, next) => {
  const {
    AbtsId, Aaddress,
    BbtsId, Baddress,
    telcoProvider,
    serviceType, bandwidth,
    mrc, otc, advance, ratePerMb,
    ipCount, ipCost,
  } = req.body;

  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status !== "Rejected" && connection.status !== "Pending") {
    return next(new AppError(`Cannot edit a connection with status: ${connection.status}`, 400));
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only edit your own customers' connections", 403));
    }
  }

  if (serviceType) connection.serviceType = serviceType;
  if (bandwidth) connection.bandwidth = bandwidth;

  if (AbtsId) connection.technicalDetails.aEnd.btsId = AbtsId;
  if (Aaddress) connection.technicalDetails.aEnd.address = Aaddress;
  if (BbtsId) connection.technicalDetails.bEnd.btsId = BbtsId;
  if (Baddress) connection.technicalDetails.bEnd.address = Baddress;
  if (telcoProvider) connection.technicalDetails.telcoProvider = telcoProvider;

  if (mrc) connection.commercials.mrc = mrc;
  if (ratePerMb) connection.commercials.ratePerMb = ratePerMb;
  if (otc) connection.commercials.otc = otc;
  if (advance) connection.commercials.advance = advance;
  if (ipCount) connection.ips.count = ipCount;
  if (ipCost) connection.ips.cost = ipCost;

  if (connection.status === "Rejected") {
    connection.rejectionDetails = undefined;
  }
  
  connection.history.push({
    action: "EDITED",
    performedBy: req.user._id,
    note: "Re-Submitted",
    ...buildSnapshot(connection),
  });

  connection.status = "Pending";

  await connection.save();

  logger.info("Rejected connection edited", {
    opportunityId: connection.opportunityId,
    editedBy: req.user._id
  });

  res.status(200).json({
    success: true,
    message: "Connection edited and resubmitted for approval",
    opportunityId: connection.opportunityId,
    status: connection.status,
  });

});

const cancelConnection = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new AppError("Cancellation Reason is Required", 400))
  }

  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status == "Cancelled") {
    return next(new AppError(`Already Cancelled`, 400));
  }

  if (connection.status === "Active" || connection.status === "Disconnected" || connection.status === "Notice Period") {
    return next(new AppError(`Cannot cancel a connection with status: ${connection.status}`, 400));
  }

  connection.status = "Cancelled";
  connection.history.push({
    action: "CANCELLED",
    performedBy: req.user._id,
    note: reason,
    ...buildSnapshot(connection),
  })

  await connection.save();

  logger.info("Connection Cancelled", {
    opportunityId: connection.opportunityId,
    cancelledBy: req.user._id,
    reason,
  });

  try {
    await sendConnectionEmail("CANCELLED", {
      opportunityId: connection.opportunityId,
      reason,
    }, req.user);
  } catch (error) {
    logger.error("Failed to send CANCELLED email", {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Connection Cancelled Succesfully",
    status: connection.status,
  })

});// DONE

const shiftConnection = asyncHandler(async (req, res, next) => {
  const { ABtsId, BBtsId, otc } = req.body;

  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status !== "Active") {
    return next(new AppError("Cannot only shift an Active connections", 400));
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only shift your own customers' connections", 403));
    }
  }

  const currentAEnd = connection.technicalDetails?.aEnd?.btsId;
  const currentBEnd = connection.technicalDetails?.bEnd?.btsId;

  connection.history.push({
    action: "SHIFTING",
    performedBy: req.user._id,
    date: new Date(),
    note: "Location shift requested",
    ...buildSnapshot(connection),
  });

  if (ABtsId) connection.technicalDetails.aEnd.btsId = ABtsId;
  if (BBtsId) connection.technicalDetails.bEnd.btsId = BBtsId;
  if (otc) connection.commercials.otc = otc;
  connection.status = "Pending";

  await connection.save();

  logger.info("Connection shifted requested", {
    opportunityId: connection.opportunityId,
    by: req.user._id,
  })

  try {
    await sendChangeEmail("SHIFTING", {
      opportunityId: connection.opportunityId,
      currentAEnd: currentAEnd || "N/A",
      newAEnd: ABtsId || currentAEnd || "N/A",
      currentBEnd: currentBEnd || "N/A",
      newBEnd: BBtsId || currentBEnd || "N/A",
    }, req.user);
  } catch (error) {
    logger.error("Failed to send SHIFTING email", {
      opportunityId: connection.opportunityId,
      error: error.message,
    });
  }

  res.status(200).json({
    success: true,
    message: "Shift request submitted — awaiting approval",
    opportunityId: connection.opportunityId
  });
}); // DONE

const addIp = asyncHandler(async (req, res, next) => {
  const { count, cost } = req.body;
  if (!count || !cost) return next(new AppError("Missing required fields", 400));

  const connection = await Connection.findById(req.params.id);
  if (!connection) return next(new AppError("Connection not found", 404));

  if (connection.status !== "Active") {
    return next(new AppError("Can only add IPs to Active connections", 400));
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only modify your own customers' connections", 403));
    }
  }

  connection.history.push({
    action: "IP_ADDITION",
    performedBy: req.user._id,
    date: new Date(),
    note: `Adding ${count} IPs at cost ${cost}`,
    ips: { count: Number(count), cost: Number(cost) },
    ...buildSnapshot(connection),
  });

  connection.ips.count = (connection.ips?.count || 0) + Number(count);
  connection.ips.cost = (connection.ips?.cost || 0) + Number(cost);
  connection.status = "Pending";

  await connection.save();

  logger.info("IP addition requested", {
    opportunityId: connection.opportunityId,
    count,
    by: req.user._id
  })

  return res.status(200).json({
    success: true,
    message: "IP addition request submitted — awaiting approval",
    opportunityId: connection.opportunityId,
    ips: connection.ips,
  });
}); // DONE


module.exports = {
  createConnection,
  connectionByCustomer,
  getConnectionById,
  getConnectionsByStatus,
  approveConnection,
  rejectConnection,
  markAsGeneration,
  cancelConnection,
  activateConnection,
  editRejectedConnection,
  editConnection,
  shiftConnection,
  addIp,
};
