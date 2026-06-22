const User = require("../models/userModel");
const Customer = require("../models/customerModel");
const Connection = require("../models/connectionModel");
const ROLES = require("../constants/roles");

const getAllUserData = async (currentUser, page = 1, limit = 25) => {
  const skip = (page - 1) * limit;
  if (currentUser.role === "employee") {
    const customers = await Customer.find({ managedBy: currentUser._id, isActive: true })/*.skip(skip).limit(limit)*/;
    const customerIds = customers.map((c) => c._id);

    const connections = await Connection.find({
      customer: { $in: customerIds },
      status: { $ne: "Deleted" }
    }).populate("customer createdBy")/*.skip(skip).limit(limit)*/;

    return { connections, customers };
  }

  else if (currentUser.role === "admin") {
    const users = await User.find();
    const customers = await Customer.find({ isActive: true }).populate("managedBy");
    const connections = await Connection.find({ status: { $ne: "Deleted" } }).populate("customer createdBy");
    return { users, connections, customers };
  } else {
    if (currentUser.role === "owner") {
      const connections = await Connection.find({ status: "Pending" }).populate("customer createdBy");
      return { connections };
    } else if (currentUser.role === "order_generation") {
      const connections = await Connection.find({ status: "Approved" }).populate("customer createdBy");
      return { connections };
    }
    else if (currentUser.role === "project_manager") {
      const connections = await Connection.find({ status: "Generation" }).populate("customer createdBy");
      return { connections };
    }
  }


}


module.exports = { getAllUserData }
