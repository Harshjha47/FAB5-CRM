const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const Connection = require("../models/connectionModel");
const Customer = require("../models/customerModel");
const ROLES = require("../constants/roles");
const User = require("../models/userModel"); 


const getDashboardCustomers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;
  const filter = req.query.filter || "All"; 

  let matchStage = {};

  if (filter === "true") matchStage.isActive = true;
  if (filter === "false") matchStage.isActive = false;

  if (req.user.role === ROLES.EMPLOYEE) {
    matchStage.managedBy = req.user._id; 
  }

  const [customers, totalDocs] = await Promise.all([
    Customer.find(matchStage)
      .select("name person email mobile createdAt isActive") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(), 
    Customer.countDocuments(matchStage)
  ]);

  res.status(200).json({
    success: true,
    total: totalDocs,
    page,
    pages: Math.ceil(totalDocs / limit),
    count: customers.length,
    customers
  });
});

const getDashboardUsers = asyncHandler(async (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    return next(new AppError("Not authorized to view the employee directory", 403));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;
  const filter = req.query.filter || "All";

  let matchStage = {};

  if (filter === "employee" || filter === "admin") {
    matchStage.role = filter;
  } else if (filter === "incomplete") {
    matchStage.isProfileComplete = false;
  }

  const [users, totalDocs] = await Promise.all([
    User.find(matchStage)
      .select("name role email phone isProfileComplete") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(), 
    User.countDocuments(matchStage)
  ]);

  res.status(200).json({
    success: true,
    total: totalDocs,
    page,
    pages: Math.ceil(totalDocs / limit),
    count: users.length,
    users
  });
});

const getDashboardConnections = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;
  const statusFilter = req.query.status || "All";

  let matchStage = { status: { $ne: "Deleted" } };

  if (statusFilter !== "All") {
    let targetStatus = statusFilter;
    if (statusFilter === "Pending Only") targetStatus = "Pending";
    if (statusFilter === "Active Only") targetStatus = "Active";
    
    matchStage.status = targetStatus;
  }

  if (req.user.role === ROLES.EMPLOYEE) {
    const myCustomers = await Customer.find({ managedBy: req.user._id, isActive: true }, { _id: 1 }).lean();
    const customerIds = myCustomers.map((c) => c._id);
    matchStage.customer = { $in: customerIds };
  } else if (req.user.role === ROLES.ORDER_GENERATION) {
    matchStage.status = "Approved";
  } else if (req.user.role === ROLES.PROJECT_MANAGER) {
    matchStage.status = "Generation";
  }

const [connections, totalDocs] = await Promise.all([
  Connection.find(matchStage)
    .select("opportunityId serviceType bandwidth status createdAt customer providerCost technicalDetails createdBy") 
    .populate("customer", "name") 
    .populate("createdBy", "name") 
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(), 
  Connection.countDocuments(matchStage)
]);

  res.status(200).json({
    success: true,
    total: totalDocs,
    page,
    pages: Math.ceil(totalDocs / limit),
    count: connections.length,
    connections
  });
});

