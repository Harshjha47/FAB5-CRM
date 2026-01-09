const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile, requestReset, resetPassword, logoutUser, sentOtp} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();



// Register user
router.post("/otp", sentOtp); 
router.post("/register", registerUser); 

// Login user
router.post("/login", loginUser); 
router.post("/logout", protect, logoutUser); 

// Reset Password
router.post("/request-reset", requestReset);
router.patch("/reset-password", resetPassword);

// User profile (protected route)
router.get("/me", protect, getUserProfile);
router.put("/me", protect, upload.single("profile"), updateUserProfile);

// 1. Trigger Google Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 2. Handle Callback & Set Cookie
router.get(
  "/google/callback",
  // 'session: false' is crucial because we use JWT, not Express Sessions
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;

    // A. Generate Token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Required for 'sameSite: "none"'
      sameSite: "none",
    });

   const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

    // Redirect with token in the URL query string
    res.redirect(`${clientURL}?token=${token}`);
  }
);

module.exports = router;