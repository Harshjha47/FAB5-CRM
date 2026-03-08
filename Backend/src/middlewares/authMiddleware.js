const jwt = require("jsonwebtoken");
const crypt = require("crypto");
const AppError = require("../utils/AppError")
const User = require("../models/userModel");
const { redis } = require("../config/cache");

const protect = async (req, res, next) => {
  try {
    //let token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError("Not authorized, token missing", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedToken = crypt.createHash("sha256").update(token).digest("hex");
    const blacklistedToken = await redis.get(hashedToken);
    if (blacklistedToken) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }


    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(401).json({ message: "Authentication failed" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { protect, admin };
