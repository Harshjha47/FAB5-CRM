const user = require("../models/userModel");
const customerModel = require("../models/customerModel");
const connection = require("../models/connectionModel");

const getAllUserData = async (currentUser, page=1, limit=25) => {
  const skip = (page - 1) * limit;
  if (currentUser.role === "employee") {
    const customers = await customerModel.find({managedBy: currentUser._id}).skip(skip).limit(limit);
    const customerIds = customers.map((c) => c._id);

    const connections = await connection.find({
      customer: { $in: customerIds },
    }).populate("customerModel");

    return { connections, customers };
  }
  const users = await user.find();
  const customers = await customerModel.find().populate("managedBy");
  const connections = await connection.find().populate("customer");

  return { users, connections, customers };
}


module.exports = {
  getAllUserData
}