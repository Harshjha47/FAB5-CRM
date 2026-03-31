const crypto = require("crypto");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");
const { redis } = require("../config/cache");
const { sendOTPEmail } = require("../services/sendEmail");
const { getAllUserData } = require("../utils/userService");
// const { generateAccessToken, generateRefreshToken, hashToken } = require("../services/tokenService");
const { cookieOptions } = require("../middlewares/authMiddleware");

// ───────────────── Helper ───────────────── 
const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
const clearAuthCookies = (res) => {
  res.clearCookie("token", cookieOptions);
};

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  dob: user.dob,
  isProfileComplete: user.isProfileComplete,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

// ─────────────────── OTP Helpers ────────────────────
const OTP_EXPIRY_SECONDS = 600;
const generateAndStoreOtp = async (key) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  await redis.set(`otp:${key}`, hashedOtp, "EX", OTP_EXPIRY_SECONDS);
  return otp;
};
const verifyStoredOtp = async (key, otp) => {
  const stored = await redis.get(`otp:${key}`);
  if (!stored) return false;
  const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");
  return stored === hashedInput;
};

/* 
════════════════════════════════════════════════════════════════════════════════
REGISTRATION — 2 steps
POST /api/users/register/send-otp   → validate domain + send OTP
POST /api/users/register/verify     → verify OTP + create account + issue tokens
════════════════════════════════════════════════════════════════════════════════ 
*/
// Step 1 : Send OTP to email for registration
const sendRegistrationOtp = asyncHandler(async (req, res, next) => {
  const email = req.body.email?.toLowerCase();
  const { password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }
  if (password.length < 8) {
    return next(new AppError("Password must be at least 8 characters", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("An account already exists with this email", 409));
  }

  const otp = await generateAndStoreOtp(email);
  try {
    await sendOTPEmail(email, otp)
  } catch (error) {
    await redis.del(`otp:${email}`);
    return next(new AppError("Failed to send OTP. Please try again.", 500));
  }
  logger.info("Registration OTP sent", { email });
  res.status(200).json({
    success: true,
    message: "OTP sent to email",
  });
});

// Step 2 : Verify OTP and complete registration 
const verifyOtpAndRegister = asyncHandler(async (req, res, next) => {

  const email = req.body.email?.toLowerCase();
  const { password, otp } = req.body;
  if (!email || !password || !otp) {
    return next(new AppError("Email, password and OTP are required", 400));
  }

  const isValidOtp = await verifyStoredOtp(email, otp);
  if (!isValidOtp) {
    return next(new AppError("Invalid or expired OTP", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("An account with this email already exists", 409));
  }
  let user; 
  try {
    user = await User.create({
      email,
      password,
      ...(req.body.name && { name: req.body.name }),
    });
    await redis.del(`otp:${email}`);
  } catch (error) {
    await redis.del(`otp:${email}`);
    logger.error("Failed to create user", { email, error: error.message });
    return next(new AppError("Registration failed. Please try again.", 500));
  }

  // const accessToken = generateAccessToken(user);
  // const refreshToken = generateRefreshToken();

  // user.refreshToken = refreshToken;
  // user.refreshTokenExpire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const generateToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", generateToken, cookieOptions);

  logger.info("User registered", { email, role: user.role });

  res.status(201).json({
    success: true,
    message: "Registration successful, Please Complete Your Profile",
    token: generateToken,
    user: safeUser(user),
    redirect: "/profile"
  })
});

/*
════════════════════════════════════════════════════════════════════════════════
LOGIN
POST /api/users/login
════════════════════════════════════════════════════════════════════════════════
*/
const loginUser = asyncHandler(async (req, res, next) => {

  const email = req.body.email?.toLowerCase();
  const { password } = req.body;
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  if (!user.isActive) {
    return next(new AppError("Your account has been deactivated. Contact your administrator.", 401));
  }

  const generateToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", generateToken, cookieOptions);

  logger.info("User logged in", { email, role: user.role });

  res.status(200).json({
    success: true,
    token: generateToken,
    user: safeUser(user),
    redirect: user.isProfileComplete ? "/dashboard" : "/profile"
  });
});

/*
════════════════════════════════════════════════════════════════════════════════
REFRESH TOKEN
POST /api/users/refresh
Called by frontend automatically when accessToken expires (401 received)
════════════════════════════════════════════════════════════════════════════════
*/
// const refreshAccessToken = asyncHandler(async (req, res, next) => {
//   const token = req.cookies?.refreshToken;
//   if (!token) {
//     return next(new AppError("Refresh token not found, Please log in or register", 401));
//   }

//   const hashedToken = hashToken(token);

//   const user = await User.findOne({
//     refreshToken: hashedToken,
//     refreshTokenExpire: { $gt: Date.now() }
//   });
//   if (!user) {
//     clearAuthCookies(res);
//     return next(new AppError("Invalid or expired refresh token, Please log in", 401));
//   }

//   if (!user.isActive) {
//     clearAuthCookies(res);
//     return next(new AppError("Your account has been deactivated.", 401));
//   }

//   const newAccessToken = generateAccessToken(user);
//   const newRefreshToken = generateRefreshToken();

//   user.refreshToken = hashToken(newRefreshToken);
//   user.refreshTokenExpire = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
//   await user.save({ validateModifiedOnly: true });

//   setRefreshTokenCookie(res, newRefreshToken);

//   logger.info("Access token refreshed", { userId: user._id });

//   res.status(200).json({
//     success: true,
//     accessToken: newAccessToken,
//   });
// });

/* 
════════════════════════════════════════════════════════════════════════════════
PASSWORD RESET — 3 steps
POST /api/users/request-reset     → send OTP
POST /api/users/verify-reset-otp  → verify OTP, issue reset token
PATCH /api/users/reset-password   → use reset token to set new password
════════════════════════════════════════════════════════════════════════════════
*/
// Step 1 : Send OTP to email
const requestReset = asyncHandler(async (req, res, next) => {

  const email = req.body.email?.toLowerCase();

  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If this email exists, an OTP has been sent",
    });
  }

  const otp = await generateAndStoreOtp(`reset:${email}`);
  try {
    await sendOTPEmail(email, otp)
  } catch (error) {
    await redis.del(`otp:reset:${email}`);
    logger.error("Failed to send reset OTP", { email, error: error.message });
    return next(new AppError("Failed to send OTP. Please try again.", 500));
  }
  logger.info("Reset OTP sent", { email });

  res.status(200).json({
    success: true,
    message: "If this email exists , an OTP has been sent"
  });
});

