const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { protect, authorize } = require("../middlewares/authMiddleware");
const ROLES = require("../constants/roles");
const {
  downloadTemplate, uploadBulkConnections, createBulkConnections,
  activeBulkConnectionTemplate, previewActiveBulkConnections, commitActiveBulkConnections
} = require("../controllers/bulkConnection.controller");

const router = express.Router();

/*
 @ GET /api/bulk-connections/download-template
 @ Download bulk connection template 
*/
router.get("/download-template", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), downloadTemplate);

/*
 @ POST /api/bulk-connections/upload
 @ Upload bulk connection file
*/
router.post("/upload", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), upload.single("file"), uploadBulkConnections);

/*
 @ POST /api/bulk-connections/:customerId/create
 @ Create bulk connections
*/
router.post(
  "/:customerId/create",
  protect,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  upload.fields([
    { name: "purchaseOrder", maxCount: 1 },
    { name: "businessAgreement", maxCount: 1 },
    { name: "caf", maxCount: 1 },
  ]),
  createBulkConnections
);

/* DEVELOPER ONLY ROUTES */
router.get(
  "/bulk-template", 
  protect, 
  authorize(ROLES.ADMIN, ROLES.OWNER), 
  activeBulkConnectionTemplate
);

router.post(
  "/bulk-preview", 
  protect, 
  authorize(ROLES.ADMIN, ROLES.OWNER), 
  upload.single("file"), 
  previewActiveBulkConnections
);

router.post(
  "/bulk-commit", 
  protect, 
  authorize(ROLES.ADMIN, ROLES.OWNER), 
  commitActiveBulkConnections
);

module.exports = router;