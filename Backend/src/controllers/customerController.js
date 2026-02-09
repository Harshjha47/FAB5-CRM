const Customer = require("../models/customerModel");
const User = require("../models/userModel");
const Connection = require("../models/connectionModel");
const { sendTransactionEmail } = require("../utils/sendEmail");

const createCustomer = async (req, res) => {
  try {
  const { name, email, mobile, billingProfiles, person } = req.body;

    console.log("a" );
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existCustomer = await Customer.findOne({ email });
    if (existCustomer) {
      return res.status(400).json({ message: "Customer already exist" });
    }

    if (!name || !email || !mobile) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const customer = new Customer({
      name,
      person,
      email,
      mobile,
      managedBy: user._id,
      billingProfiles: [...billingProfiles],
      isActive: true,
    });

    const savedCustomer = await customer.save();
    res.status(201).json({
      message: "Customer created successfully",
      savedCustomer,
    });
  } catch (error) {
    console.log("create customer :", error);
    res.status(500).json({ message: "Server error while creating customer" });
  }
};

const disconnection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const connectionId = req.params.id;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
console.log("b");

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const today = new Date();
    const finalDate = new Date();
    finalDate.setDate(today.getDate() + 30);

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    const historyEntry = {
      action: "DISCONNECT_INITIATED",
      performedBy: req.user._id,
      date: today,
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      terminationDetails:connection?.terminationDetails || {},
    };

    if (reason) connection.terminationDetails.reason= reason;
    if (today) connection.terminationDetails.raiseDate = today;
    if (finalDate) connection.terminationDetails.finalDate = finalDate;
    connection.status = "Notice Period"

    connection.history.push(historyEntry);
    const savedConnection = await connection.save();
    // await sendTransactionEmail("DISCONNECTION", savedCustomer, user);

    res.status(200).json({
      message: "Tarmination created successfully",
      savedConnection,
    });
  } catch (error) {
    console.error("Error connection", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
      "managedBy",
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
const extension = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ message: "connection not found" });
    }

    const customer = await Customer.findById(connection.customer);
    if (!customer) {
      return res.status(404).json({ message: "customer not found" });
    }

    const isManager = customer.managedBy.equals(user._id);
    const isAdmin = user.role === "admin";

    if (!isManager && !isAdmin) {
      return res.status(403).json({
        message:
          "Access denied. Only the Manager or Admin can extend this connection.",
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

    const historyEntry = {
      action: "EXTENDED",
      performedBy: req.user._id,
      date: today,
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      terminationDetails:connection?.terminationDetails || {},
    };

    if (today) connection.terminationDetails.raiseDate = today;
    if (parsedNewDate) connection.terminationDetails.finalDate = parsedNewDate;
    connection.status = "Notice Period"

    connection.history.push(historyEntry);
    const savedConnection = await connection.save();

    res.status(200).json({
      message: "Extended successfully",
      savedConnection,
    });
  } catch (error) {
    console.error("Extension Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const retention = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await Connection.findById(req.params.id);
    if (!connection) {
      return res.status(404).json({ message: "connection not found" });
    }

    const customer = await Customer.findById(connection.customer);
    if (!customer) {
      return res.status(404).json({ message: "customer not found" });
    }

    const isManager = customer.managedBy.equals(user._id);
    const isAdmin = user.role === "admin";

        if (!isManager && !isAdmin) {
      return res.status(403).json({
        message:
          "Access denied. Only the Manager or Admin can extend this connection.",
      });
    }

    const today = new Date();

    const historyEntry = {
      action: "RETAINED",
      performedBy: req.user._id,
      date: today,
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      terminationDetails:connection?.terminationDetails || {},
    };

    if (today) connection.terminationDetails.raiseDate = today;
    connection.terminationDetails.finalDate = "";
    connection.status = "Active"

    connection.history.push(historyEntry);
    const savedConnection = await connection.save();
    // await sendTransactionEmail("RETENTION", retainedCustomer, user);
    res.status(200).json({
      message: "Customer successfully retained! Disconnection cancelled.",
      savedConnection,
    });
  } catch (error) {
    console.error("Retention Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  disconnection,
  getAllCustomers,
  getCustomersById,
  getCustomersByEmp,
  extension,
  retention,
  createCustomer,
};
