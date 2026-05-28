const express = require("express");
const {
  searchCustomersForInvoice,
  getCustomerProfileForInvoice,
  getCustomerConnectionsForInvoice
} = require("../controllers/invoiceIntegration.controller");

const router = express.Router();

const protectInternal = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.INTERNAL_CRM_SECRET) {
    return next();
  }
  return res.status(401).json({ status: 'fail', message: 'Unauthorized internal request' });
};

// All routes prefixed with /api/crm in app.js
router.get("/customers", protectInternal, searchCustomersForInvoice);
router.get("/customers/:id", protectInternal, getCustomerProfileForInvoice);
router.get("/customers/:id/connections", protectInternal, getCustomerConnectionsForInvoice);

module.exports = router;