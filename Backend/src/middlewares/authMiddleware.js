const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../utils/AppError")
const User = require("../models/userModel");
const { redis } = require("../config/cache");
const logger = require("../utils/logger")

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

//  ─────────────────── Protect Middleware ────────────────────
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError("Not authorized, token missing", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "-password -refreshToken -resetPasswordToken -adharNumber -panNumber"
    );

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    if (!user.isActive) {
      return next(new AppError("Your account has been deactivated. Please contact your administrator.", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn("Auth failure", { error: error.name, ip: req.ip, path: req.originalUrl });
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired, please log in again", 401));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token, authentication failed", 401));
    }
    return next(new AppError("Authentication failed", 401));
  }
};

// ─────────────────── Authorize Middleware ────────────────────  
const authorize = (...roles) => {
  return (req, res, next) => {
    if ( !req.user || !roles.includes(req.user.role)) {
      return next(new AppError("Forbidden: You don't have permission to access this resource", 403));
    }
    next();
  }
};

// ─────────────────── Domain Check Middleware ────────────────────
const domainCheck = (req, res, next) => {
  
  const {email} = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
  if (!allowedDomain) {
    logger.warn("ALLOWED_EMAIL_DOMAIN not set in environment — domain check skipped");
    return next();
  }

  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (emailDomain !== allowedDomain.toLowerCase()) {
    return next(new AppError("Only email with valid email addresses are allowed", 400));
  }
  next();
}

module.exports = { protect, authorize, cookieOptions, domainCheck };
