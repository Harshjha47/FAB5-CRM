const express = require("express");
const router = express.Router();
const { createConnection, connectionByCustomer, editConnection, shiftConnection, getConnectionById, getPendingConnections, approvedConnections, activeConnections, auditConnection, addIp } = require("../controllers/connectionController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/project", protect, getPendingConnections);
router.patch("/approve/:id", protect, approvedConnections);
router.put("/active/:id", protect, activeConnections);
router.put("/audit/:id", protect, auditConnection);
router.get("/get/:id", protect, getConnectionById);
router.get("/add/:id", protect, addIp);
router.post("/:id", protect, createConnection);
router.get("/:id", protect, connectionByCustomer);
router.put("/:id", protect, editConnection);
router.patch("/:id", protect, shiftConnection);

module.exports = router;