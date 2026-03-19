const User = require("../models/userModel");
const Customer = require("../models/customerModel");
const Connection = require("../models/connectionModel");
const ROLES = require("../constants/roles");

const getAllUserData = async (currentUser, page = 1, limit = 25) => {
  const skip = (page - 1) * limit;
  if (currentUser.role === "employee") {
    const customers = await Customer.find({ managedBy: currentUser._id }).skip(skip).limit(limit);
    const customerIds = customers.map((c) => c._id);

    const connections = await connection.find({
      customer: { $in: customerIds },
    }).populate("customerModel");

    return { connections, customers };
  }
  const users = await User.find();
  const customers = await Customer.find().populate("managedBy");
  const connections = await Connection.find().populate("customer");

  return { users, connections, customers };
}


module.exports = { getAllUserData }