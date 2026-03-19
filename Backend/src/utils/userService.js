const User = require("../models/userModel");
const Customer = require("../models/customerModel");
const ROLES = require("../constants/roles");

const getAllUserData = async (currentUser, page = 1, limit = 25) => {
  const skip = (page - 1) * limit;

  const [employees, total] = await Promise.all([
    User.find({ role: ROLES.EMPLOYEE })
      .select("-password -refreshToken -adharNumber -panNumber -resetPasswordToken -resetPasswordExpire -refreshTokenExpire")
      .populate({
        path: "customers",
        select: "name email mobile person isActive createdAt",
        options: { limit: 5 },
      })
      .skip(skip).limit(limit).sort({ createdAt: -1 }),

    User.countDocuments({ role: ROLES.EMPLOYEE }),
  ]);

  return {
    role: currentUser.role,
    total,
    page,
    pages: Math.ceil(total / limit),
    employees,
  };
}


module.exports = { getAllUserData }