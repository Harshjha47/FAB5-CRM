const express = require("express");
const ROLES = require("../constants/roles")
const {
  createCustomer,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  disconnection,
  extension,
  retention,
} = require("../controllers/customerController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

/*
 @ route - POST /api/customers/create
 @ desc - Create a new customer
 @ access - Protected
*/
router.post("/create", protect, authorize(ROLES.EMPLOYEE), createCustomer);

/*
 @ route - GET /api/customers/
 @ desc - Get all customers
 @ access - Protected (Admin, Owner, Project Manager and Order Generation only)
*/
router.get("/", protect, authorize(ROLES.ADMIN, ROLES.OWNER, ROLES.ORDER_GENERATION, ROLES.PROJECT_MANAGER), getAllCustomers);

/*
 @ route - GET /api/customers/emp
 @ desc - Get customers by employee
 @ access - Protected 
*/
router.get("/my", protect, authorize(ROLES.EMPLOYEE), getCustomersByEmp);

/*
 @ route - GET /api/customers/:id
 @ desc - Get customer by ID
 @ access - Protected 
*/
router.get("/:id", protect, getCustomersById);

/*
 @ route - POST /api/customers/:id
 @ desc - Disconnect the customer's subscription
 @ access - Protected
*/
router.post("/:id/disconnect", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.OWNER), disconnection);

/*
 @ route - PUT /api/customers/:id/extend
 @ desc - Extend customer subscription
 @ access - Protected 
*/
router.put("/:id/extend", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.OWNER), extension);

/*
 @ route - PUT /api/customers/:id/retain
 @ desc - Retain customer subscription
 @ access - Protected 
*/
router.put("/:id/retain", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.OWNER), retention);

module.exports = router;
