const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize") ;
const rateLimit = require("express-rate-limit") ;
const helmet  = require("helmet") ;
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");
const startReminderJob = require("./services/cronService");
require("./config/passport");

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = ["http://localhost:5173","http://localhost:5174"];


app.use(cors({
  origin: (origin, callback) => { 
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed by server"));
  },
  credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized ${key} in ${req.path}`);
    },
  })
);
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));



const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

//Routes
app.use("/api/customers", customerRoutes);
app.use("/api/users", userRoutes);
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));


app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

startReminderJob();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

module.exports = app;