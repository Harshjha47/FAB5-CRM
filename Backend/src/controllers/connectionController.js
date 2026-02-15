const User = require("../models/userModel");
const Connection = require("../models/connectionModel");
const Customer = require("../models/customerModel");

const createConnection = async (req, res) => {
  const {
    AbtsId,
    Aaddress,
    BbtsId,
    Baddress,
    telcoProvider,
    serviceType,
    bandwidth,
    mrc,
    otc,
    advance,
    ratePerMb,
  } = req.body;
  const customerId = req.params.id;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existCustomer = await Customer.findById(customerId);

    if (!existCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (
      !AbtsId ||
      !Aaddress ||
      !BbtsId ||
      !Baddress ||
      !telcoProvider ||
      !serviceType ||
      !bandwidth ||
      !mrc ||
      !otc ||
      !advance ||
      !ratePerMb
    ) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const connection = new Connection({
      customer: customerId,
      serviceType,
      technicalDetails: {
        aEnd: {
          btsId: AbtsId,
          address: Aaddress,
        },
        bEnd: {
          btsId: BbtsId,
          address: Baddress,
        },
        telcoProvider,
      },
      bandwidth,
      commercials: {
        mrc,
        ratePerMb,
        otc,
        advance,
      },
      status: "Pending",
      history: [],
    });

    const savedConnection = await connection.save();
    res.status(201).json({
      message: "connection created successfully",
      savedConnection,
    });
  } catch (error) {
    console.log("create connection :", error);
    res.status(500).json({ message: "Server error while creating connection" });
  }
};
const addIp = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const { ip, cost } = req.body;
    const [user, connection] = await Promise.all([
      User.findById(req.user._id),
      Connection.findById(connectionId)
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!connection) return res.status(404).json({ message: "Connection not found" });
    const historyEntry = {
      action: "IP_ADDITION",
      performedBy: req.user._id,
      date: new Date(),
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      terminationDetails: connection.terminationDetails || {},
      Ips: { ip, cost } 
    };

    connection.status = "Pending";
    connection.Ips = {
      ip: (connection.Ips?.ip || 0) + Number(ip),
      cost: (connection.Ips?.cost || 0) + Number(cost)
    };

    connection.history.push(historyEntry);
    
    await connection.save();
    return res.status(200).json({ 
      message: "IP addition requested successfully", 
      connection 
    });

  } catch (err) {
    console.error("Add IP Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
const editConnection = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const { serviceType, bandwidth, mrc, ratePerMb } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const actionType =
      connection.bandwidth < bandwidth ? "UPGRADE" : "DOWNGRADE";

    const historyEntry = {
      action: actionType || "UPGRADE",
      performedBy: req.user._id,
      date: new Date(),
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      Ips:connection?.Ips,
      terminationDetails: connection?.terminationDetails || {},
    };

    if (serviceType) connection.serviceType = serviceType;
    if (bandwidth) connection.bandwidth = bandwidth;
    if (mrc) connection.commercials.mrc = mrc;
    if (ratePerMb) connection.commercials.ratePerMb = ratePerMb;
    connection.status = "Pending";

    connection.history.push(historyEntry);
    const savedConnection = await connection.save();

    res.status(200).json({
      message: "Update Successful",
    });
  } catch (error) {
    console.error("Edit Connection Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const shiftConnection = async (req, res) => {
  try {
    const connectionId = req.params.id;
    const { ABtsId, BBtsId, serviceType, otc } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    const historyEntry = {
      action: "SHIFTING",
      performedBy: req.user._id,
      date: new Date(),
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      Ips:connection?.Ips,
      terminationDetails: connection?.terminationDetails || {},
    };

    if (serviceType) connection.serviceType = serviceType;
    if (BBtsId) connection.technicalDetails.bEnd.btsId = BBtsId;
    if (ABtsId) connection.technicalDetails.aEnd.btsId = ABtsId;
    if (otc) connection.commercials.otc = otc;
    connection.status = "Pending";

    connection.history.push(historyEntry);
    const savedConnection = await connection.save();

    res.status(200).json({
      message: "Update Successful",
    });
  } catch (error) {
    console.error("Edit Connection Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const processLifecycleAction = async (req, res) => {
  try {
    const { circuitId } = req.params;
    const { actionType, ...updates } = req.body;

    const connection = await Connection.findOne({ circuitId });
    if (!connection) return res.status(404).json({ message: "LSI not found" });

    // Step A: Create Snapshot of OLD data before updating
    const snapshot = {
      action: actionType, // UPGRADE, DOWNGRADE, or SHIFTING
      performedBy: req.user._id,
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      date: new Date(),
    };

    // Step B: Update the live document with new values
    if (updates.serviceType) connection.serviceType = updates.serviceType;
    if (updates.bandwidth) connection.bandwidth = updates.bandwidth;

    if (updates.commercials) {
      connection.commercials = {
        ...connection.commercials.toObject(),
        ...updates.commercials,
      };
    }

    if (updates.technicalDetails) {
      connection.technicalDetails = {
        ...connection.technicalDetails.toObject(),
        ...updates.technicalDetails,
      };
    }

    // Step C: Push snapshot to history
    connection.history.push(snapshot);
    await connection.save();

    res.status(200).json({ message: `${actionType} processed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

const processTransmission = async (req, res) => {
  try {
    const { circuitId } = req.params;
    const { actionType, disconnectionDate, reason } = req.body;

    const connection = await Connection.findOne({ circuitId });
    if (!connection) return res.status(404).json({ message: "LSI not found" });

    // Snapshot of current state
    const snapshot = {
      action: actionType,
      performedBy: req.user._id,
      serviceType: connection.serviceType,
      bandwidth: connection.bandwidth,
      technicalDetails: connection.technicalDetails,
      commercials: connection.commercials,
      date: new Date(),
    };

    // Update Logic based on Action
    if (actionType === "DISCONNECT_INITIATED") {
      connection.status = "Notice Period";
      connection.currentDisconnectDate = disconnectionDate;
    } else if (actionType === "EXTENDED") {
      connection.currentDisconnectDate = disconnectionDate; // New extended date
    } else if (actionType === "RETAINED") {
      connection.status = "Active";
      connection.currentDisconnectDate = null; // Clear the kill date
    }

    connection.history.push(snapshot);
    await connection.save();

    res.status(200).json({ message: `Service ${actionType}` });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Transmission update failed", error: error.message });
  }
};

const getConnectionById = async (req, res) => {
  try {
    const connection = await Connection.findById(req.params.id).populate(
      "customer",
    );
    if (!connection)
      return res.status(404).json({ message: "connection not found" });
    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const connectionByCustomer = async (req, res) => {
  try {
    // 1. Verify the requesting User (Admin/Sales)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const customerId = req.params.id;
    const existCustomer = await Customer.findById(customerId);

    if (!existCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const connections = await Connection.find({ customer: customerId });
    res.status(200).json({
      success: true,
      count: connections.length,
      connections,
    });
  } catch (error) {
    console.error("Fetch connections error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPendingConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role == "owner") {
      const pendingConnections = await Connection.find({ status: "Pending" })
        .populate("customer")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: pendingConnections.length,
        data: pendingConnections,
      });
    }
    if (user.role == "project") {
      const pendingConnections = await Connection.find({ status: "Approved" })
        .populate("customer")
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        data: pendingConnections,
      });
    }
  } catch (error) {
    console.error("Get Pending Connections Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const approvedConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role != "owner" && user.role != "admin") {
      return res.status(401).json({ message: "User not Auth" });
    }
    const connectionId = req.params.id;
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    connection.status = "Approved";
    const savedConnection = await connection.save();

    res.status(200).json({
      message: "Update Successful",
    });
  } catch (error) {
    console.error(" Connections Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const activeConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role != "project" && user.role != "admin") {
      return res.status(401).json({ message: "User not Auth" });
    }
    const connectionId = req.params.id;
    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }
    const { fabCircuitId, talcoCircuitId } = req.body;

    const today = new Date();
    connection.circuitId.acceptanceDate = today;
    connection.circuitId.fabCircuitId = fabCircuitId;
    connection.circuitId.talcoCircuitId = talcoCircuitId;
    connection.status = "Active";
    const savedConnection = await connection.save();

    res.status(200).json({
      message: "Update Successful",
    });
  } catch (error) {
    console.error(" Connections Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const auditConnection = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const connectionId = req.params.id;
    const connection = await Connection.findById(connectionId);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!connection) return res.status(404).json({ message: "Connection not found" });

    let updated = false;

    // 1. OWNER / ADMIN: Moves Pending -> Approved
    if ((user.role === "owner" || user.role === "admin") && connection.status === "Pending") {
      connection.status = "Approved";
      updated = true;
    } 
    // 2. GENERATION / ADMIN: Moves Approved -> Generation
    else if ((user.role === "generation" || user.role === "admin") && connection.status === "Approved") {
      connection.status = "Generation";
      updated = true;
    } 
    // 3. PROJECT / ADMIN: Moves Generation -> Active
    else if ((user.role === "project" || user.role === "admin") && connection.status === "Generation") {
      connection.status = "Active";
      updated = true;
    }

    if (updated) {
      await connection.save();
      return res.status(200).json({ message: `Status updated to ${connection.status}` });
    } else {
      return res.status(400).json({ message: "Action not allowed for current connection status or user role" });
    }

  } catch (error) {
    console.error("Audit Connection Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = {
  editConnection,
  getPendingConnections,
  approvedConnections,
  createConnection,
  shiftConnection,
  getConnectionById,
  connectionByCustomer,
  activeConnections,
  auditConnection,
  addIp,
};
