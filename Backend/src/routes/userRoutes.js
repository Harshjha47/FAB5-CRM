const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, requestReset, resetPassword, logoutUser, sentOtp, getAllUser, refreshToken} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const jwt = require("jsonwebtoken");
const { routes } = require("../app");

const router = express.Router();

/*
  @ route - Post api/users/registe
  @ description - Register a user 
*/
router.post("/register", registerUser); 

/*
 @ route - Post api/users/login
 @ description - Login a user
 */
router.post("/login", loginUser); 

/*
 @ route - Post api/users/refresh
 @ description - Refresh access token using refresh token
  (commented out for now, can be enabled later)
  // router.post("/refresh", refreshToken );
*/

/*
 @ route - Post api/users/otp
 @ description - Send OTP to user email for password reset
*/
router.post("/otp", sentOtp); 

/*
 @ route - Post api/users/logout
 @ description - Logout a user
*/
router.post("/logout", protect, logoutUser); 

/*
 @ route - Post api/users/request-reset
 @ description - Request password reset by sending OTP to email
*/
router.post("/request-reset", requestReset);

/*
 @ route - Patch api/users/reset-password
 @ description - Reset password using email and new password
*/
router.patch("/reset-password", resetPassword);

/*
 @ Protected route - Require authentication
 @ route - Get api/users/me
 @ description - Get user profile
*/
router.get("/me", protect, getUserProfile);

/*
 @ Protected route - Require authentication
 @ route - Get api/users/all
 @ description - Get all users (admin only), assigned customers (employee only) & all customers (project manager only)
*/
router.get("/all", protect, getAllUser);

/*
 @ Protected route - Require authentication
 @ route - Put api/users/me
 @ description - Update user profile with optional profile picture upload
*/
router.put("/me", protect, upload.single("profile"), updateUserProfile);

module.exports = router;