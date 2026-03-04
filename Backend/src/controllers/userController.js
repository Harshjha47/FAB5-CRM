const User = require("../models/userModel");
const Connection = require("../models/connectionModel");
const Customer = require("../models/customerModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/sendEmail");
const { getAllUserData } = require("../utils/userService");
const generateJwtToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler")
const redis = require("../config/cache");
const { generateAccessToken, generateRefreshToken, hashToken } = require("../utils/tokenService");

const sentOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  await sendEmail(email, otp);
  res.status(200).json({ message: "OTP sent to email" });
});

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

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
    secure: true,
    sameSite: "none",
  });

  res.status(201).json({
    success: true,
    user,
    token: generateToken,
  });
});

const loginUser = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const isMatch = await user.matchPassword(password);
  if (!user || !isMatch) {
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
    secure: true,
    sameSite: "none",
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

const requestReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "User with this email does not exist" });
  }

  res.status(200).json({ message: "Email verified, OTP sent" });
});

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

const getAllUser = asyncHandler(async (req, res) => {
  const data = await getAllUserData(req.user);
  res.json(data);
});

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

  user.name = req.body.name || user.name;
  user.dob = req.body.dob || user.dob;
  user.phone = req.body.phone || user.phone;
  user.adharNumber = req.body.adharNumber || user.adharNumber;
  user.panNumber = req.body.panNumber || user.panNumber;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();

  const { password, ...userData } = updatedUser.toObject();

  res.status(200).json({
    message: "Profile updated successfully",
    user: userData,
  });
});

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
  await redis.setex(token, 604800, "blacklisted"); // Blacklist token for 7 days

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
