const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const { globalLimiter } = require("./middlewares/rateLimiter");
const logger = require("./utils/logger");
const AppError = require("./utils/AppError");

const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const connectionRoutes = require("./routes/connectionRoutes");

const app = express();

// ────────────── Allowed Origins ─────────────────────────
const allowedOrigins = [process.env.CLIENT_URL];
if (process.env.NODE_ENV === "development") {
  allowedOrigins.push("http://localhost:5173", "http://localhost:5174");

}

// ─────────── Trust Proxy (for secure cookies behind proxies) ────────────────
app.set('trust proxy', 1);

// ──────────────── Security Headers with Helmet ─────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ──────────────── Global Rate Limiting ─────────────────────────────
app.use(globalLimiter);

// ──────────────── CORS Configuration ─────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new AppError("CORS not allowed by server", 403));
  },
  credentials: true
}));

// ──────────────── Body Parsers and Cookie Parser ──────────────────────────────
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

// ──────────────── Data Sanitization against NoSQL Injection ──────────────────────────────
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      logger.warn("Suspicious input sanitized", { key, path: req.path, ip: req.ip });
    },
  })
);

// ──────────────── HTTP Request Logging with Morgan ──────────────────────────────
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    skip: (req) => req.path === "/health",
    stream: { write: (message) => logger.http(message.trim()) }
  }));

// ──────────────── Routes ─────────────────────────────
app.use("/api/customers", customerRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/users", userRoutes);

// ──────────────── Health Check Endpoint ─────────────────────────────
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({
    status: "ok",
    db: dbState,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ──────────────────────────── Test Route ─────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

// ──────────────── 404 Handler ─────────────────────────────
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// ──────────────── Global Error Handler ─────────────────────────────
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  logger.error("Request Error:", {
    message: err.message,
    statusCode: err.statusCode,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
    ...(isDev && { stack: err.stack }),
  });
  const message = isDev
    ? err.message
    : err.isOperational
      ? err.message
      : "Something went wrong";

  res.status(err.statusCode || 500).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
});

//  ─────────────── Uncaught Exceptions ─────────────────────────────
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", { err: err.message, stack: err.stack });
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", { err: err.message, stack: err.stack });
  process.exit(1);
});


module.exports = app;