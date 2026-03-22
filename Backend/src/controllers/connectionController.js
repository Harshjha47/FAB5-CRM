const Connection = require("../models/connectionModel");
const Customer = require("../models/customerModel");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
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

  if (!serviceType || !bandwidth || !AbtsId || !Aaddress || !BbtsId || !Baddress || !telcoProvider) {
    return next(new AppError("serviceType, bandwidth, technical details and telcoProvider are required", 400));
  }

  const customer = await Customer.findById(customerId);
  if (!customer) return next(new AppError("Customer not found", 404));

  if (req.user.role === ROLES.EMPLOYEE && !customer.managedBy.equals(req.user._id)) {
    return next(new AppError("You can only create orders for your own customers", 403));
  }

  const connection = await Connection.create({
    customer: customerId,
    createdBy: req.user._id,
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

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    connection,
  });
}); // DONE

const connectionByCustomer = asyncHandler(async (req, res, next) => {

  const customer = await Customer.findById(req.params.customerId);
  if (!customer) return next(new AppError("Customer not found", 404));

  if (req.user.role === ROLES.EMPLOYEE && !customer.managedBy.equals(req.user._id)) {
    return next(new AppError("You can only view your own customers", 403));
  }

  const connections = await Connection.find({ customer: req.params.customerId }).sort({ createdAt: -1 });

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
    note: req.body.note || "Telecom provisioning completed",
    ...buildSnapshot(connection),
  });

  await connection.save();

  logger.info("Connection marked as Generation", {
    opportunityId: connection.opportunityId,
    by: req.user._id,
  });

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
    note: `Activated with LSI ID: ${telecoCircuitId}`,
    ...buildSnapshot(connection),
  });

  await connection.save();

  logger.info("Connection activated", {
    opportunityId: connection.opportunityId,
    telecoCircuitId,
    activatedBy: req.user._id,
  });

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
    return next(new AppError("Cannot only edit a active connections", 400));
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only edit your own customers' connections", 403));
    }
  }

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

  res.status(200).json({
    success: true,
    message: `${actionType} request submitted — awaiting approval`,
    opportunityId: connection.opportunityId,
  });
}); // DONE

const shiftConnection = asyncHandler(async (req, res, next) => {
  const { ABtsId, BBtsId, serviceType, otc } = req.body;

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

  connection.history.push({
    action: "SHIFTING",
    performedBy: req.user._id,
    date: new Date(),
    note: "Location shift requested",
    ...buildSnapshot(connection),
  });

  if (serviceType) connection.serviceType = serviceType;
  if (ABtsId) connection.technicalDetails.aEnd.btsId = ABtsId;
  if (BBtsId) connection.technicalDetails.bEnd.btsId = BBtsId;
  if (otc) connection.commercials.otc = otc;
  connection.status = "Pending";

  await connection.save();

  logger.info("Connection shifted requested", {
    opportunityId: connection.opportunityId,
    by: req.user._id,
  })

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
  activateConnection,
  editConnection,
  shiftConnection,
  addIp,
};
