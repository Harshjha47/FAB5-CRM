const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const Customer = require("../models/customerModel");
const Connection = require("../models/connectionModel");

const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const searchCustomersForInvoice = asyncHandler(async (req, res, next) => {
  const { search, page = 1, limit = 15, sort = 'recent' } = req.query;
  const filter = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { mobile: { $regex: search, $options: "i" } },
      { person: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const query = Customer.find(filter).select("name person email");
  if (sort === "alphabetical") {
    query.sort({ name: 1 });
  } else {
    query.sort({ createdAt: -1 });
  }

  const [customers, total] = await Promise.all([
    query
      .skip(skip)
      .limit(parseInt(limit)),
    Customer.countDocuments(filter)
  ]);

  res.status(200).json({
    customers,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/* Get Full Customer & GST Profiles */
const getCustomerProfileForInvoice = asyncHandler(async (req, res, next) => {
  const customerId = req.params.id;

  const customer = await Customer.findById(customerId)
    .select("name person email mobile customerType billingProfile createdAt managedBy")
    .populate("managedBy", "name email");

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  res.status(200).json(customer);
});

/* Get Active Connections with History */
const getCustomerConnectionsForInvoice = asyncHandler(async (req, res, next) => {
  const customerId = req.params.id;

  const connections = await Connection.find({
    customer: customerId,
    status: { $nin: ["Deleted", "Rejected", "Cancelled"] },
    $or: [
      { status: { $in: ["Approved", "Generation", "Active", "Notice Period"] } },
      { "history.action": "ACTIVATED" }
    ]
  }).select(`
    opportunityId fabCircuitId serviceType bandwidth status
    technicalDetails commercials providerCost ips acceptanceDate
    terminationDetails history createdAt updatedAt
  `);

  const invoiceConnections = connections.map(conn => {
    const hasBeenActivated = conn.history?.some(h => h.action === "ACTIVATED");

    const isBillable = conn.status === "Active" || conn.status === "Notice Period" ||
      (hasBeenActivated && conn.status !== "Disconnected");

    return {
      crmConnectionId: conn._id.toString(),
      opportunityId: conn.opportunityId,
      fabCircuitId: conn.fabCircuitId,
      serviceType: conn.serviceType,
      bandwidth: conn.bandwidth,
      providerCost: conn.providerCost,
      status: conn.status,
      isBillable,
      acceptanceDate: conn.acceptanceDate,
      terminationDetails: conn.terminationDetails,
      commercials: conn.commercials,
      ips: conn.ips,
      technicalDetails: conn.technicalDetails,
      history: conn.history,
      createdAt: conn.createdAt,
      updatedAt: conn.updatedAt,
    };
  });

  res.status(200).json({
    success: true,
    count: invoiceConnections.length,
    connections: invoiceConnections,
  });
});

const getDashboardConnections = async (req, res) => {
  const connections = await Connection.find(
    { customer: req.params.id },
    {
      history: 0
    }
  );

  res.json({
    count: connections.length,
    connections
  });
};

const getSamadhanCustomerWithConnections = asyncHandler(async (req, res, next) => {
  const { search } = req.query;

  if (!search) {
    return next(new AppError("Search parameter is required", 400));
  }

  const safeSearch = escapeRegex(search.trim());

  const customer = await Customer.findOne({
    name: { $regex: new RegExp(safeSearch, "i") },
    isActive: true
  });

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  const connections = await Connection.find({
    customer: customer._id,
    status: { $nin: ["Deleted", "Rejected", "Cancelled"] },
    $or: [
      { status: { $in: ["Approved", "Generation", "Active", "Notice Period"] } },
      { "history.action": "ACTIVATED" }
    ]
  }).select(`
    opportunityId fabCircuitId serviceType bandwidth status
    technicalDetails commercials ips acceptanceDate
    terminationDetails history
  `);

  const invoiceConnections = connections.map(conn => {
    const hasBeenActivated = conn.history?.some(h => h.action === "ACTIVATED");
    const isBillable = conn.status === "Active" || conn.status === "Notice Period" ||
      (hasBeenActivated && conn.status !== "Disconnected");

    return {
      crmConnectionId: conn._id.toString(),
      opportunityId: conn.opportunityId,
      fabCircuitId: conn.fabCircuitId,
      serviceType: conn.serviceType,
      bandwidth: conn.bandwidth,
      status: conn.status,
      isBillable,
      acceptanceDate: conn.acceptanceDate,
      terminationDetails: conn.terminationDetails,
      commercials: conn.commercials,
      ips: conn.ips,
      technicalDetails: conn.technicalDetails,
      history: conn.history
    };
  });

  res.status(200).json({
    success: true,
    customer: {
      customerId: customer._id.toString(),
      name: customer.name,
    },
    count: invoiceConnections.length,
    connections: invoiceConnections,
  });
});

module.exports = {
  searchCustomersForInvoice,
  getCustomerProfileForInvoice,
  getCustomerConnectionsForInvoice,
  getDashboardConnections,
  getSamadhanCustomerWithConnections
};
