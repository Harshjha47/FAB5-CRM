const User = require("../models/userModel");
const Connection = require("../models/connectionModel");
const Customer = require("../models/customerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");
const { getAllUserData } = require("../utils/userService");
const generateJwtToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler")
const { redis } = require("../config/cache");
const { generateAccessToken, generateRefreshToken, hashToken } = require("../utils/tokenService");

// Send OTP to email
const sentOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await sendEmail(email, otp);
  res.status(200).json({ message: "OTP sent to email" });
});
hashToken

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = await User.create({
    email,
    password,
  });
  const generateToken = generateJwtToken(user);

  res.cookie("token", generateToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken,
  });
});

// Login user and generate JWT token
const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Refresh Token and Access Token Implementation (Commented out for now, can be enabled later)
  /*
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();
  
    user.refreshToken = hashToken(refreshToken);
    user.refreshTokenExpire = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    await user.save();
  
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  */
  const generateToken = generateJwtToken(user)

  res.cookie("token", generateToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    user,
    token: generateToken,
  });
});

// Refresh Token and Access Token Implementation (Commented out for now, can be enabled later)
/*
const refreshToken = asyncHandler(async (req,res) => {
  const token = req.cookies.refreshToken;
  if(!token){
    return res.status(401).json({ message: "No token provided" });
  }

  const hashedToken = hashToken(token);
  const user = await User.findOne({ 
    refreshToken: hashedToken,
    refreshTokenExpire: { $gt: Date.now() } 
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
  
  const newAccessToken = generateAccessToken(user);
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 15 * 60 * 1000, // 15 minutes
  })
  res.status(200).json({ message: "Access token refreshed" });
});
*/

// Request password reset
const requestReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json({ message: "If this Email Exist, OTP has been sent" });
  }

  res.status(200).json({ message: "Email verified, OTP sent" });
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and new password are required" });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update password
  user.password = password;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

//  Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("customers");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});

// Get all users (Admin only)
const getAllUser = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const data = await getAllUserData(req.user, page, limit);
  res.json(data);
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("customers");
  console.log(user)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, dob, phone, adharNumber, panNumber } = req.body;

  if (!name || !dob || !phone || !adharNumber || !panNumber) {
    return res.status(400).json({ message: "all field must be filled" });
  }

  user.name = name || user.name;
  user.dob = dob || user.dob;
  user.phone = phone || user.phone;
  user.adharNumber = adharNumber || user.adharNumber;
  user.panNumber = panNumber || user.panNumber;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  const { password, ...userData } = updatedUser.toObject();

  res.status(200).json({
    message: "Profile updated successfully",
    user: userData,
  });
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  /*
    const refreshToken = req.cookies.refreshToken ;
  
    if (refreshToken) {
      const hashedToken = hashToken(refreshToken);
      await User.updateOne(
        { refreshToken: hashedToken },
        { refreshToken: null, refreshTokenExpire: null }
      );
    }
  
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
  
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
  */

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({
      message: "No token provided"
    });
  }
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // res.cookie("token", "", {
  //   httpOnly: true,
  //   expires: new Date(0),
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "none",
  // });
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  await redis.set(hashedToken, "blacklisted", "EX", 60*60*24*7); // Blacklist token for 7 days

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  //refreshToken,
  getUserProfile,
  updateUserProfile,
  requestReset,
  resetPassword,
  logoutUser,
  sentOtp,
  getAllUser,
};