// Step 2 : Verify OTP
const verifyResetOtp = asyncHandler(async (req, res, next) => {

  const email = req.body.email?.toLowerCase();
  const { otp } = req.body;
  if (!email || !otp) return next(new AppError("Email and OTP are required", 400));

  const isValid = await verifyStoredOtp(`reset:${email}`, otp);
  if (!isValid) return next(new AppError("Invalid or expired OTP", 400));

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  await User.updateOne(
    { email },
    {
      resetPasswordToken: hashedResetToken,
      resetPasswordExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
    }
  );
  await redis.del(`otp:reset:${email}`);

  logger.info("Reset OTP verified", { email });

  res.status(200).json({
    success: true,
    message: "OTP verified. Use the reset token to set your new password",
    resetToken
  });
});

// Step 3 : Reset password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken, password } = req.body;

  if (!resetToken || !password) {
    return next(new AppError("Reset token and password are required", 400));
  }
  if (password.length < 8) {
    return next(new AppError("Password must be at least 8 characters", 400));
  }
  const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedResetToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password");
  if (!user) return next(new AppError("Invalid or expired reset token", 400));

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  user.refreshToken = undefined;
  user.refreshTokenExpire = undefined;

  user.passwordChangedAt = Date.now() - 1000;
  await user.save();

  clearAuthCookies(res);

  logger.info("Password reset successfully", { email: user.email });

  res.status(200).json({
    success: true,
    message: "Password reset successful"
  });
});

/* 
════════════════════════════════════════════════════════════════════════════════
PROFILE
GET /api/users/me
════════════════════════════════════════════════════════════════════════════════ 
*/
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+adharNumber +panNumber").populate({
    path: "customers",
    select: "name phone status",
  });
  if (!user) return next(new AppError("User not found", 404));

  res.status(200).json({
    success: true,
    user: {
      ...safeUser(user),
      adharNumber: user.adharNumber,
      panNumber: user.panNumber,
    },
    customers: user.customers,
  });
});

// GET /api/users/all
const getAllUser = asyncHandler(async (req, res, next) => {

  const data = await getAllUserData(req.user);

  res.status(200).json({
    success: true,
    ...data,
  });
});

// PUT /api/users/me
// Update user profile
const updateUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("User not found", 404));

  const { name, dob, phone, adharNumber, panNumber } = req.body;

  if (!name || !dob || !phone || !adharNumber || !panNumber) {
    return next(new AppError("All fields are required", 400));
  }

  user.name = name || user.name;
  user.dob = dob || user.dob;
  user.phone = phone || user.phone;
  user.adharNumber = adharNumber || user.adharNumber;
  user.panNumber = panNumber || user.panNumber;
  user.isProfileComplete = true;

  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }
    user.password = req.body.password;
  }

  await user.save({ validateModifiedOnly: true });

  logger.info("User profile updated", { email: user.email });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: safeUser(user),
    redirect: "/dashboard"
  });
});

/* 
════════════════════════════════════════════════════════════════════════════════
LOGOUT
POST /api/users/logout
════════════════════════════════════════════════════════════════════════════════
*/
const logoutUser = asyncHandler(async (req, res, next) => {
  clearAuthCookies(res);

  logger.info("User logged out", { userId: req.user?._id });

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

module.exports = {
  sendRegistrationOtp,
  verifyOtpAndRegister,
  loginUser,
  // refreshAccessToken,
  requestReset,
  verifyResetOtp,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getAllUser
};
