const express = require("express");
const ROLES = require("../constants/roles")

const {
  disconnection,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  extension,
  retention,
  createCustomer,
} = require("../controllers/customerController");
const { protect, admin, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

/*
 @ route - POST /api/customers/create
 @ desc - Create a new customer
 @ access - Protected
*/
router.post("/create", protect, createCustomer);

/*
 @ route - POST /api/customers/:id
 @ desc - Disconnect the customer's subscription
 @ access - Protected
*/
router.post("/:id", protect, disconnection);

/*
 @ route - GET /api/customers/
 @ desc - Get all customers (admin only)
 @ access - Protected (Admin & Owner only)
*/
router.get("/", protect, authorize(ROLES.ADMIN, ROLES.OWNER), getAllCustomers);

/*
 @ route - GET /api/customers/emp
 @ desc - Get customers by employee
 @ access - Protected 
*/
router.get("/emp", protect, getCustomersByEmp);

/*
 @ route - GET /api/customers/:id
 @ desc - Get customer by ID
 @ access - Protected 
*/
router.get("/:id", protect, getCustomersById);

/*
 @ route - PUT /api/customers/extension/:id
 @ desc - Extend customer subscription
 @ access - Protected 
*/
router.put("/extension/:id", protect, extension);

/*
 @ route - PUT /api/customers/retention/:id
 @ desc - Retain customer subscription
 @ access - Protected 
*/
router.put("/retention/:id", protect, retention);

module.exports = router;
