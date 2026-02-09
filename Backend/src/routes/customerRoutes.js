const express = require("express");
const router = express.Router();
const {
  disconnection,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  extension,
  retention,
  createCustomer,
} = require("../controllers/customerController");
const { protect, admin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");


router.post("/create", protect, createCustomer);
router.post("/:id", protect, disconnection);
router.get("/", protect, admin, getAllCustomers);
router.get("/:id", protect, getCustomersById);
router.get("/emp", protect, getCustomersByEmp);
router.put("/extension/:id", protect, extension);
router.put("/retention/:id", protect, retention);

module.exports = router;
