const express = require("express");
const router = express.Router();
const { getDashboardMetrics, getDashboardConnections, getDashboardCustomers, getDashboardUsers, globalDashboardSearch } = require("../controllers/dashboard.controller");
const { protect, authorize } = require("../middlewares/authMiddleware"); 
const ROLES = require("../constants/roles");
router.use(protect);

router.get("/metrics", getDashboardMetrics);
router.get("/connections", getDashboardConnections);
router.get("/customers", getDashboardCustomers);
router.get("/search", globalDashboardSearch);
router.get("/users", authorize(ROLES.ADMIN), getDashboardUsers);

module.exports = router;