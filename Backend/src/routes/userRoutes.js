const express = require("express");
const { sendRegistrationOtp,
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
} = require("../controllers/userController");
const { protect, authorize, domainCheck } = require("../middlewares/authMiddleware");
const { authLimiter } = require("../middlewares/rateLimiter");
const ROLES = require("../constants/roles");

const router = express.Router();

/* 
════════════════════════════════════════════════════════════════════════════════
REGISTRATION — 2 steps
════════════════════════════════════════════════════════════════════════════════ */
/*
  Step 1 : Send OTP to email
  @ route - Post api/users/register/send-otp
  @ description - Validate company email domain + send OTP
*/
router.post("/register/send-otp", authLimiter, domainCheck, sendRegistrationOtp);
/*
  Step 2 : Verify OTP and complete registration
 @ route - Post api/users/register/verify
 @ description - Verify OTP → create account → issue tokens → redirect to profile
 */
router.post("/register/verify", authLimiter, domainCheck, verifyOtpAndRegister);


/* 
 @ route - Post api/users/login
 @ description - Logins a user
*/
router.post("/login", authLimiter, loginUser);


/* 
 @ route - Post api/users/refresh
 @ description - Uses refreshToken cookie to issue a new accessToken
*/
// router.post("/refresh", refreshAccessToken);

/*
 @ route - Post api/users/logout
 @ description - Logout a user
*/
router.post("/logout", protect, logoutUser);

/* 
════════════════════════════════════════════════════════════════════════════════
PASSWORD RESET — 3 steps
════════════════════════════════════════════════════════════════════════════════
*/
/*
 @ route - Post api/users/request-reset
 @ description - Step 1: Request password reset by sending OTP to email
*/
router.post("/request-reset", authLimiter, requestReset);
/*
 @ roue - POST /api/users/verify-reset-otp
 @ description - Step 2: Verify OTP → receive short-lived reset token (15 min)
 */
router.post("/verify-reset-otp", authLimiter, verifyResetOtp);


/*
 @ route - Patch api/users/reset-password
 @ description - Step 3: Submit reset token + new password
*/
router.patch("/reset-password", authLimiter, resetPassword);

// ════════════════════════════════════════════════════════════════════════════════
// PROTECTED ROUTES — require valid accessToken
// ════════════════════════════════════════════════════════════════════════════════
/*
 @ route - Get api/users/me
 @ description - Get user profile
*/
router.get("/me", protect, getUserProfile);

/*
 @ route - Put api/users/me
 @ description - Update user profile
*/
router.put("/me", protect, updateUserProfile);

/*
 @ Protected route - Require authentication
 @ route - Get api/users/all
 @ description - Get all users(not for employee) & customers 
*/
router.get("/all", protect, getAllUser);


module.exports = router;