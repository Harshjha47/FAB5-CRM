const Customer = require("../models/customerModel");
const Connection = require("../models/connectionModel");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const ROLES = require("../constants/roles");
const { sendTransactionEmail } = require("../services/sendEmail");

const buildHistorySnapshot = (connection) => ({
  serviceType: connection.serviceType,
  bandwidth: connection.bandwidth,
  technicalDetails: connection.technicalDetails,
  commercials: connection.commercials,
  ips: connection.ips,
  terminationDetails: connection.terminationDetails || {},
});

const createCustomer = asyncHandler(async (req, res, next) => {
  const { name, email, mobile, person, billingProfiles } = req.body;

  if (!name || !email || !mobile || !person) {
    return next(new AppError("name, email, mobile and person are required", 400));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError("Please enter a valid email", 400));
  }

  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(mobile)) {
    return next(new AppError("Please enter a valid 10-digit Indian mobile number", 400));
  }

  const existCustomer = await Customer.findOne({
    email: {$regex: new RegExp(`^${email}$`, "i")}
  });
  if (existCustomer) {
    return next(new AppError("Customer with this email already exists", 400));
  }

  const customer = await Customer.create({
    name,
    person,
    email,
    mobile,
    managedBy: req.user._id,
    billingProfiles: billingProfiles || [],
    isActive: true,
  });
  logger.info("Customer Created", {
    customerId: customer._id,
    name: customer.name,
    createdBy: req.user._id,
  })

  res.status(201).json({
    success: true,
    message: "Customer created successfully",
    customer,
  });
});

const getAllCustomers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    Customer.find()
      .populate("managedBy", "name email role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Customer.countDocuments(),
  ]);
  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total, limit),
    customers,
  });
});

const getCustomersById = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id)
    .populate("managedBy", "name role email")
    .populate({
      path: "connections",
      select: "opportunityId serviceType bandwidth status createdAt",
      options: { sort: { cretedAt: -1 } },
    })
  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  res.status(200).json({
    success: true,
    customer,
  });
});

const getCustomersByEmp = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    Customer.find({ managedBy: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Customer.countDocuments({ managedBy: req.user._id }),

  ])

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total, limit),
    customers,
  });
});

const disconnection = asyncHandler(async (req, res, next) => {
  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only disconnect your own customers", 403));
    }
  }
  const { reason } = req.body;
  if (!reason) {
    return next(new AppError("Disconnection reason is required", 400));
  }

  const connection = await Connection.findById(req.params.id);
  if (!connection) {
    return next(new AppError("Connection not found", 404));
  }
  if (connection.status !== "Active") {
    return next(new AppError(`Cannot disconnect a connection with status: ${connection.status}`, 400));
  }

  const today = new Date();
  const finalDate = new Date();
  finalDate.setDate(today.getDate() + 30);

  connection.terminationDetails = { reason, raiseDate: today, finalDate };
  connection.status = "Notice Period";
  connection.history.push({
    action: "DISCONNECT_INITIATED",
    performedBy: req.user._id,
    note: reason,
    ...buildHistorySnapshot(connection),
  });

  const savedConnection = await connection.save();

  logger.info("Disconnection initiated", {
    connectionId: connection._id,
    opportunityId: connection.opportunityId,
    by: req.user._id,
  });

  try {
    const customer = await Customer.findById(connection.customer);
    await sendTransactionEmail("DISCONNECTION", customer, req.user);
  } catch (err) {
    logger.error("Failed to send disconnection email", { error: err.message });
  }

  res.status(200).json({
    success: true,
    message: "Disconnection initiated successfully",
    connection: savedConnection,
  });

});

const extension = asyncHandler(async (req, res, next) => {

  const { newDate } = req.body;
  if (!newDate) {
    return next(new AppError("New extension date is required", 400));
  }

  const parsedNewDate = new Date(newDate);
  if (isNaN(parsedNewDate) || parsedNewDate <= new Date()) {
    return next(new AppError("Extension date must be a valid future date", 400));
  }

  const connection = await Connection.findById(req.params.id);
  if (!connection) {
    return next(new AppError("Connection not found", 404));
  }
  if (connection.status !== "Notice Period") {
    return next(new AppError(`Can only extend connections in Notice Period`, 400));
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only extend your own customers", 403));
    }
  }

  connection.terminationDetails.raiseDate = new Date();
  connection.terminationDetails.finalDate = parsedNewDate;
  connection.history.push({
    action: "EXTENDED",
    performedBy: req.user._id,
    note: `Extended to ${parsedNewDate.toISOString().split("T")[0]}`,
    ...buildHistorySnapshot(connection),
  });

  const savedConnection = await connection.save();

  logger.info("Connection extended", {
    connectionId: connection._id,
    opportunityId: connection.opportunityId,
    newDate: parsedNewDate,
    by: req.user._id,
  });

  res.status(200).json({
    success: true,
    message: "Extended successfully",
    connection: savedConnection,
  });
});

const retention = asyncHandler(async (req, res, next) => {

  const connection = await Connection.findById(req.params.id);
  if (!connection) {
    return next(new AppError("Connection not found", 404));
  }
  if (connection.status !== "Notice Period") {
    return next(new AppError(`Can only retain connections in Notice Period`, 400));
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const customer = await Customer.findById(connection.customer);
    if (!customer?.managedBy.equals(req.user._id)) {
      return next(new AppError("You can only retain your own customers", 403));
    }
  }

  connection.terminationDetails = {
    raiseDate: null,
    finalDate: null,
    reason: null,
  };
  connection.status = "Active";
  connection.history.push({
    action: "RETAINED",
    performedBy: req.user._id,
    note: "Disconnection cancelled — connection retained",
    ...buildHistorySnapshot(connection),
  });

  const savedConnection = await connection.save();

  logger.info("Connection retained", {
    connectionId: connection._id,
    opportunityId: connection.opportunityId,
    by: req.user._id,
  });

  try {
    const customer = await Customer.findById(connection.customer);
    await sendTransactionEmail("RETENTION", customer, req.user);
  } catch (err) {
    logger.error("Failed to send retention email", { error: err.message });
  }

  res.status(200).json({
    success: true,
    message: "Customer successfully retained! Disconnection cancelled.",
    connection: savedConnection,
  });
});

module.exports = {
  disconnection,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  extension,
  retention,
  createCustomer,
};
