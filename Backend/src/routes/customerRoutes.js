const express = require("express");
const multer = require("multer");
const upload = require("../middlewares/uploadMiddleware");
const ROLES = require("../constants/roles")
const {
  createCustomer,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  disconnection,
  extension,
  retention,
  previewBulkCustomers,
  commitBulkCustomers,
  downloadCustomerTemplate,
  editCustomer,
  deleteCustomer
} = require("../controllers/customerController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

const tempUpload = multer({ storage: multer.memoryStorage() });
/*   
 @ BULK CUSTOMER UPLOAD
*/
router.get("/bulk-template", protect, authorize(ROLES.ADMIN), downloadCustomerTemplate);
router.post("/bulk-preview", protect, authorize(ROLES.ADMIN), tempUpload.single("file"), previewBulkCustomers);
router.post("/bulk-commit", protect, authorize(ROLES.ADMIN), commitBulkCustomers);

/*
 @ route - POST /api/customers/create
 @ desc - Create a new customer
 @ access - Protected
*/
router.post(
  "/create", protect,
  authorize(ROLES.EMPLOYEE),
  upload.fields([
    { name: "companyDocuments", maxCount: 5 },
    { name: "signatoryDocuments", maxCount: 5 },
  ]),
  createCustomer
);

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
 @ route - PUT /api/customers/:id
 @ desc - Edit a customer
 @ access - Protected 
 */
router.put(
  "/:id", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  upload.fields([
    { name: "companyDocuments", maxCount: 5 },
    { name: "signatoryDocuments", maxCount: 5 },
  ]), editCustomer
);

/*
 @ route - DELETE /api/customers/:id
 @ desc - Delete a customer
 @ access - Protected 
 */
router.delete("/:id", protect, authorize(ROLES.ADMIN, ROLES.EMPLOYEE), deleteCustomer);

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