const calculateMetricsForUser = async (user) => {
  let matchStage = { status: { $ne: "Deleted" } };

  if (user.role === ROLES.EMPLOYEE) {
    const myCustomers = await Customer.find({ managedBy: user.id || user._id, isActive: true }, { _id: 1 }).lean();
    const customerIds = myCustomers.map((c) => c._id);
    matchStage.customer = { $in: customerIds };
  }

  const metrics = await Connection.aggregate([
    { $match: matchStage },
    {
      $facet: {
        statusCounts: [
          { $group: { _id: "$status", count: { $sum: 1 } } }
        ],
        financials: [
          { $match: { status: "Active" } },
          { $group: { _id: null, lifeTimeRevenue: { $sum: "$commercials.mrc" } } }
        ],
        totalOpportunities: [
          { $count: "count" }
        ]
      }
    }
  ]);

  const rawStatus = metrics[0]?.statusCounts || [];
  const rawFinancials = metrics[0]?.financials[0] || { lifeTimeRevenue: 0 };
  const rawTotalOps = metrics[0]?.totalOpportunities[0]?.count || 0;

  const counters = {
    commercialApproval: 0, 
    orderApproved: 0,      
    implementation: 0,     
    activeLinks: 0,        
    terminationPending: 0, 
    churnLink: 0           
  };

  rawStatus.forEach(item => {
    if (item._id === "Pending") counters.commercialApproval = item.count;
    if (item._id === "Approved") counters.orderApproved = item.count;
    if (item._id === "Generation") counters.implementation = item.count;
    if (item._id === "Active") counters.activeLinks = item.count;
    if (item._id === "Notice Period") counters.terminationPending = item.count;
    if (item._id === "Disconnected") counters.churnLink = item.count;
  });

  let totalCustomersQuery = { isActive: true };
  if (user.role === ROLES.EMPLOYEE) {
    totalCustomersQuery.managedBy = user.id || user._id;
  }
  const totalCustomers = await Customer.countDocuments(totalCustomersQuery);

  let totalUsersQuery = {}; 
  // if (user.role !== ROLES.ADMIN) totalUsersQuery = { ... };
  const totalUsers = await User.countDocuments(totalUsersQuery);

  const activationRate = rawTotalOps > 0 ? Math.round((counters.activeLinks / rawTotalOps) * 100) : 0;
  const churnRate = rawTotalOps > 0 ? Math.round((counters.churnLink / rawTotalOps) * 100) : 0;

  return {
    counters,
    performance: {
      lifeTimeRevenue: rawFinancials.lifeTimeRevenue,
      totalCustomers,
      totalUsers, 
      totalOpportunities: rawTotalOps,
      activationRate,
      churnRate
    }
  };
};

const getDashboardMetrics = asyncHandler(async (req, res, next) => {
  const data = await calculateMetricsForUser(req.user);
  res.status(200).json({
    success: true,
    ...data
  });
});

const triggerRealtimeMetricsUpdate = async (affectedUserId = null) => {
  if (!global.io) return;

  const adminData = await calculateMetricsForUser({ role: "admin" });
  global.io.to("room:admin").emit("metricsUpdated", adminData);

  if (affectedUserId) {
    const cleanUserId = affectedUserId.toString();
    const employeeData = await calculateMetricsForUser({ id: cleanUserId, role: ROLES.EMPLOYEE });
    global.io.to(`room:employee:${cleanUserId}`).emit("metricsUpdated", employeeData);
  }
};

const globalDashboardSearch = asyncHandler(async (req, res, next) => {
  const query = req.query.q;
  if (!query || !query.trim()) {
    return res.status(200).json({ success: true, results: { connections: [], customers: [], users: [] } });
  }

  const regex = new RegExp(query.trim(), "i");
  const isEmployee = req.user.role === ROLES.EMPLOYEE;
  const isAdminOrEmp = req.user.role === ROLES.ADMIN || isEmployee;

  // Build connection matching boundaries
  let connectionMatch = { status: { $ne: "Deleted" } };
  if (isEmployee) {
    const myCustomers = await Customer.find({ managedBy: req.user._id, isActive: true }, { _id: 1 }).lean();
    connectionMatch.customer = { $in: myCustomers.map(c => c._id) };
  }

  // Execute all three database searches concurrently
  const [connections, customers, users] = await Promise.all([
    Connection.find({
      ...connectionMatch,
      $or: [
        { opportunityId: regex },
        { serviceType: regex },
        { fabCircuitId: regex }
      ]
    })
    .select("opportunityId serviceType status customer")
    .populate("customer", "name")
    .limit(10)
    .lean(),

    isAdminOrEmp 
      ? Customer.find({
          isActive: true,
          ...(isEmployee ? { managedBy: req.user._id } : {}),
          $or: [{ name: regex }, { email: regex }]
        })
        .select("name email")
        .limit(10)
        .lean()
      : Promise.resolve([]),

    req.user.role === ROLES.ADMIN
      ? User.find({ $or: [{ name: regex }, { role: regex }] })
        .select("name role")
        .limit(10)
        .lean()
      : Promise.resolve([])
  ]);

  res.status(200).json({
    success: true,
    results: { connections, customers, users }
  });
});

module.exports = {
  getDashboardMetrics,
  triggerRealtimeMetricsUpdate,
  getDashboardConnections,
  getDashboardCustomers,
  getDashboardUsers,globalDashboardSearch,
};