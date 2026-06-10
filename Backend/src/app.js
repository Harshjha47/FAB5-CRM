const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const crypto = require("crypto");

const { globalLimiter } = require("./middlewares/rateLimiter");
const logger = require("./utils/logger");
const AppError = require("./utils/AppError");

const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const bulkConnectionRoutes = require("./routes/bulkConnection.routes");
const connectionRoutes = require("./routes/connectionRoutes");
const integrationRoutes = require("./routes/integration.routes");

const app = express();

// ────────────── Allowed Origins ─────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://crm.fab5connect.com",
  "http://localhost:5173",
  "https://fab-5-crm.vercel.app",
  "http://localhost:5174",
].filter(Boolean);

// ─────────── Trust Proxy (for secure cookies behind proxies) ────────────────
app.set('trust proxy', 1);

// ──────────────── Security Headers with Helmet ─────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ──────────────── Global Rate Limiting ─────────────────────────────
//app.use(globalLimiter);

// ──────────────── CORS Configuration ─────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new AppError("CORS not allowed by server", 403));
  },
  credentials: true
}));

// ─────────────── Handle Preflight Before Rate Limiter ─────────────────────────────
app.options("*", cors());

// ──────────────── Body Parsers and Cookie Parser ──────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID();
  res.setHeader("X-Request-ID", req.requestId);
  next();
});

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
  morgan((tokens, req, res) =>
    JSON.stringify({
      type: "request",
      timestamp: tokens.date(req, res, "iso"),
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      responseTime: Number(tokens["response-time"](req, res)),
      ip: req.ip,
      userAgent: req.get("user-agent"),
      requestId: req.requestId,
    }),
    {
      skip: (req) => req.path === "/health",
      stream: {
        write: (message) => logger.http(JSON.parse(message)),
      },
    }
  )
);

// ──────────────── Routes ─────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/bulk-connections", bulkConnectionRoutes);
app.use("/api/connection", connectionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/crm", integrationRoutes);

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
  
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(e => e.message).join(", ");
    return res.status(400).json({ success: false, message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  logger.error("Request Error:", {
    requestId: req.requestId,
    userId: req.user?._id,
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


module.exports = app;
