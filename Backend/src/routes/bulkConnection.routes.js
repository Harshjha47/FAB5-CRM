const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const { protect, authorize } = require("../middlewares/authMiddleware");
const ROLES = require("../constants/roles");
const { updateDashboardMetricsPostResponse } = require("../middlewares/realtimeMiddleware");
const {
  downloadTemplate, uploadBulkConnections, createBulkConnections,
  activeBulkConnectionTemplate, previewActiveBulkConnections, commitActiveBulkConnections
} = require("../controllers/bulkConnection.controller");

const router = express.Router();
router.get("/download-template", protect, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), downloadTemplate);
router.post("/upload", protect,updateDashboardMetricsPostResponse, authorize(ROLES.EMPLOYEE, ROLES.ADMIN), upload.single("file"), uploadBulkConnections);
router.post(
  "/:customerId/create",
  protect,updateDashboardMetricsPostResponse,
  authorize(ROLES.EMPLOYEE, ROLES.ADMIN),
  upload.fields([
    { name: "purchaseOrder", maxCount: 1 },
    { name: "businessAgreement", maxCount: 1 },
    { name: "caf", maxCount: 1 },
  ]),
  createBulkConnections
);
router.get(
  "/bulk-template",
  protect,
  authorize(ROLES.ADMIN, ROLES.OWNER),
  activeBulkConnectionTemplate
);

router.post(
  "/bulk-preview",
  protect,updateDashboardMetricsPostResponse,
  authorize(ROLES.ADMIN, ROLES.OWNER),
  upload.single("file"),
  previewActiveBulkConnections
);

router.post(
  "/bulk-commit",
  protect,updateDashboardMetricsPostResponse,
  authorize(ROLES.ADMIN, ROLES.OWNER),
  commitActiveBulkConnections
);

module.exports = router;