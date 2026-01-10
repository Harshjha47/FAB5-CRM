const Customer = require("../models/customerModel");
const User = require("../models/userModel");
const { sendTransactionEmail } = require("../utils/sendEmail");

// Create
const disconnection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, btsId, circuitId, bandwidth, reason } = req.body;
    if (!name || !btsId || !circuitId || !bandwidth || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const today = new Date();
    const finalDate = new Date();
    finalDate.setDate(today.getDate() + 30);

    const existCustomer = await Customer.findOne({ circuitId });
    if (existCustomer) {
      if (existCustomer.managedBy.equals(user._id)) {
        existCustomer.status = "Pending Disconnection";
        existCustomer.currentDisconnectDate = finalDate;
        existCustomer.activityLog.push({
          action: "DISCONNECT_INITIATED",
          performedBy: user._id,
          reason,
          date: today,
          newDate: finalDate,
        });
        const savedCustomer = await existCustomer.save();

        return res.status(200).json({
          message: "DISCONNECT_INITIATED",
          savedCustomer,
        });
      }
      return res.status(400).json({ message: "Customer already exists" });
    }

    const customer = new Customer({
      name,
      btsId,
      circuitId,
      bandwidth,
      managedBy: user._id,
      currentDisconnectDate: finalDate,
      status: "Pending Disconnection",
      activityLog: [
        {
          action: "DISCONNECT_INITIATED",
          performedBy: user._id,
          reason,
          date: today,
          newDate: finalDate,
        },
      ],
    });

    const savedCustomer = await customer.save();
    await sendTransactionEmail("DISCONNECTION", savedCustomer, user);

    res.status(201).json({
      message: "Customer created successfully",
      savedCustomer,
    });
  } catch (error) {
    console.error("Error creating Customer", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Read

const getAllCustomers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const Customers = await Customer.find();
    res.json(Customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCustomersById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "managedBy activityLog.performedBy"
    );
    if (!customer)
      return res.status(404).json({ message: "customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCustomersByEmp = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const customer = await Customer.find({ managedBy: user._id });
    if (!customer)
      return res.status(404).json({ message: "customer not found" });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update

const extension = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isManager = customer.managedBy.equals(user._id);
    const isAdmin = user.role === "admin";

    if (!isManager && !isAdmin) {
      return res.status(403).json({
        message:
          "Access denied. Only the Manager or Admin can extend this customer.",
      });
    }

    const { newDate } = req.body;

    const parsedNewDate = new Date(newDate);
    if (isNaN(parsedNewDate) || parsedNewDate <= new Date()) {
      return res
        .status(400)
        .json({ message: "Extension date must be a valid future date" });
    }

    const today = new Date();

    customer.activityLog.push({
      action: "EXTENDED",
      performedBy: user._id,
      date: today,
      previousDate: customer.currentDisconnectDate,
      newDate: parsedNewDate,
      reason: customer.activityLog.reason,
    });

    customer.currentDisconnectDate = parsedNewDate;
    customer.status = "Pending Disconnection";

    const extended = await customer.save();

    res.status(200).json({
      message: "Extended successfully",
      extended,
    });
  } catch (error) {
    console.error("Extension Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const redisconnect = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const isAdmin = user.role === "admin";

    if (!customer.managedBy.equals(user._id) && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to extend this customer" });
    }

    const { reason } = req.body;
    const today = new Date();
    const finalDate = new Date();
    finalDate.setDate(today.getDate() + 30);

    customer.activityLog.push({
      action: "DISCONNECT_INITIATED",
      performedBy: user._id,
      reason,
      date: today,
      newDate: finalDate,
    });

    customer.currentDisconnectDate = finalDate;
    customer.status = "Pending Disconnection";

    const extended = await customer.save();
    await sendTransactionEmail("DISCONNECTION", extended, user);
    res.status(200).json({
      message: "Disconnect successfully",
      extended,
    });
  } catch (error) {
    console.error("Disconnect Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const retention = async (req, res) => { 
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const isAdmin = user.role === "admin";
    if (!customer.managedBy.equals(user._id) && !isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to retain this customer" });
    }

    const { reason } = req.body;
    const today = new Date();

    customer.activityLog.push({
      action: "RETAINED",
      performedBy: user._id,
      date: today,
      previousDate: customer.currentDisconnectDate,
      newDate: null,
      reason: reason || "Customer decided to continue services",
    });

    customer.status = "Active";
    customer.currentDisconnectDate = null;

    const retainedCustomer = await customer.save();
    await sendTransactionEmail("RETENTION", retainedCustomer, user);
    res.status(200).json({
      message: "Customer successfully retained! Disconnection cancelled.",
      retainedCustomer,
    });
  } catch (error) {
    console.error("Retention Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const transfer = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    if (!customer.managedBy.equals(user._id))
      return res.status(401).json({ message: "User not authorized" });

    const { empMail } = req.body;
    if (!empMail) return res.status(400).json({ message: "data not found" });

    const userEmp = await User.findOne({ email: empMail });
    if (!userEmp)
      return res.status(404).json({ message: "Employee not found" });

    customer.activityLog.push({
      action: "TRANSFERRED",
      performedBy: user._id,
      date: new Date(),
      reason: `Transferred from ${user.email} to ${userEmp.email}`,
      previousDate: customer.currentDisconnectDate,
      newDate: customer.currentDisconnectDate,
    });

    customer.managedBy = userEmp._id;

    const cus = await customer.save();

    res.status(200).json({
      message: "Customer successfully transfar",
      cus,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  disconnection,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  extension,
  retention,
  transfer,
  redisconnect,
};
