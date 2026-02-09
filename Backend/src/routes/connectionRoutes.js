const express = require("express");
const router = express.Router();
const { createConnection, connectionByCustomer, editConnection, shiftConnection, getConnectionById, getPendingConnections, approvedConnections, activeConnections } = require("../controllers/connectionController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/project", protect, getPendingConnections);
router.patch("/approve/:id", protect, approvedConnections);
router.put("/active/:id", protect, activeConnections);
router.post("/:id", protect, createConnection);
router.get("/:id", protect, connectionByCustomer);
router.get("/get/:id", protect, getConnectionById);
router.put("/:id", protect, editConnection);
router.patch("/:id", protect, shiftConnection);

module.exports = router;