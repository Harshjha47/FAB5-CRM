const express = require("express");
const ROLES = require("../constants/roles");
const upload = require("../middlewares/uploadMiddleware");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  createConnection,
  connectionByCustomer,
  getConnectionById,
  getConnectionsByStatus,
  approveConnection,
  rejectConnection,
  editRejectedConnection,
  markAsGeneration,
  cancelConnection,
  deleteConnection,
  activateConnection,
  editConnection,
  shiftConnection,
  addIp,
} = require("../controllers/connectionController");

const router = express.Router();

/*
 @ GET /api/connection/detail/:id
 @ Get all connections for a customer
 @ Access: All authenticated (employee filtered to own)
*/
router.get("/details/:id", protect, getConnectionById);

/*
 @ GET /api/connection/status/:status
 @ Get all connections for a customer
 @ Access: All authenticated (employee filtered to own)
 @ Query: ?page=1&limit=25
*/
router.get("/status/:status", protect, authorize(
  ROLES.EMPLOYEE,
  ROLES.ADMIN,
  ROLES.OWNER,
  ROLES.ORDER_GENERATION,
  ROLES.PROJECT_MANAGER
),getConnectionsByStatus);

/*
 @ PATCH /api/connection/:id/approve
 @ Approve connection
 @ Access: Admin, Owner
*/
router.patch("/:id/approve", protect, authorize(ROLES.ADMIN, ROLES.OWNER), approveConnection);

/*
 @ PATCH /api/connection/:id/reject
 @ Reject connection
 @ Access: Admin, Owner, Project Manager and Order Generation
*/
router.patch("/:id/reject", protect, authorize(ROLES.ADMIN, ROLES.OWNER, ROLES.ORDER_GENERATION, ROLES.PROJECT_MANAGER), rejectConnection);

router.patch("/:id/delete", protect, authorize(ROLES.ADMIN, ROLES.EMPLOYEE), deleteConnection);

router.patch("/:id/edit-rejected", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), editRejectedConnection);

router.patch("/:id/cancel", protect, authorize(ROLES.PROJECT_MANAGER, ROLES.ADMIN), cancelConnection);

/*
 @ PATCH /api/connection/:id/generate
 @ Generate connection
 @ Access: Admin, Order Generation
*/
router.patch("/:id/generate", protect, authorize(ROLES.ORDER_GENERATION, ROLES.ADMIN), markAsGeneration);

/*
 @ PATCH /api/connection/:id/activate
 @ Activate connection
 @ Access: Admin, Project Manager
*/
router.patch("/:id/activate", protect, authorize(ROLES.PROJECT_MANAGER, ROLES.ADMIN), activateConnection);

/*
 @ PATCH /api/connection/:id/shift
 @ Shift connection - sets back to Pending
 @ Access: Employee(own), Admin and Owner
*/
router.patch("/:id/shift", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.OWNER), shiftConnection);

/*
 @ PUT /api/connection/:id/edit
 @ Upgrade or Downgrade - sets back to Pending 
 @ Access: Employee(own), Admin and Owner
*/
router.put("/:id/edit", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.OWNER), editConnection);

/*
 @ POST /api/connection/:id/add-ip
 @ Add IP to connection - sets back to Pending
 @ Access: Employee(own), Admin and Owner
*/
router.put("/:id/add-ip", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.OWNER), addIp);

/*
 @ POST /api/connection/:customerId
 @ Create new order for a customer
 @ Access: Employee(own customers)
 */
router.post("/:customerId", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN),upload.single("purchaseOrder"), createConnection);

/*
 @ GET /api/connection/:customerId
 @ Get all connections for a customer
 @ Access: All authenticated (employee filtered to own)
*/
router.get("/:customerId", protect, connectionByCustomer);

module.exports = router;