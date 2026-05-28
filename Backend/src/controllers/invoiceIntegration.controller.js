const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const Customer = require("../models/customerModel");
const Connection = require("../models/connectionModel");

const searchCustomersForInvoice = asyncHandler(async (req, res, next) => {
  const { search, page = 1, limit = 15 } = req.query;
  const filter = { isActive: true };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .select("name person email")
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
  .select("name person email mobile customerType billingProfile");

  if (!customer) {
    return next(new AppError("Customer not found", 404));
  }

  res.status(200).json(customer);
});

/* Get Active Connections with History */
const getCustomerConnectionsForInvoice = asyncHandler(async (req, res, next) => {
  const customerId = req.params.id;
  const { status } = req.query;

  const filter = { customer: customerId };
  if (status) {
    filter.status = status;
  }

  const connections = await Connection.find(filter)
  .select("opportunityId fabCircuitId serviceType technicalDetails bandwidth status commercials history");

  const optimizedConnections = connections.map(conn => {
    const relevantHistory = conn.history.filter(h => 
      ["UPGRADE", "DOWNGRADE", "RATE_REVISION", "ACTIVATED"].includes(h.action)
    );

    return {
      _id: conn._id,
      opportunityId: conn.opportunityId,
      fabCircuitId: conn.fabCircuitId,
      serviceType: conn.serviceType,
      bandwidth: conn.bandwidth,
      status: conn.status,
      commercials: conn.commercials,
      technicalDetails: conn.technicalDetails,
      // history: relevantHistory.map(h => ({
      //   action: h.action,
      //   date: h.date,
      //   bandwidth: h.bandwidth,
      //   serviceType: h.serviceType,
      //   commercials: h.commercials
      // }))
    };
  });

  res.status(200).json(optimizedConnections);
});

module.exports = {
  searchCustomersForInvoice,
  getCustomerProfileForInvoice,
  getCustomerConnectionsForInvoice
};
