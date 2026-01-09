const express = require("express");
const router = express.Router();
const {
  disconnection,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  extension,
  retention,
  transfer,
  redisconnect,
} = require("../controllers/customerController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/", protect, disconnection);
router.get("/", protect, admin, getAllCustomers);
router.get("/:id", protect, getCustomersById);
router.get("/emp", protect, getCustomersByEmp);
router.put("/extension/:id", protect, extension);
router.put("/redisconnection/:id", protect, redisconnect);
router.put("/retention/:id", protect, retention);
router.put("/transfer/:id", protect, transfer);

module.exports = router;
