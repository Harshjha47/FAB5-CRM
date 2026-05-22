const express = require("express");
const { protect } = require("../middlewares/authMiddleware"); // Or use API Key middleware
const {
  searchCustomersForInvoice,
  getCustomerProfileForInvoice,
  getCustomerConnectionsForInvoice
} = require("../controllers/invoiceIntegration.controller");

const router = express.Router();

// All routes prefixed with /api/crm in server.js

router.get("/customers", protect, searchCustomersForInvoice);
router.get("/customers/:id", protect, getCustomerProfileForInvoice);
router.get("/customers/:id/connections", protect, getCustomerConnectionsForInvoice);

module.exports = router;
