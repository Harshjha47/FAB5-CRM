const user = require("../models/userModel");
const customerModel = require("../models/customerModel");
const connection = require("../models/connectionModel");

const getAllUserData = async (currentUser) => {
  if (currentUser.role === "employee") {
    const customer = await customerModel.find({ managedBy: currentUser._id });
    const customerIds = customer.map((c) => c._id);

    const connections = await connection.find({
      customer: { $in: customerIds },
    }).populate("customerModel");

    return { connections, customer };
  }
  const users = await user.find();
  const customer = await customer.find().populate("managedBy");
  const connections = await connection.find().populate("customer");

  return { users, connections, customer };
}


module.exports = {
  getAllUserData
}